"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseService = void 0;
const db_connection_js_1 = require("./db-connection.js");
function convertToExpense(expenseDto) {
    const expense = {
        id: expenseDto.id,
        price: expenseDto.price,
        accountId: expenseDto.accountId,
        date: expenseDto.date,
        comment: expenseDto.comment,
        expense: expenseDto.expense
    };
    return expense;
}
class ExpenseService {
    static async getExpenseByDateAndAccount(dateFirst, dateSecond, account) {
        let Expenses = [];
        const dateFirstString = `${dateFirst.getFullYear()}-${dateFirst.getMonth() + 1}-${dateFirst.getDate()}`;
        const dateSecondString = `${dateSecond.getFullYear()}-${dateSecond.getMonth() + 1}-${dateSecond.getDate()}`;
        console.log(dateFirstString);
        console.log(dateSecondString);
        let filter;
        if (!account) {
            filter = {
                date: {
                    $gte: dateFirstString,
                    $lte: dateSecondString,
                }
            };
        }
        else {
            filter = {
                date: {
                    $gte: dateFirstString,
                    $lte: dateSecondString,
                },
                accountId: account.id
            };
        }
        await db_connection_js_1.ExpenseModel.find(filter).then(expenses => expenses.forEach(expense => Expenses.push(convertToExpense(expense))));
        console.log(Expenses);
        return Expenses;
    }
    static async addExpense(expense) {
        const expenseNew = new db_connection_js_1.ExpenseModel(expense);
        await expenseNew.save();
    }
    static async getAllExpensesWithLimit() {
        let Expenses = [];
        await db_connection_js_1.ExpenseModel.find({})
            .then(expenses => expenses.forEach(expense => Expenses.push(convertToExpense(expense))));
        console.log("expenses with limit:", Expenses);
        return Expenses;
    }
    static async getExpenseById(id) {
        return db_connection_js_1.ExpenseModel.findOne({ id: id });
    }
    static async deleteExpense(id) {
        return await db_connection_js_1.ExpenseModel.deleteOne({ id: id });
    }
    static async deleteExpensesByAccountId(id) {
        return await db_connection_js_1.ExpenseModel.deleteMany({ accountId: id });
    }
}
exports.ExpenseService = ExpenseService;
//# sourceMappingURL=expense-service.js.map