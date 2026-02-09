
// Load environment variables from .env file
// This allows us to keep sensitive credentials (Firebase keys) out of source code
require("dotenv").config();

// Import Express framework
const express = require("express");

// Import route modules
// Each route handles a specific resource
const usersRoutes = require("./src/routes/users");
const incomeRoutes = require("./src/routes/income");
const expensesRoutes = require("./src/routes/expenses");

// Create Express application instance
const app = express();

// -------------------- Middleware --------------------

// Middleware to parse incoming JSON request bodies
// Required for POST, PUT, DELETE requests
app.use(express.json());

// -------------------- Root Endpoint --------------------

// Base route to describe the API
// Helpful for testing and documentation
app.get("/", (req, res) => {
  res.send({
    success: true,
    message: "Simple REST API (Firebase Realtime DB)",
    endpoints: [
      "GET /users, POST /users, PUT /users/:id, DELETE /users/:id",
      "GET /income, POST /income, PUT /income/:id, DELETE /income/:id",
      "GET /expenses, POST /expenses, PUT /expenses/:id, DELETE /expenses/:id"
    ]
  });
});

// -------------------- Routes --------------------

// Route registration
// Any request starting with these paths is forwarded to the corresponding route file
app.use("/users", usersRoutes);
app.use("/income", incomeRoutes);
app.use("/expenses", expensesRoutes);

// -------------------- Fallback Route --------------------

// Handles undefined routes
// Prevents server from crashing on invalid URLs
app.use((req, res) => {
  res.status(404).send({
    success: false,
    message: "Route not found"
  });
});

// -------------------- Server Startup --------------------

// Define server port
// Uses .env value if available, otherwise defaults to 4000
const PORT = process.env.PORT || 4000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


