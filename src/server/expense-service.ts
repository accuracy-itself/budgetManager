import { Expense } from '../types/model.js'
import { deleteExpenses } from './constants.js';
import { ExpenseModel } from './db-connection.js';


export class ExpenseService {
    static async gettExpenseByDate(dateFirst: Date, dateSecond: Date) {
        let Expenses =  ExpenseModel.find({
            date: {
                $gte: '\'' + dateFirst.getFullYear + '-\'' + dateFirst.getDay + '-\'' + dateFirst.getMonth + '\'',
                $lte: '\'' + dateFirst.getFullYear + '-\'' + dateFirst.getDay + '-\'' + dateFirst.getMonth + '\''
            }
        });

        console.log(Expenses);
    }

    static async addExpense(expense: Expense) {
        const expenseNew = new ExpenseModel(expense);
        await expenseNew.save();
    }



    static async deleteExpense(id: number) {

    }
} 
