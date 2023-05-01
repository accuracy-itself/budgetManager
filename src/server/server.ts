import express from 'express'
import path from 'path'
 
const port: number = 3000;

const constants = require('constants');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);


app.use(express.static(path.join(__dirname, '../client')));

// Share session with io sockets

 app.get("/", function (req, res) {
     res.sendFile("../client/pages/login.html")
})

// app.get("/content", function (req, res) {
//     //res.sendFile(__dirname + "/index.html");
// })

io.on("connection", function (socket) {
    // Accept a login event with user's data
    console.log('user connected');
    console.log('user connected', constants.showExpenses);
    socket.on("login", function (userdata) {
        socket.handshake.session.userdata = userdata;
        socket.handshake.session.save();
    });
    socket.on("logout", function (userdata) {
        if (socket.handshake.session.userdata) {
            delete socket.handshake.session.userdata;
            socket.handshake.session.save();
        }
    });

    socket.on('disconnect', function () {
        console.log('A user disconnected');
     });

    socket.on(constants.showExpenses, function () {
        console.log("showing expenses");
    });
});

http.listen(3000, function() {
    console.log('listening on *:', port);
 });