import express from 'express'
import path from 'path'
import {Expense} from '../types/model.js'
import {Account} from '../types/model.js'
import {main} from './db-connection.js'
import { ExpenseService } from './expense-service.js'

const port: number = 3000;

const constants = require('./constants.js');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

main();

let EXPENSES: Expense[] = [];
EXPENSES.push({accountId: 0, id: 0, price: 10, comment: "socks", date: new Date('2023-05-01'), expense: true});
EXPENSES.push({accountId: 0, id: 1, price: 100, comment: "tea", date: new Date('2023-05-02'), expense: true});
EXPENSES.push({accountId: 0, id: 3, price: 800, comment: "found", date: new Date('2023-05-03'), expense: false});
EXPENSES.push({accountId: 0, id: 4, price: 900, comment: "made", date: new Date('2023-05-03'), expense: true});
EXPENSES.push({accountId: 0, id: 5, price: 766, comment: "found", date: new Date('2023-05-03'), expense: false});
EXPENSES.push({accountId: 0, id: 6, price: 766, comment: "apples", date: new Date('2023-05-03'), expense: true});
EXPENSES.push({accountId: 1, id: 7, price: 766, comment: "made", date: new Date('2023-05-03'), expense: false});
EXPENSES.push({accountId: 1, id: 8, price: 766, comment: "tree money", date: new Date('2023-05-03'), expense: false});
EXPENSES.push({accountId: 1, id: 9, price: 766, comment: "tuesday", date: new Date('2023-05-03'), expense: true});
EXPENSES.push({accountId: 1, id: 10, price: 756, comment: "cat", date: new Date('2023-05-03'), expense: false});
EXPENSES.push({accountId: 1, id: 11, price: 72366, comment: "giraffe", date: new Date('2023-05-03'), expense: false});
EXPENSES.push({accountId: 1, id: 12, price: 7466, comment: "payment", date: new Date('2023-05-03'), expense: false});
EXPENSES.push({accountId: 1, id: 13, price: 65766, comment: "house", date: new Date('2023-05-03'), expense: true});
EXPENSES.push({accountId: 0, id: 14, price: 90766, comment: "sent", date: new Date('2023-05-03'), expense: false});
EXPENSES.push({accountId: 0, id: 15, price: 7696, comment: "parents", date: new Date('2023-05-03'), expense: false});
EXPENSES.push({accountId: 0, id: 16, price: 7606, comment: "bought", date: new Date('2023-05-03'), expense: true});
EXPENSES.push({accountId: 0, id: 17, price: 3266, comment: "brought", date: new Date('2023-05-03'), expense: false});

const ACCOUNTS: Account[] = [];
ACCOUNTS.push({id: 0, name: 'cash', balance: 100670, currency: "$"});
ACCOUNTS.push({id: 1, name: 'card', balance: 10, currency: "BYN"});

app.use(express.static(path.join(__dirname, '../../client')));

app.get("/", function (req, res) {
     res.sendFile("../client/pages/login.html")
})

io.on("connection", function (socket) {
    console.log('user connected');

    socket.on('disconnect', function () {
        console.log('A user disconnected');
     });

    //expenses 
    socket.on(constants.showExpenses, function (s) {
        console.log("showing expenses", s);
        //console.log("expenses: ", EXPENSES);
        socket.emit(constants.showExpenses, EXPENSES);
    });

    socket.on(constants.addExpenses, function(expense: Expense) {
        EXPENSES.push(expense);
        ExpenseService.addExpense(expense);
        socket.emit(constants.addExpenses, EXPENSES);
        const addedValue: number = expense.expense ? -expense.price : expense.price;
        ACCOUNTS[ACCOUNTS.findIndex(account => account.id == expense.accountId)].balance += addedValue;
    })

    socket.on(constants.deleteExpenses, function(id: number) {
        const index: number = EXPENSES.findIndex((expense) => expense.id == id);
        const substractedValue: number = EXPENSES[index].expense ? -EXPENSES[index].price : EXPENSES[index].price;
        ACCOUNTS[ACCOUNTS.findIndex(account => account.id == EXPENSES[index].accountId)].balance += substractedValue;

        EXPENSES.splice(index, 1);
        socket.emit(constants.deleteExpenses);
    })

    //accounts 
    socket.on(constants.showAccounts, function (s) {
        console.log("showing accounts", s);
        socket.emit(constants.showAccounts, ACCOUNTS);
    });

    socket.on(constants.displayAccounts, function() {
        socket.emit(constants.displayAccounts, ACCOUNTS);
    });

    socket.on(constants.addAccounts, function(account: Account) {
        ACCOUNTS.push(account);
        socket.emit(constants.addAccounts, ACCOUNTS);
    });

    socket.on(constants.deleteAccounts, function(id: number) {
        ACCOUNTS.splice(ACCOUNTS.findIndex((account) => account.id == id), 1);
        EXPENSES = EXPENSES.filter(expense => expense.accountId != id);
        socket.emit(constants.deleteAccounts);
    });

    socket.on(constants.updateAccounts, function(updateInfo) {
        ACCOUNTS[ACCOUNTS.findIndex(account => account.id == updateInfo.id)].balance = updateInfo.value;
    });

    socket.on(constants.getExpenses, (dateInfo) => {
        const firstDate: Date = new Date(dateInfo.dateFirst);
        const secondDate: Date = new Date(dateInfo.dateSecond);
        const filteredExpenses: Expense[] = EXPENSES.filter(expense => expense.date >= firstDate && expense.date <= secondDate);
        socket.emit(constants.getExpenses, filteredExpenses);
        console.log(EXPENSES);
    });
});


http.listen(3000, function() {
    console.log('listening on *:', port);
});

