import { requestUserExpenses, showUserExpenses, addExpenseForm } from "./expenses.js";
import { requestUserAccounts, requestDisplayableUserAccounts, addAccountForm, displayAccounts } from "./accounts.js";
import { expensesConstants } from "./constants.js";
import { showStatistics } from "./statistics.js";
const openNav$ = document.querySelector(".open-nav");
const closeNav$ = document.querySelector(".close-nav");
const contentHolder$ = document.querySelector('.container');
const buttonHolder$ = document.querySelector('.button-container');
const homePage$ = document.querySelector('.home-page');
const accountsPage$ = document.querySelector('.accounts-page');
const signPage$ = document.querySelector('.sign-page');
const statsPage$ = document.querySelector('.statistics-page');
let socket;
socket = io();
socket.on('connect', function () {
    console.log('connect');
    goHome();
});
//navigation
export function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}
openNav$.onclick = () => {
    openNav();
};
closeNav$.onclick = () => {
    closeNav();
};
export function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}
//home page
homePage$.addEventListener('click', () => {
    contentHolder$.innerHTML = '';
    buttonHolder$.innerHTML = '';
    goHome();
});
function goHome() {
    console.log('on click event!!!');
    buttonHolder$.innerHTML = `
        <button class="add-expense button">
            Add expense
        </button>
    `;
    buttonHolder$.innerHTML += `
    <div class="statistic-creator">
        <div class="statistic-inputs">
            <input
                type="date"
                class="statistic-date-first"
                id="statistic-date-first"
                placeholder="First Date"
            />

            <input
                type="date"
                class="statistic-date-second"
                id="statistic-date-second"
                placeholder="Second Date"
            />
            
        </div>
        <div class="statistic-controls">
            <button class="statistic-add button">Show</button>
        </div>
    </div>
    `;
    const dateFirst$ = document.querySelector(".statistic-date-first");
    const dateSecond$ = document.querySelector(".statistic-date-second");
    const showSats$ = document.querySelector(".statistic-add");
    showSats$.onclick = () => {
        if (dateFirst$.valueAsDate == null || dateSecond$.valueAsDate == null) {
            alert('write dates!!');
        }
        else {
            socket.emit(expensesConstants.getExpenses, { dateFirst: dateFirst$.value, dateSecond: dateSecond$.value });
            socket.on(expensesConstants.getExpenses, (EXPENSES) => {
                console.log(EXPENSES);
            });
        }
    };
    requestUserAccounts(socket);
    requestUserExpenses(socket);
}
;
let ACCOUNTS = [];
socket.on(expensesConstants.showAccounts, (accounts) => {
    ACCOUNTS = accounts;
    const addExpense$ = document.querySelector(".add-expense");
    addExpense$.onclick = () => {
        console.log('clicked addexpense');
        addExpenseForm(socket, ACCOUNTS);
    };
});
socket.on(expensesConstants.showExpenses, (EXPENSES) => {
    showUserExpenses(socket, EXPENSES, ACCOUNTS);
});
socket.on(expensesConstants.getExpenses, (EXPENSES) => {
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
}
;
socket.on(expensesConstants.displayAccounts, (accounts) => {
    ACCOUNTS = accounts;
    const addAccount$ = document.querySelector(".add-account");
    addAccount$.onclick = () => {
        console.log('clicked addaccount');
        addAccountForm(socket);
    };
    displayAccounts(socket, ACCOUNTS);
});
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
    console.log('clicked sign');
    showStatistics(socket);
});
//sign page
signPage$.addEventListener('click', () => {
    console.log('clicked sign');
    contentHolder$.innerHTML = 'Coming soon...';
    buttonHolder$.innerHTML = '';
    const headerHolder$ = document.querySelector('.header-content');
    headerHolder$.innerHTML = 'SIGN IN/UP';
});
//disconnecting
socket.on('disconnect', function (message) {
    console.log('disconnect ' + message);
    location.reload();
});
