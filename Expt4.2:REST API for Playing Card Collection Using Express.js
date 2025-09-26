const express = require("express");
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory card collection
let cards = [];
let nextId = 1; // simple auto-increment ID

// ===============================
// 1. List all cards
// ===============================
app.get("/cards", (req, res) => {
  res.json({ success: true, data: cards });
});

// ===============================
// 2. Add a new card
// ===============================
app.post("/cards", (req, res) => {
  const { suit, value } = req.body;

  if (!suit || !value) {
    return res
      .status(400)
      .json({ success: false, message: "Suit and value are required." });
  }

  const newCard = { id: nextId++, suit, value };
  cards.push(newCard);

  res
    .status(201)
    .json({ success: true, message: "Card added successfully.", card: newCard });
});

// ===============================
// 3. Get a card by ID
// ===============================
app.get("/cards/:id", (req, res) => {
  const cardId = parseInt(req.params.id);
  const card = cards.find((c) => c.id === cardId);

  if (!card) {
    return res.status(404).json({ success: false, message: "Card not found." });
  }

  res.json({ success: true, card });
});

// ===============================
// 4. Delete a card by ID
// ===============================
app.delete("/cards/:id", (req, res) => {
  const cardId = parseInt(req.params.id);
  const index = cards.findIndex((c) => c.id === cardId);

  if (index === -1) {
    return res.status(404).json({ success: false, message: "Card not found." });
  }

  const removed = cards.splice(index, 1);
  res.json({
    success: true,
    message: "Card deleted.",
    card: removed[0],
  });
});

// ===============================
// Start server (with auto-port)
// ===============================
const DEFAULT_PORT = process.env.PORT || 3000;

const server = app.listen(DEFAULT_PORT, () => {
  console.log(`🎴 API running at http://localhost:${server.address().port}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`⚠️ Port ${DEFAULT_PORT} busy. Trying another one...`);
    const newServer = app.listen(0, () => {
      console.log(`🎴 API running at http://localhost:${newServer.address().port}`);
    });
  } else {
    console.error("❌ Server error:", err);
  }
});
