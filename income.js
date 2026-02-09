// Import Express and initialize router
let express = require("express");
let router = express.Router();

// Import income controller
// Controller contains business logic for income
let incomeController = require("../controllers/incomeController");


//GET/POST/UPDATE and Delete /income
 //Retrieve all income records
router.get("/", incomeController.getAllIncome);
router.post("/", incomeController.addIncome);
router.put("/:id", incomeController.updateIncome);
router.delete("/:id", incomeController.deleteIncome);

// Export router for use in server.js

module.exports = router;
