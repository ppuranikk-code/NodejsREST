let admin = require("firebase-admin");
require("dotenv").config();

// Firebase Admin SDK init (Realtime DB)
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // private key in .env 
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

let rtdb = admin.database();
module.exports = rtdb;
