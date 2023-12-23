const express = require("express");
const cors = require("cors");
require('dotenv').config()
// Initialize Express
let app = express();
app.use(cors());

// const http = require('https');
// const socketIO = require('socket.io');
// const server = http.createServer(app);
// const io = socketIO(server, {
//     cors: {
//       origin: '*',
//       methods: ['GET', 'POST'],
//       allowedHeaders: ['Content-Type'],
//     },
// });
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs');
const fileUpload  = require('express-fileupload');


// global.onlineUsers = new Map(); //สร้างตัวแปร global onlineUsers เพื่อเก็บข้อมูลผู้ใช้งานที่ออนไลน์ โดยใช้ Map ในการเก็บข้อมูลดังกล่าว
// io.on('connection', (socket) => {
//   global.chatSocket = socket; //กำหนด socket ที่เชื่อมต่อเข้ามาให้เป็นตัวแปร global chatSocket เพื่อใช้ในการสื่อสารกับ client อื่น ๆ ในภายหลัง
//   socket.on("add-user", (userId) => { //รอรับเหตุการณ์ "add-user" จาก client เพื่อเพิ่มผู้ใช้งานใหม่ในรายชื่อผู้ใช้งานที่ออนไลน์ โดยใช้ userId เป็นตัวระบุ
//     onlineUsers.set(userId, socket.id); //เพิ่มข้อมูลผู้ใช้งานใน Map onlineUsers โดยใช้ userId เป็นคีย์และ socket.id เป็นค่า
//   });
//   socket.on("send-msg", (data) => { //รอรับเหตุการณ์ "send-msg" จาก client เพื่อส่งข้อความไปยังผู้ใช้งานที่เป็นผู้รับ
//     const sendUserSocket = onlineUsers.get(data.to);  //ดึงค่า socket.id ของผู้ใช้งานที่เป็นผู้รับจาก Map onlineUsers โดยใช้ userId เป็นคีย์
//     if (sendUserSocket) {//ตรวจสอบว่ามี socket.id ของผู้ใช้งานที่เป็นผู้รับหรือไม่
//       socket.to(sendUserSocket).emit("msg-receive", data.msg);//ส่งเหตุการณ์ "msg-receive" พร้อมกับข้อความdata.msg` ไปยังผู้รับผ่านการใช้งาน socket
//     }
//   });
// });

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

// Initialize server


app.listen(5000, () => {
  console.log("Running on port 5000.");
});

module.exports = app;