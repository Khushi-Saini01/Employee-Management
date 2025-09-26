const express = require("express");
const app = express();
app.use(express.json());

const DEFAULT_PORT = process.env.PORT || 3000;

// ===============================
// Seat Data
// ===============================
let seats = {
  A1: { status: "available", lockedBy: null, lockExpires: null },
  A2: { status: "available", lockedBy: null, lockExpires: null },
  A3: { status: "available", lockedBy: null, lockExpires: null },
  B1: { status: "available", lockedBy: null, lockExpires: null },
  B2: { status: "available", lockedBy: null, lockExpires: null },
  B3: { status: "available", lockedBy: null, lockExpires: null },
};

const LOCK_DURATION = 60 * 1000; // 1 minute

// Check and expire locks
function isLockExpired(seat) {
  if (seat.status === "locked" && seat.lockExpires && Date.now() > seat.lockExpires) {
    seat.status = "available";
    seat.lockedBy = null;
    seat.lockExpires = null;
  }
}

// ===============================
// Routes
// ===============================

// View all seats
app.get("/seats", (req, res) => {
  for (let key in seats) isLockExpired(seats[key]);
  res.json({ success: true, seats });
});

// Lock a seat
app.post("/seats/lock", (req, res) => {
  const { seatId, userId } = req.body;
  if (!seatId || !userId) return res.status(400).json({ success: false, message: "seatId and userId required" });

  const seat = seats[seatId];
  if (!seat) return res.status(404).json({ success: false, message: "Seat not found" });

  isLockExpired(seat);

  if (seat.status === "booked") return res.status(400).json({ success: false, message: "Seat already booked" });
  if (seat.status === "locked" && seat.lockedBy !== userId) return res.status(400).json({ success: false, message: "Seat locked by another user" });

  seat.status = "locked";
  seat.lockedBy = userId;
  seat.lockExpires = Date.now() + LOCK_DURATION;

  res.json({ success: true, message: `Seat ${seatId} locked for 1 minute`, seat });
});

// Confirm booking
app.post("/seats/confirm", (req, res) => {
  const { seatId, userId } = req.body;
  if (!seatId || !userId) return res.status(400).json({ success: false, message: "seatId and userId required" });

  const seat = seats[seatId];
  if (!seat) return res.status(404).json({ success: false, message: "Seat not found" });

  isLockExpired(seat);

  if (seat.status === "booked") return res.status(400).json({ success: false, message: "Seat already booked" });
  if (seat.status !== "locked" || seat.lockedBy !== userId) return res.status(400).json({ success: false, message: "Seat must be locked by you" });

  seat.status = "booked";
  seat.lockedBy = null;
  seat.lockExpires = null;

  res.json({ success: true, message: `Seat ${seatId} booked successfully!`, seat });
});

// ===============================
// Start Server (Auto-port)
// ===============================
function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`🎟️ Ticket Booking API running at http://localhost:${server.address().port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`⚠️ Port ${port} busy. Trying another free port...`);
      startServer(0); // 0 = pick random free port
    } else {
      console.error("❌ Server error:", err);
    }
  });
}

startServer(DEFAULT_PORT);
