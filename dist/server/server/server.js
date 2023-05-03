"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const port = 3000;
const constants = require('./constants.js');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const EXPENSES = [];
EXPENSES.push({ accountId: 0, id: 0, price: 10, comment: "socks", date: new Date('2023-05-01'), expense: true });
EXPENSES.push({ accountId: 0, id: 1, price: 100, comment: "tea", date: new Date('2023-05-02'), expense: true });
EXPENSES.push({ accountId: 0, id: 3, price: 800, comment: "found", date: new Date('2023-05-03'), expense: false });
EXPENSES.push({ accountId: 0, id: 4, price: 900, comment: "made", date: new Date('2023-05-03'), expense: true });
EXPENSES.push({ accountId: 0, id: 5, price: 766, comment: "found", date: new Date('2023-05-03'), expense: false });
const ACCOUNTS = [];
ACCOUNTS.push({ id: 0, name: 'cash', balance: 100670, currency: "$" });
ACCOUNTS.push({ id: 2, name: 'card', balance: 10, currency: "BYN" });
app.use(express_1.default.static(path_1.default.join(__dirname, '../../client')));
app.get("/", function (req, res) {
    res.sendFile("../client/pages/login.html");
});
io.on("connection", function (socket) {
    console.log('user connected');
    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });
    //expenses 
    socket.on(constants.showExpenses, function (s) {
        console.log("showing expenses", s);
        console.log("expenses: ", EXPENSES);
        socket.emit(constants.showExpenses, EXPENSES);
    });
    socket.on(constants.addExpenses, function (expense) {
        EXPENSES.push(expense);
        socket.emit(constants.addExpenses, EXPENSES);
    });
    socket.on(constants.deleteExpenses, function (id) {
        EXPENSES.splice(EXPENSES.findIndex((expense) => expense.id == id), 1);
        socket.emit(constants.deleteExpenses);
    });
    //accounts 
    socket.on(constants.showAccounts, function (s) {
        console.log("showing accounts", s);
        console.log("accounts: ", ACCOUNTS);
        socket.emit(constants.showAccounts, ACCOUNTS);
    });
    socket.on(constants.addAccounts, function (account) {
        ACCOUNTS.push(account);
        socket.emit(constants.addAccounts, ACCOUNTS);
    });
    socket.on(constants.deleteAccounts, function (id) {
        ACCOUNTS.splice(ACCOUNTS.findIndex((account) => account.id == id), 1);
        socket.emit(constants.deleteAccounts);
    });
});
http.listen(3000, function () {
    console.log('listening on *:', port);
});
//# sourceMappingURL=server.js.map