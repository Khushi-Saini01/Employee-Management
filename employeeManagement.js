const readline = require("readline");

// Create interface for CLI input/output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Employee data storage (in-memory array)
let employees = [];

// Show menu options
function showMenu() {
  console.log("\n=== Employee Management System ===");
  console.log("1. Add Employee");
  console.log("2. List Employees");
  console.log("3. Remove Employee");
  console.log("4. Exit");

  rl.question("Choose an option: ", (choice) => {
    switch (choice.trim()) {
      case "1":
        addEmployee();
        break;
      case "2":
        listEmployees();
        break;
      case "3":
        removeEmployee();
        break;
      case "4":
        console.log("Exiting... Goodbye!");
        rl.close();
        break;
      default:
        console.log("Invalid choice. Please try again.");
        showMenu();
    }
  });
}

// Add a new employee
function addEmployee() {
  rl.question("Enter Employee ID: ", (id) => {
    // check if ID already exists
    if (employees.find((emp) => emp.id === id)) {
      console.log("❌ Employee with this ID already exists!");
      return showMenu();
    }

    rl.question("Enter Employee Name: ", (name) => {
      employees.push({ id, name });
      console.log(`✅ Employee Added: { ID: ${id}, Name: ${name} }`);
      showMenu();
    });
  });
}

// List all employees
function listEmployees() {
  console.log("\n--- Employee List ---");
  if (employees.length === 0) {
    console.log("No employees found.");
  } else {
    employees.forEach((emp, index) => {
      console.log(`${index + 1}. ID: ${emp.id}, Name: ${emp.name}`);
    });
  }
  showMenu();
}

// Remove an employee by ID
function removeEmployee() {
  rl.question("Enter Employee ID to remove: ", (id) => {
    const index = employees.findIndex((emp) => emp.id === id);
    if (index === -1) {
      console.log("❌ Employee not found!");
    } else {
      const removed = employees.splice(index, 1);
      console.log(`🗑️ Removed Employee: { ID: ${removed[0].id}, Name: ${removed[0].name} }`);
    }
    showMenu();
  });
}

// Start the app
showMenu();
