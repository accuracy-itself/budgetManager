import { requestUserExpenses, showUserExpenses, addExpenseForm } from "./expenses.js";
import { requestUserAccounts } from "./accounts.js";
import { expensesConstants } from "./constants.js";
let socket;
const openNav$ = document.querySelector(".open-nav");
const closeNav$ = document.querySelector(".close-nav");
const contentHolder$ = document.querySelector('.container');
const buttonHolder$ = document.querySelector('.button-container');
const homePage$ = document.querySelector('.home-page');
const accountsPage$ = document.querySelector('.accounts-page');
const categoriesPage$ = document.querySelector('.categories-page');
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
    buttonHolder$.innerHTML = '';
    buttonHolder$.innerHTML += `
        <button class="add-expense button">
            Add expense
        </button>
    `;
    const addExpense$ = document.querySelector(".add-expense");
    requestUserAccounts(socket);
    socket.on(expensesConstants.showAccounts, (ACCOUNTS) => {
        addExpense$.onclick = () => {
            console.log('clicked addexpense');
            addExpenseForm(socket, ACCOUNTS);
        };
    });
    requestUserExpenses(socket);
}
;
socket.on(expensesConstants.showExpenses, (EXPENSES) => {
    requestUserAccounts(socket);
    socket.on(expensesConstants.showAccounts, (ACCOUNTS) => {
        showUserExpenses(socket, EXPENSES, ACCOUNTS);
    });
});
socket.on(expensesConstants.addExpenses, (EXPENSES) => {
    goHome();
});
socket.on(expensesConstants.deleteExpenses, (EXPENSES) => {
    goHome();
});
//accounts page
accountsPage$.addEventListener('click', () => {
    console.log('clicked accounts');
    contentHolder$.innerHTML = '';
    buttonHolder$.innerHTML = '';
    //goToAccounts();
});
// function goToAccounts() {
//     console.log('on click event!!!');
//     buttonHolder$.innerHTML = '';
//     buttonHolder$.innerHTML += `
//         <button class="add-expense button">
//             Add expense
//         </button>
//     `;
//     const addExpense$: HTMLButtonElement = document.querySelector(".add-expense")!;
//     addExpense$.onclick = () => {
//         console.log('clicked addexpense');
//         addAccountForm(socket);
//     }
//     requestAccountExpenses(socket);
// };
// socket.on(expensesConstants.showExpenses, (EXPENSES) => {
//     showUserExpenses(socket, EXPENSES);  
// });
// socket.on(expensesConstants.addExpenses, (EXPENSES) => {
//     goHome(); 
// });
//disconnecting
socket.on('disconnect', function (message) {
    console.log('disconnect ' + message);
    location.reload();
});
