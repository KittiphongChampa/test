const express = require("express");
const cors = require("cors");
require('dotenv').config()
// Initialize Express
const app = express();



const Router = require('./routes/router')



app.use(cors());

// Create GET request
app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

// Initialize server

app.use(Router)


app.listen(5000, () => {
  console.log("Running on port 5000.");
});

// module.exports = app;