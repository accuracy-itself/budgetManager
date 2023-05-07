import { Expense } from '../types/model.js'
import { Account } from '../types/model.js'
import { ExpenseModel, AccountModel } from './db-connection.js';

function convertToAccount(accountDto) {
    const account: Account = {
        id: accountDto.id,
        balance: accountDto.balance,
        currency: accountDto.currency,
        name: accountDto.name
    };

    return account;
}

export class AccountService {
    static async getAcounts() {
        let Accounts: Account[] = [];
        await AccountModel.find({
        }).then(accounts => accounts.forEach(account => Accounts.push(convertToAccount(account))));
        console.log(Accounts);

        return Accounts;
    }

    static async addAcocunt(account: Account) {
        const accountNew = new AccountModel(account);
        await accountNew.save();
    }

    static async updateAccount(id: number, newBalance: number, expenseUpdate: boolean) {
        const filter = { id: id };
        const update = { balance: newBalance };
        const options = { new: true };

        if (expenseUpdate) {
            AccountModel.findOne(filter).then(async (account) => {
                newBalance += account.balance;
            })
        }
            console.log(update);
        const account = await AccountModel.findOneAndUpdate(filter, update, options);
        return account;
    }

    static async deleteAccount(id: number) {
        await AccountModel.deleteOne({ id: id });
    }
} 
