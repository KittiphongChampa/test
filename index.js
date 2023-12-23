const express = require("express");
require('dotenv').config()

// Initialize Express
const app = express();
const mysql = require('mysql2')
const dbConn = mysql.createConnection(process.env.DATABASE_URL)

// Create GET request
app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

app.get("/user", (req, res) => {
    dbConn.query('SELECT * FROM users', function( err, results ) {
        res.send(results)
    })
})

// Initialize server
app.listen(5000, () => {
  console.log("Running on port 5000.");
});

module.exports = app;