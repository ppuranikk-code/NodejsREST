// Import Firebase Realtime Database instance
// This connection is created once in config/firebase.js and reused across all controllers

let rtdb = require("../config/firebase");

//  functions for sending responses and mapping RTDB data to arrays.
function sendSuccess(res, message, data, statusCode){
  res.status(statusCode || 200).send({
    success: true,
    message: message,
    data: data || null
  });
}

function sendError(res, message, error, statusCode){
  res.status(statusCode || 400).send({
    success: false,
    message: message,
    error: error || null
  });
}

function mapToArray(data){
  // RTDB returns objects like { id1: {...}, id2: {...} }
  // Convert it to an array with "id" added.
  if(!data) return [];
  return Object.keys(data).map(function(key){
    return { id: key, ...data[key] };
  });
}

let expensesRef = rtdb.ref("expenses");

// GET /expenses
function getAllExpenses(req, res){
  expensesRef.once("value")
    .then(function(snapshot){
      let data = snapshot.val();
      let expenses = mapToArray(data);
      sendSuccess(res, "Expenses retrieved", expenses, 200);
    })
    .catch(function(err){
      sendError(res, "Database error", err.message, 500);
    });
}

// POST /expenses
function addExpense(req, res){
  let data = req.body;

  if(!data || Object.keys(data).length === 0){
    return sendError(res, "Request body is required", "Please send expense data in JSON", 400);
  }

  let newRef = expensesRef.push();
  newRef.set(data)
    .then(function(){
      sendSuccess(res, "Expense added", { id: newRef.key }, 201);
    })
    .catch(function(err){
      sendError(res, "Database error", err.message, 500);
    });
}

// PUT /expenses/:id
function updateExpense(req, res){
  let id = req.params.id;
  let data = req.body;

  if(!data || Object.keys(data).length === 0){
    return sendError(res, "Request body is required", "Please send fields to update", 400);
  }

  let oneRef = expensesRef.child(id);

  oneRef.once("value")
    .then(function(snapshot){
      if(!snapshot.exists()){
        return sendError(res, "Invalid ID", "No expense found for this id", 400);
      }
      return oneRef.update(data).then(function(){
        sendSuccess(res, "Expense updated", { id: id }, 200);
      });
    })
    .catch(function(err){
      sendError(res, "Database error", err.message, 500);
    });
}

// DELETE /expenses/:id
function deleteExpense(req, res){
  let id = req.params.id;
  let oneRef = expensesRef.child(id);

  oneRef.once("value")
    .then(function(snapshot){
      if(!snapshot.exists()){
        return sendError(res, "Invalid ID", "No expense found for this id", 400);
      }
      return oneRef.remove().then(function(){
        sendSuccess(res, "Expense deleted", { id: id }, 200);
      });
    })
    .catch(function(err){
      sendError(res, "Database error", err.message, 500);
    });
}

module.exports = { getAllExpenses, addExpense, updateExpense, deleteExpense };
