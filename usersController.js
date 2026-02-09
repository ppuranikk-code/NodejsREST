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

let usersRef = rtdb.ref("users");

// GET /users
function getAllUsers(req, res){
  usersRef.once("value")
    .then(function(snapshot){
      let data = snapshot.val();
      let users = mapToArray(data);
      sendSuccess(res, "Users retrieved", users, 200);
    })
    .catch(function(err){
      sendError(res, "Database error", err.message, 500);
    });
}

// POST /users
function addUser(req, res){
  let data = req.body;

  if(!data || Object.keys(data).length === 0){
    return sendError(res, "Request body is required", "Please send user data in JSON", 400);
  }

  let newRef = usersRef.push(); // creates a new id
  newRef.set(data)
    .then(function(){
      sendSuccess(res, "User added", { id: newRef.key }, 201);
    })
    .catch(function(err){
      sendError(res, "Database error", err.message, 500);
    });
}

// PUT /users/:id
function updateUser(req, res){
  let id = req.params.id;
  let data = req.body;

  if(!data || Object.keys(data).length === 0){
    return sendError(res, "Request body is required", "Please send fields to update", 400);
  }

  let oneUserRef = usersRef.child(id);

  oneUserRef.once("value")
    .then(function(snapshot){
      if(!snapshot.exists()){
        return sendError(res, "Invalid ID", "No user found for this id", 400);
      }
      return oneUserRef.update(data).then(function(){
        sendSuccess(res, "User updated", { id: id }, 200);
      });
    })
    .catch(function(err){
      sendError(res, "Database error", err.message, 500);
    });
}

// DELETE /users/:id
function deleteUser(req, res){
  let id = req.params.id;
  let oneUserRef = usersRef.child(id);

  oneUserRef.once("value")
    .then(function(snapshot){
      if(!snapshot.exists()){
        return sendError(res, "Invalid ID", "No user found for this id", 400);
      }
      return oneUserRef.remove().then(function(){
        sendSuccess(res, "User deleted", { id: id }, 200);
      });
    })
    .catch(function(err){
      sendError(res, "Database error", err.message, 500);
    });
}

module.exports = { getAllUsers, addUser, updateUser, deleteUser };
