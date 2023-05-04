import { Account } from "../types/model.js";
import { expensesConstants } from "./constants.js";

export function requestUserAccounts(socket) {
    console.log("show accounts");
    socket.emit(expensesConstants.showAccounts);
}

export function requestDisplayableUserAccounts(socket) {
    console.log("display accounts");
    socket.emit(expensesConstants.displayAccounts);
}


export function addAccountForm(socket) {
    const buttonHolder$: HTMLElement = document.querySelector('.button-container');
    buttonHolder$.innerHTML = '';
    buttonHolder$.innerHTML += `
        <div class="account-creator">
            <div class="account-inputs">
                <input
                    type="text"
                    class="account-name"
                    id="account-name"
                    placeholder="Name"
                />

                <input
                    type="number"
                    min="1"
                    class="account-balance"
                    placeholder="Balance"
                />

                <input
                    type="text"
                    class="account-currency"
                    id="account-currency"
                    placeholder="Currency"
                />
            </div>
            <div class="account-controls">
                <button class="account-add button">Add account</button>
            </div>
        </div>
        `;

    const addAccount$: HTMLButtonElement = document.querySelector(".account-add");

    addAccount$.onclick = () => {
        console.log('clicked account-add');
        const accountName$: HTMLInputElement = document.querySelector(".account-name");
        const accountBalance$: HTMLInputElement = document.querySelector(".account-balance");
        const accountCurrency$: HTMLInputElement = document.querySelector(".account-currency");
        if (accountName$.value.trim().length === 0 ||
            accountBalance$.value.trim().length === 0 ||
            accountBalance$.valueAsNumber < 0 ||
            accountCurrency$.value.trim().length === 0) {
            alert('All fields required!');
        } else {
            const account: Account = {
                id: Math.round(Math.random() * 10000),
                name: accountName$.value,
                balance: accountBalance$.valueAsNumber,
                currency: accountCurrency$.value
            };

            socket.emit(expensesConstants.addAccounts, account);
        }
    }
}


export function displayAccounts(socket, ACCOUNTS: Account[]) {
    const headerHolder$: HTMLElement = document.querySelector('.header-content');
    headerHolder$.innerHTML = 'ACCOUNTS';

    const contentHolder$: HTMLElement = document.querySelector('.container');
    contentHolder$.innerHTML = '';
    ACCOUNTS.forEach((account: Account) => {
        contentHolder$.innerHTML += `
            <div class="account ${account.id}">
                <span class="accounts-list__account-name">
                    ${account.name}
                </span> 
                <span class="accounts-list__account-price">
                    <input type="number" min="0" class="account-balance${account.id} account-balance" value="${account.balance}"></input>
                    ${account.currency}
                </span>
                
                <button class="accounts-list__delete-account delete-button">
                    Delete
                </button>

                <button class="accounts-list__delete-account update-button">
                    Update
                </button>
            </div>
            `;
    });

    for (let account of document.querySelectorAll(".account") as any) {
        (account.children[account.children.length - 2] as HTMLButtonElement).onclick = () => {
            deleteAccount(socket, account.classList[1]);
        };
        (account.children[account.children.length - 1] as HTMLButtonElement).onclick = () => {
            const newBalance: number = (document.querySelector(".account-balance" + account.classList[1])as HTMLInputElement).valueAsNumber;
            updateAccount(socket, account.classList[1], newBalance);
        };
    }
}

const deleteAccount = (socket, id: number) => {
    socket.emit(expensesConstants.deleteAccounts, id);
}

const updateAccount = (socket, id: number, value: number) => {
    socket.emit(expensesConstants.updateAccounts, {id: id, value: value});
}

