"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseService = void 0;
const db_connection_js_1 = require("./db-connection.js");
class ExpenseService {
    static async gettExpenseByDate(dateFirst, dateSecond) {
        let Expenses = db_connection_js_1.ExpenseModel.find({
            date: {
                $gte: '\'' + dateFirst.getFullYear + '-\'' + dateFirst.getDay + '-\'' + dateFirst.getMonth + '\'',
                $lte: '\'' + dateFirst.getFullYear + '-\'' + dateFirst.getDay + '-\'' + dateFirst.getMonth + '\''
            }
        });
        console.log(Expenses);
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