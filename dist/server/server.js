"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const port = 3000;
const constants = require('constants');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.use(express_1.default.static(path_1.default.join(__dirname, '../client')));
// Share session with io sockets
app.get("/", function (req, res) {
    res.sendFile("../client/pages/login.html");
});
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
http.listen(3000, function () {
    console.log('listening on *:', port);
});
//# sourceMappingURL=server.js.map