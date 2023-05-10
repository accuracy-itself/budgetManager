import express from 'express'
import path from 'path'
import { Expense } from '../types/model.js'
import { Account } from '../types/model.js'
import { AccountModel, main } from './db-connection.js'
import { ExpenseService } from './expense-service.js'
import { AccountService } from './account-service.js'

const port: number = 3000;

const constants = require('./constants.js');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

main();

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
        const EXPENSES = ExpenseService.getAllExpensesWithLimit();
        EXPENSES.then(expenses => socket.emit(constants.showExpenses, expenses));
    });

    socket.on(constants.addExpenses, function (expense: Expense) {
        ExpenseService.addExpense(expense).then(() => {
            socket.emit(constants.addExpenses);
            const addedValue: number = expense.expense ? -expense.price : expense.price;
            AccountService.updateAccount(expense.accountId, addedValue, true);
        });
    })

    socket.on(constants.deleteExpenses, function (id: number) {
        ExpenseService.getExpenseById(id).then(expense => {
            const addedValue: number = expense.expense ? expense.price : -expense.price;
            AccountService.updateAccount(expense.accountId, addedValue, true);
            ExpenseService.deleteExpense(id).then(() =>
                socket.emit(constants.deleteExpenses)
            );
        })

    })

    //accounts 
    socket.on(constants.showAccounts, function (s) {
        console.log("showing accounts", s);
        AccountService.getAcounts().then((ACCOUNTS) => {
            socket.emit(constants.showAccounts, ACCOUNTS);
        })
    });

    socket.on(constants.displayAccounts, function () {
        AccountService.getAcounts().then((ACCOUNTS) => {
            socket.emit(constants.displayAccounts, ACCOUNTS);
        })
    });

    socket.on(constants.getStatAccounts, function () {
        AccountService.getAcounts().then((ACCOUNTS) => {
            socket.emit(constants.getStatAccounts, ACCOUNTS);
        })
    });

    socket.on(constants.addAccounts, function (account: Account) {
        AccountService.addAcocunt(account).then(() => {
            socket.emit(constants.addAccounts);
        })
    });

    socket.on(constants.deleteAccounts, function (id: number) {
        AccountService.deleteAccount(id).then(() => {
            ExpenseService.deleteExpensesByAccountId(id).then(() => {
                socket.emit(constants.deleteAccounts);
            })
        })
    });

    socket.on(constants.updateAccounts, function (updateInfo) {
        AccountService.updateAccount(updateInfo.id, updateInfo.value, false).then(() => {
            socket.emit(constants.addAccounts);
        })
    });

    socket.on(constants.getExpenses, (dateInfo) => {
        const firstDate: Date = new Date(dateInfo.dateFirst);
        const secondDate: Date = new Date(dateInfo.dateSecond);
        ExpenseService.getExpenseByDateAndAccount(firstDate, secondDate, null).then(
            filteredExpenses => socket.emit(constants.getExpenses, filteredExpenses
            ));
    });

    socket.on(constants.getStatExpenses, (dateInfo) => {
        const firstDate: Date = new Date(dateInfo.dateFirst);
        const secondDate: Date = new Date(dateInfo.dateSecond);
        const account: Account = dateInfo.account;
        ExpenseService.getExpenseByDateAndAccount(firstDate, secondDate, account).then(
            filteredExpenses => socket.emit(constants.getStatExpenses, filteredExpenses
            ));
    });
});


http.listen(3000, function () {
    console.log('listening on *:', port);
});

