"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseService = void 0;
const db_connection_js_1 = require("./db-connection.js");
function convertToExpense(expenseDto) {
    let expense = {
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
    static async getExpenseByDate(dateFirst, dateSecond) {
        let Expenses = [];
        const dateFirstString = `${dateFirst.getFullYear()}-${dateFirst.getMonth() + 1}-${dateFirst.getDate()}`;
        const dateSecondString = `${dateSecond.getFullYear()}-${dateSecond.getMonth() + 1}-${dateSecond.getDate()}`;
        console.log(dateFirstString);
        console.log(dateSecondString);
        await db_connection_js_1.ExpenseModel.find({
            date: {
                $gte: dateFirstString,
                $lte: dateSecondString,
            }
        }).then(expenses => expenses.forEach(expense => Expenses.push(convertToExpense(expense))));
        //}).then(expenses => console.log(expenses));    
        console.log(Expenses);
        return Expenses;
    }
    static async addExpense(expense) {
        const expenseNew = new db_connection_js_1.ExpenseModel(expense);
        await expenseNew.save();
    }
    static async deleteExpense(id) {
    }
}
exports.ExpenseService = ExpenseService;
//# sourceMappingURL=expense-service.js.map