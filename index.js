const express = require("express");
require('dotenv').config()

// Initialize Express
const app = express();
app.use(cors());

const Router = require('./routes/router')

// Create GET request
app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

app.use(
    fileUpload()
);

// Initialize server
app.listen(5000, () => {
  console.log("Running on port 5000.");
});

module.exports = app;