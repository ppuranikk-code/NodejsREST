// Import Express and initialize router

let express = require("express");
let router = express.Router();

// Import expenses controller
// Controller contains business logic for expenses
let expensesController = require("../controllers/expensesController");


 //GET/POST/UPDATE and Delete /expenses
 //Retrieve all expense records

router.get("/", expensesController.getAllExpenses);
router.post("/", expensesController.addExpense);
router.put("/:id", expensesController.updateExpense);
router.delete("/:id", expensesController.deleteExpense);

// Export router for use in server.js

module.exports = router;
