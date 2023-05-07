"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountService = void 0;
const db_connection_js_1 = require("./db-connection.js");
function convertToAccount(accountDto) {
    const account = {
        id: accountDto.id,
        balance: accountDto.balance,
        currency: accountDto.currency,
        name: accountDto.name
    };
    return account;
}
class AccountService {
    static async getAcounts() {
        let Accounts = [];
        await db_connection_js_1.AccountModel.find({}).then(accounts => accounts.forEach(account => Accounts.push(convertToAccount(account))));
        console.log(Accounts);
        return Accounts;
    }
    static async addAcocunt(account) {
        const accountNew = new db_connection_js_1.AccountModel(account);
        await accountNew.save();
    }
    static async updateAccount(id, newBalance, expenseUpdate) {
        const filter = { id: id };
        const update = { balance: newBalance };
        const options = { new: true };
        if (expenseUpdate) {
            db_connection_js_1.AccountModel.findOne(filter).then(async (account) => {
                newBalance += account.balance;
            });
        }
        console.log(update);
        const account = await db_connection_js_1.AccountModel.findOneAndUpdate(filter, update, options);
        return account;
    }
    static async deleteAccount(id) {
        await db_connection_js_1.AccountModel.deleteOne({ id: id });
    }
}
exports.AccountService = AccountService;
//# sourceMappingURL=account-service.js.map