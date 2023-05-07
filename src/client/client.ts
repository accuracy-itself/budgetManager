import { requestUserExpenses, showUserExpenses, addExpenseForm, addSortExpenses } from "./expenses.js";
import { requestUserAccounts, requestDisplayableUserAccounts, addAccountForm, displayAccounts } from "./accounts.js";
import { Account, Expense } from '../types/model.js';
import { expensesConstants } from "./constants.js";
import { showStatistics } from "./statistics.js";

const openNav$: HTMLElement = document.querySelector(".open-nav")!;
const closeNav$: HTMLElement = document.querySelector(".close-nav")!;
const contentHolder$: HTMLElement = document.querySelector('.container');
const buttonHolder$: HTMLElement = document.querySelector('.button-container');
const totalHolder$: HTMLElement = document.querySelector('.total-container');
const homePage$ = document.querySelector('.home-page');
const accountsPage$ = document.querySelector('.accounts-page');
const signPage$ = document.querySelector('.sign-page');
const statsPage$ = document.querySelector('.statistics-page');

let socket: SocketIOClient.Socket;
socket = io()

socket.on('connect', function () {
    console.log('connect');
    goHome();
})

//navigation
export function openNav() {
    document.getElementById("mySidenav")!.style.width = "250px";
}

openNav$.onclick = () => {
    openNav();
}

closeNav$.onclick = () => {
    closeNav();
}

export function closeNav() {
    document.getElementById("mySidenav")!.style.width = "0";
}


//home page
homePage$.addEventListener('click', () => {
    contentHolder$.innerHTML = '';
    buttonHolder$.innerHTML = '';
    totalHolder$.innerHTML = '';
    goHome();
});
function goHome() {
    console.log('on click event!!!');
    buttonHolder$.innerHTML = `
        <button class="add-expense button">
            Add expense
        </button>
    `;


    addSortExpenses(socket);
    requestUserAccounts(socket);
    requestUserExpenses(socket);
};

let ACCOUNTS: Account[] = [];
socket.on(expensesConstants.showAccounts, (accounts) => {
    ACCOUNTS = accounts;
    const addExpense$: HTMLButtonElement = document.querySelector(".add-expense")!;

    addExpense$.onclick = () => {
        console.log('clicked addexpense');
        addExpenseForm(socket, ACCOUNTS);
    }
})

socket.on(expensesConstants.showExpenses, (EXPENSES: Expense[]) => {
    showUserExpenses(socket, EXPENSES, ACCOUNTS);
});

socket.on(expensesConstants.getExpenses, (EXPENSES: Expense[]) => {
    showUserExpenses(socket, EXPENSES, ACCOUNTS);
});

socket.on(expensesConstants.addExpenses, () => {
    goHome();
});

socket.on(expensesConstants.deleteExpenses, () => {
    goHome();
});


//accounts page
accountsPage$.addEventListener('click', () => {
    console.log('clicked accounts');
    contentHolder$.innerHTML = '';
    buttonHolder$.innerHTML = '';
    goToAccounts();
});
function goToAccounts() {
    buttonHolder$.innerHTML = `
        <button class="add-account button">
            Add account
        </button>
    `;

    requestDisplayableUserAccounts(socket);
};

socket.on(expensesConstants.displayAccounts, (accounts) => {
    ACCOUNTS = accounts;
    const addAccount$: HTMLButtonElement = document.querySelector(".add-account")!;

    addAccount$.onclick = () => {
        console.log('clicked addaccount');
        addAccountForm(socket);
    }

    displayAccounts(socket, ACCOUNTS);
})


socket.on(expensesConstants.addAccounts, () => {
    goToAccounts();
});

socket.on(expensesConstants.deleteAccounts, () => {
    goToAccounts();
});


//statistics page
statsPage$.addEventListener('click', () => {
    contentHolder$.innerHTML = '';
    buttonHolder$.innerHTML = '';
    totalHolder$.innerHTML = '';

    console.log('clicked sign');
    showStatistics(socket);
});


//sign page
signPage$.addEventListener('click', () => {
    console.log('clicked sign');
    contentHolder$.innerHTML = 'Coming soon...';
    buttonHolder$.innerHTML = '';
    totalHolder$.innerHTML = '';
    const headerHolder$: HTMLElement = document.querySelector('.header-content');
    headerHolder$.innerHTML = 'SIGN IN/UP';
});


//disconnecting
socket.on('disconnect', function (message: any) {
    console.log('disconnect ' + message)
    location.reload()
})