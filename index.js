const express = require("express");
const cors = require("cors");
require('dotenv').config()
const mysql = require('mysql2')
const dbConn = mysql.createConnection(process.env.DATABASE_URL)
const bodyParser = require('body-parser')
const path = require('path')
const fileUpload = require('express-fileupload');
const https = require('https');
const fs = require('fs');

// Initialize Express
let app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));
app.use(fileUpload());

// Socket.IO configuration
const socketIO = require('socket.io');
const server = https.createServer({
    key: fs.readFileSync('key.pem', 'utf8'),
    cert: fs.readFileSync('cert.pem', 'utf8')
}, app);
const io = socketIO(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
    },
});

// Global variable
global.onlineUsers = new Map();

// Socket.IO connection
io.on('connection', (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });
    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-receive", data.msg);
        }
    });
});

// Create GET request
app.get("/", (req, res) => {
    res.send("Express on Vercel");
});

// Create GET request for users
app.get("/user", async (req, res) => {
    dbConn.query('SELECT * FROM users', function (err, results) {
        res.send(results)
    });
});

// Initialize server
server.listen(process.env.PORT || 5000, () => {
    console.log("Running on port", process.env.PORT || 5000);
});

module.exports = app;
