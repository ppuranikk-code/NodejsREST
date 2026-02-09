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

let incomeRef = rtdb.ref("income");

// GET /income
function getAllIncome(req, res){
  incomeRef.once("value")
    .then(function(snapshot){
      let data = snapshot.val();
      let income = mapToArray(data);
      sendSuccess(res, "Income retrieved", income, 200);
    })
    .catch(function(err){
      sendError(res, "Database error", err.message, 500);
    });
}

// POST /income
function addIncome(req, res){
  let data = req.body;

  if(!data || Object.keys(data).length === 0){
    return sendError(res, "Request body is required", "Please send income data in JSON", 400);
  }

  let newRef = incomeRef.push();
  newRef.set(data)
    .then(function(){
      sendSuccess(res, "Income added", { id: newRef.key }, 201);
    })
    .catch(function(err){
      sendError(res, "Database error", err.message, 500);
    });
}

// PUT /income/:id
function updateIncome(req, res){
  let id = req.params.id;
  let data = req.body;

  if(!data || Object.keys(data).length === 0){
    return sendError(res, "Request body is required", "Please send fields to update", 400);
  }

  let oneRef = incomeRef.child(id);

  oneRef.once("value")
    .then(function(snapshot){
      if(!snapshot.exists()){
        return sendError(res, "Invalid ID", "No income record found for this id", 400);
      }
      return oneRef.update(data).then(function(){
        sendSuccess(res, "Income updated", { id: id }, 200);
      });
    })
    .catch(function(err){
      sendError(res, "Database error", err.message, 500);
    });
}

// DELETE /income/:id
function deleteIncome(req, res){
  let id = req.params.id;
  let oneRef = incomeRef.child(id);

  oneRef.once("value")
    .then(function(snapshot){
      if(!snapshot.exists()){
        return sendError(res, "Invalid ID", "No income record found for this id", 400);
      }
      return oneRef.remove().then(function(){
        sendSuccess(res, "Income deleted", { id: id }, 200);
      });
    })
    .catch(function(err){
      sendError(res, "Database error", err.message, 500);
    });
}

module.exports = { getAllIncome, addIncome, updateIncome, deleteIncome };
