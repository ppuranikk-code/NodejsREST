
// Import Express and initialize router
let express = require("express");
let router = express.Router();

// Import users controller
// Controller contains business logic for users
let usersController = require("../controllers/usersController");

//GET/POST/UPDATE and Delete /users
 //Retrieve all users records
router.get("/", usersController.getAllUsers);
router.post("/", usersController.addUser);
router.put("/:id", usersController.updateUser);
router.delete("/:id", usersController.deleteUser);

// Export router for use in server.js

module.exports = router;
