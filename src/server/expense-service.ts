import { Expense } from '../types/model.js'
import { deleteExpenses } from './constants.js';
import { ExpenseModel } from './db-connection.js';

function convertToExpense(expenseDto) {
    let expense: Expense = {
        id: expenseDto.id,
        price: expenseDto.price,
        accountId: expenseDto.accountId,
        date: expenseDto.date,
        comment: expenseDto.comment,
        expense: expenseDto.expense
    };

    return expense;
}

export class ExpenseService {
    static async getExpenseByDate(dateFirst: Date, dateSecond: Date) {
        let Expenses: Expense[] = [];
        const dateFirstString = `${dateFirst.getFullYear()}-${dateFirst.getMonth() + 1}-${dateFirst.getDate()}`;
        const dateSecondString = `${dateSecond.getFullYear()}-${dateSecond.getMonth() + 1}-${dateSecond.getDate()}`;
        console.log(dateFirstString);
        console.log(dateSecondString);
        await ExpenseModel.find({
            date: {
                $gte: dateFirstString,
                $lte: dateSecondString,
            }
        }).then(expenses => expenses.forEach(expense => Expenses.push(convertToExpense(expense))));
        //}).then(expenses => console.log(expenses));    
        console.log(Expenses);

        return Expenses;
    }

    static async addExpense(expense: Expense) {
        const expenseNew = new ExpenseModel(expense);
        await expenseNew.save();
    }



    static async deleteExpense(id: number) {

    }
} 
