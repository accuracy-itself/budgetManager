"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const db_connection_js_1 = require("./db-connection.js");
const expense_service_js_1 = require("./expense-service.js");
const port = 3000;
const constants = require('./constants.js');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
(0, db_connection_js_1.main)();
let EXPENSES = [];
const ACCOUNTS = [];
ACCOUNTS.push({ id: 0, name: 'cash', balance: 100670, currency: "$" });
ACCOUNTS.push({ id: 1, name: 'card', balance: 10, currency: "BYN" });
app.use(express_1.default.static(path_1.default.join(__dirname, '../../client')));
app.get("/", function (req, res) {
    res.sendFile("../client/pages/login.html");
});
expense_service_js_1.ExpenseService.getExpenseByDate(new Date('2023-01-01'), new Date('2023-10-10'));
expense_service_js_1.ExpenseService.getExpenseByDate(new Date('2023-09-09'), new Date('2023-10-10'));
io.on("connection", function (socket) {
    console.log('user connected');
    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });
    //expenses 
    socket.on(constants.showExpenses, function (s) {
        console.log("showing expenses", s);
        const EXPENSES = expense_service_js_1.ExpenseService.getAllExpensesWithLimit();
        EXPENSES.then(expenses => socket.emit(constants.showExpenses, expenses));
    });
    socket.on(constants.addExpenses, function (expense) {
        expense_service_js_1.ExpenseService.addExpense(expense).then(() => {
            socket.emit(constants.addExpenses);
            const addedValue = expense.expense ? -expense.price : expense.price;
            ACCOUNTS[ACCOUNTS.findIndex(account => account.id == expense.accountId)].balance += addedValue;
        });
    });
    socket.on(constants.deleteExpenses, function (id) {
        expense_service_js_1.ExpenseService.deleteExpense(id).then(socket.emit(constants.deleteExpenses));
    });
    //accounts 
    socket.on(constants.showAccounts, function (s) {
        console.log("showing accounts", s);
        socket.emit(constants.showAccounts, ACCOUNTS);
    });
    socket.on(constants.displayAccounts, function () {
        socket.emit(constants.displayAccounts, ACCOUNTS);
    });
    socket.on(constants.addAccounts, function (account) {
        ACCOUNTS.push(account);
        socket.emit(constants.addAccounts, ACCOUNTS);
    });
    socket.on(constants.deleteAccounts, function (id) {
        ACCOUNTS.splice(ACCOUNTS.findIndex((account) => account.id == id), 1);
        EXPENSES = EXPENSES.filter(expense => expense.accountId != id);
        socket.emit(constants.deleteAccounts);
    });
    socket.on(constants.updateAccounts, function (updateInfo) {
        ACCOUNTS[ACCOUNTS.findIndex(account => account.id == updateInfo.id)].balance = updateInfo.value;
    });
    socket.on(constants.getExpenses, (dateInfo) => {
        const firstDate = new Date(dateInfo.dateFirst);
        const secondDate = new Date(dateInfo.dateSecond);
        expense_service_js_1.ExpenseService.getExpenseByDate(firstDate, secondDate).then(filteredExpenses => socket.emit(constants.getExpenses, filteredExpenses));
    });
});
http.listen(3000, function () {
    console.log('listening on *:', port);
});
//# sourceMappingURL=server.js.map