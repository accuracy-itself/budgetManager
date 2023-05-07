import { Schema, model } from "mongoose";
import { Expense, Account } from "../types/model.js";

const mongoose = require('mongoose');

const expensesSchema = new Schema({
    id: { type: Number, required: true },
    price: { type: Number, required: true },
    date: { type: Date, required: true },
    comment: { type: String, required: true },
    expense: { type: Boolean, required: true },
    accountId: { type: Number, required: true },
}, {
    query: {
        byId(id: number) {
            return this.find({ id });
        }
    }
});

export const ExpenseModel = model<Expense>('Expense', expensesSchema);


const accountsSchema = new Schema({
    id: { type: Number, required: true },
    currency: { type: String, required: true },
    name: { type: String, required: true },
    balance: { type: Number, required: true },
}, {
    query: {
        byId(id: number) {
            return this.find({ id });
        }
    }
});

export const AccountModel = model<Account>('Account', accountsSchema);

main().catch(err => console.log(err));

export async function main() {
    console.log('call main');
    await mongoose.connect('mongodb+srv://alex_lenina:123QWEasd%21@cluster0.awziapz.mongodb.net/budget-manager?authSource=admin&replicaSet=atlas-zhd1jp-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true');
    mongoose.connection.on('open', () => {
        console.log('connected!!!');
    });

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}