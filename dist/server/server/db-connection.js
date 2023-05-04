"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.ExpenseModel = void 0;
const mongoose_1 = require("mongoose");
const mongoose = require('mongoose');
const ProjectSchema = new mongoose_1.Schema({
    name: String,
    stars: Number
}, {
    query: {
        byName(name) {
            return this.find({ name });
        }
    }
});
const expensesSchema = new mongoose_1.Schema({
    id: { type: Number, required: true },
    price: { type: Number, required: true },
    date: { type: Date, required: true },
    comment: { type: String, required: true },
    expense: { type: Boolean, required: true },
    accountId: { type: Number, required: true },
}, {
    query: {
        byId(id) {
            return this.find({ id });
        }
    }
});
exports.ExpenseModel = (0, mongoose_1.model)('Expense', expensesSchema);
//main().catch(err => console.log(err));
async function main() {
    console.log('call main');
    await mongoose.connect('mongodb+srv://alex_lenina:123QWEasd%21@cluster0.awziapz.mongodb.net/budget-manager?authSource=admin&replicaSet=atlas-zhd1jp-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true');
    mongoose.connection.on('open', () => {
        console.log('connected!!!');
    });
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
exports.main = main;
//# sourceMappingURL=db-connection.js.map