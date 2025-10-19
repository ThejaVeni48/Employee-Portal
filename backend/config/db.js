// db.js
const mysql = require("mysql");

require('dotenv').config();


const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dateStrings: process.env.DB_DATESTRING

});

db.connect((err) => {
  if (err) {
    console.log("Connection failed", err);
  } else {
    console.log("Connection is successful.");
  }
});

module.exports = db;
