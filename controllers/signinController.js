const bcrypt = require("bcrypt");
const crypto = require("crypto");
const saltRounds = 10;
let jwt = require("jsonwebtoken");
const secret_token = "mysecret_id";
const randomstring = require("randomstring");
const fs = require("fs");
const nodemailer = require("nodemailer");

const mysql = require('mysql2')
const dbConn = mysql.createConnection(process.env.DATABASE_URL)

exports.user = async (req, res) => {
    dbConn.query('SELECT * FROM users', function( err, results ) {
        res.send(results)
    })
}