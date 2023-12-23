const express = require("express");
const cors = require("cors");
require('dotenv').config()
const mysql = require('mysql2')
const dbConn = mysql.createConnection(process.env.DATABASE_URL)

// Initialize Express
let app = express();
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs');
const fileUpload  = require('express-fileupload');

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const saltRounds = 10;
let jwt = require("jsonwebtoken");
const secret_token = "mysecret_id";
const randomstring = require("randomstring");
const fs = require("fs");
const nodemailer = require("nodemailer");

app.use(cors());
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

// Create GET request
app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

app.get("/user", async (req, res) => {
    dbConn.query('SELECT * FROM users', function( err, results ) {
        res.send(results)
    })
})

app.get("/verify", async (req, res) => {
    const email = req.body.email;
    const otp = crypto.randomInt(100000, 999999).toString();
    console.log(req.body);
    try {
      const userResult = await queryDatabase("SELECT urs_email FROM users WHERE urs_email = ?", [email]);
      if (userResult.length >= 1) {
        return res.json({ status: "used", message: "email being used" });
      }
      
      const adminResult = await queryDatabase("SELECT admin_email FROM admins WHERE admin_email = ?", [email]);
      if (adminResult.length >= 1) {
        return res.json({ status: "used", message: "email being used" });
      }
  
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "ktpyun@gmail.com",
          pass: process.env.GOOGLE_PASS,
        },
      });
  
      let mailOptions = {
        from: "ktpyun@gmail.com",
        to: email,
        subject: "Email Verification",
        html: "<b>OTP to verify your email is </b>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>",
      };
  
      transporter.sendMail(mailOptions, async function (error, info) {
        if (error) {
          console.log("error", error);
          return res.json({ status: "error", message: "Failed" });
        }
  
        try {
          const insertResult = await queryDatabase("INSERT INTO users SET OTP=?", [otp]);
          // const insertResult = await queryDatabase("INSERT INTO users (OTP, urs_email) VALUES (?, ?)", [otp, email]);
          const insertedUserID = insertResult ? insertResult.insertId : null;
          console.log(insertedUserID);
          return res.json({ status: "ok", otp, insertedUserID });
        } catch (error) {
          console.log("error", error);
          return res.json({ status: "error", message: "Failed" });
        }
      });
    } catch (error) {
      console.log("verify เข้า catch", error);
      return res.status(500).json({ status: "error", message: "Failed" });
    }
});

function queryDatabase(sql, params) {
    return new Promise((resolve, reject) => {
    dbConn.query(sql, params, function (error, results) {
        if (error) {
        reject(error);
        } else {
        resolve(results);
        }
    });
    });
}

app.get("/verify/email", (req, res) => {
    const {email, userID} = req.body;
    let OTP = parseInt(req.body.otp);
    dbConn.query(
      "SELECT OTP FROM users WHERE id=?",[userID],
      function(error, results){
        let otp = results[0].OTP;
        if (error) {
          console.log(error);
        } else {
          if (OTP === otp) {
            return res.json({
              status: "ok",
              message: "verify email success",
            });
          } else {
            console.log("otp is incorrect");
            res.json({ status: "error", message: "otp is incorrect" });
          }
        }
      }
    )
});

app.get("/register", (req, res) => {
    // const sum_token = 0;
    // const urs_token = sum_token.toString();
    // const urs_token_encrypted = encrypt(urs_token);
    if (req.files === null) {
      return res.json({ status: "error", message: "No File Uploaded" });
    }
    const file = req.files.file;
    var filename_random =
      __dirname.split("controllers")[0] +
      "/public/images/" +
      randomstring.generate(50) +
      ".jpg";
    if (fs.existsSync("filename_random")) {
      filename_random =
        __dirname.split("controllers")[0] +
        "/public/images/" +
        randomstring.generate(60) +
        ".jpg";
      file.mv(filename_random);
    } else {
      file.mv(filename_random);
    }
    // const email = req.body.email;
    const image = filename_random.split("/public")[1];
    const profile = `${req.protocol}://${req.get("host")}${image}`;
    const {userID ,email, password, username, pdpaAccept, bankAccName, ppNumber, roleName} = req.body
    let userType = null;
    if(roleName=="customer"){
      userType = 0
    } else if (roleName=="artist") {
      userType = 1
    }
    // console.log(userType);
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) {
        console.log("เข้า error 1");
        return res.json({
          status: "error",
          message: "Register failed",
        });
      } else {
        dbConn.query(
          "UPDATE users SET urs_email=?, urs_password=?, urs_name=?,  urs_profile_img=?, urs_PDPA_accept=?, urs_account_name=?, urs_promptpay_number=?, urs_type=? WHERE id=?",
          [email, hash, username, profile, pdpaAccept, bankAccName, ppNumber, userType, userID],
          function (error, results) {
            if (error) {
              return res.json({ status: "error", message: error.message });
            } else {
              dbConn.query(
                "SELECT * FROM users WHERE urs_email=?",
                [email],
                function (error, users) {
                  if (users) {
                    var token = jwt.sign(
                      {
                        email: users[0].urs_email,
                        userId: users[0].id,
                        role: users[0].urs_type,
                      },
                      secret_token,
                      { expiresIn: "1h" }
                    ); //กำหนดระยะเวลาในการใช้งาน มีอายุ 1 ชม
                    return res.json({
                      status: "ok",
                      message: "Register success",
                      token,
                    });
                  } else {
                    return res.json({
                      status: "error",
                      message: "Register failed",
                    });
                  }
                }
              );
            }
          }
        );
      }
    });
});


// Initialize server

app.listen(5000, () => {
  console.log("Running on port 5000.");
});

module.exports = app;