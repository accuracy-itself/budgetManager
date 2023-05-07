import express from 'express'
import path from 'path'
import { Expense } from '../types/model.js'
import { Account } from '../types/model.js'
import { main } from './db-connection.js'
import { ExpenseService } from './expense-service.js'

const port: number = 3000;

const constants = require('./constants.js');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

main();

let EXPENSES: Expense[] = [];


const ACCOUNTS: Account[] = [];
ACCOUNTS.push({ id: 0, name: 'cash', balance: 100670, currency: "$" });
ACCOUNTS.push({ id: 1, name: 'card', balance: 10, currency: "BYN" });

app.use(express.static(path.join(__dirname, '../../client')));

app.get("/", function (req, res) {
    res.sendFile("../client/pages/login.html")
})

ExpenseService.getExpenseByDate(new Date('2023-01-01'), new Date('2023-10-10'));
ExpenseService.getExpenseByDate(new Date('2023-09-09'), new Date('2023-10-10'));

io.on("connection", function (socket) {
    console.log('user connected');
    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });

    //expenses 
    socket.on(constants.showExpenses, function (s) {
        console.log("showing expenses", s);
        const EXPENSES = ExpenseService.getAllExpensesWithLimit();
        EXPENSES.then(expenses => socket.emit(constants.showExpenses, expenses));
    });

    socket.on(constants.addExpenses, function (expense: Expense) {
        ExpenseService.addExpense(expense).then(() => {
            socket.emit(constants.addExpenses);
            const addedValue: number = expense.expense ? -expense.price : expense.price;
            ACCOUNTS[ACCOUNTS.findIndex(account => account.id == expense.accountId)].balance += addedValue;
        });
    })

    socket.on(constants.deleteExpenses, function (id: number) {
        ExpenseService.deleteExpense(id).then(
            socket.emit(constants.deleteExpenses)
        );
    })

    //accounts 
    socket.on(constants.showAccounts, function (s) {
        console.log("showing accounts", s);
        socket.emit(constants.showAccounts, ACCOUNTS);
    });

    socket.on(constants.displayAccounts, function () {
        socket.emit(constants.displayAccounts, ACCOUNTS);
    });

    socket.on(constants.addAccounts, function (account: Account) {
        ACCOUNTS.push(account);
        socket.emit(constants.addAccounts, ACCOUNTS);
    });

    socket.on(constants.deleteAccounts, function (id: number) {
        ACCOUNTS.splice(ACCOUNTS.findIndex((account) => account.id == id), 1);
        EXPENSES = EXPENSES.filter(expense => expense.accountId != id);
        socket.emit(constants.deleteAccounts);
    });

    socket.on(constants.updateAccounts, function (updateInfo) {
        ACCOUNTS[ACCOUNTS.findIndex(account => account.id == updateInfo.id)].balance = updateInfo.value;
    });

    socket.on(constants.getExpenses, (dateInfo) => {
        const firstDate: Date = new Date(dateInfo.dateFirst);
        const secondDate: Date = new Date(dateInfo.dateSecond);
        ExpenseService.getExpenseByDate(firstDate, secondDate).then(
            filteredExpenses => socket.emit(constants.getExpenses, filteredExpenses
            ));
    });
});


http.listen(3000, function () {
    console.log('listening on *:', port);
});

