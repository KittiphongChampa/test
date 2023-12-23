const express = require("express");
require('dotenv').config()

// Initialize Express
const app = express();
app.use(cors());

const Router = require('./routes/router')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs');
const fileUpload  = require('express-fileupload');

// Create GET request
app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(
    fileUpload()
);

app.use(Router)

// Initialize server
app.listen(5000, () => {
  console.log("Running on port 5000.");
});

module.exports = app;