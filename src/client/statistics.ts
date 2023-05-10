import { Expense, Account } from "../types/model.js";
import { expensesConstants } from "./constants.js";

let ACCOUNTS: Account[] = [];
export function requestStatAccounts(socket) {
    console.log("show stats");
    socket.emit(expensesConstants.getStatAccounts);
}

export function showStatForm(socket, accounts) {
    ACCOUNTS = accounts;
    const buttonHolder$: HTMLElement = document.querySelector('.button-container');
    const contentHolder$: HTMLElement = document.querySelector('.container');
    const headerHolder$: HTMLElement = document.querySelector('.header-content');

    headerHolder$.innerHTML = 'STATISTICS';
    buttonHolder$.innerHTML = '';
    contentHolder$.innerHTML = '';

    buttonHolder$.innerHTML = `
    <div class="statistic-creator">
        <div class="statistic-inputs">
           <select      
                name="account"
                id="statictic-account"
                class="statictic-account"
            >

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

    const accountSelect$: HTMLSelectElement = document.querySelector(".statictic-account");
    accounts.forEach((account: Account) => {
        accountSelect$.innerHTML += `
            <option value="${account.id}">${account.name} ${account.currency}</option> 
        `;
    });

    const dateFirst$: HTMLInputElement = document.querySelector(".statistic-date-first");
    const dateSecond$: HTMLInputElement = document.querySelector(".statistic-date-second");
    const showStats$: HTMLButtonElement = document.querySelector(".statistic-add");

    dateFirst$.valueAsDate = new Date("2000-01-01");
    dateSecond$.valueAsDate = new Date();

    showStats$.onclick = () => {
        const accountSelect$: HTMLSelectElement = document.querySelector(".statictic-account");

        const expenseAccount$: HTMLSelectElement = document.querySelector(".statictic-account");
        console.log("show stats onclick: ", ACCOUNTS);
        const accountSelected = ACCOUNTS[ACCOUNTS.findIndex(account => account.id == Number(accountSelect$.options[expenseAccount$.selectedIndex].value))]

        if (dateFirst$.valueAsDate == null || dateSecond$.valueAsDate == null) {
            alert('write dates!!')
        } else {
            socket.emit(expensesConstants.getStatExpenses, { dateFirst: dateFirst$.valueAsDate, dateSecond: dateSecond$.valueAsDate, account: accountSelected });
            socket.on(expensesConstants.getStatExpenses, (EXPENSES: Expense[]) => {
                console.log(EXPENSES);

                showStats(accountSelected, EXPENSES);
            });
        }
    }
}

function showStats(accountSelected, EXPENSES: Expense[]) {
    const contentHolder$: HTMLElement = document.querySelector('.container');
    const valueHolder$: HTMLElement = document.querySelector('.value-holder');

    let totalIncomes: number = 0;
    let totalExpenses: number = 0;

    contentHolder$.innerHTML = '';
    EXPENSES.forEach((expense: Expense) => {
        const date: Date = new Date(expense.date);
        if (expense.expense) {
            totalExpenses += expense.price;
        } else {
            totalIncomes += expense.price;
        }

        contentHolder$.innerHTML += `
            <div class="expense ${expense.expense} ${expense.id}">
                <span class="expenses-list__expense-comment">
                    ${expense.comment}
                </span> 
                <span class="expenses-list__expense-price">
                    ${expense.price}
                    ${accountSelected.currency}
                </span>
                <span class="expenses-list__expense-date">
                    ${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}
                </span>
                <span class="expense-account">
                    ${accountSelected.name}
                </span>
            </div>
            `;
    });


    valueHolder$.innerHTML = `
    <div class="total-values">
        <span class="account-stat-name">
        ${accountSelected.name}.
        </span>
        Total incomes:
        <span class="total-incomes">
            ${totalIncomes}.
        </span>
        Total expenses:
        <span class="total-expenses">
            ${totalExpenses}.
        </span>
    </div>
    `;

    drawStats(totalIncomes, totalExpenses);
}


function drawStats(incomes: number, expenses: number) {
    const plotHolder$: HTMLElement = document.querySelector('.plot-holder');
    const width = 400;
    const height= 200;
    plotHolder$.innerHTML = `<canvas id="plot-canvas" width="${width}px" height="${height}px"></canvas>`;

    if (incomes != 0 && expenses != 0) {
        console.log('incomes');
        const incomesHeight = incomes / (incomes + expenses) * 100 * 2;
        const expensesHeight = expenses / (incomes + expenses) * 100 * 2;

        let canvas: HTMLCanvasElement = document.getElementById('plot-canvas') as HTMLCanvasElement;
        let ctx = canvas.getContext('2d');
        drawHistogram(ctx, 100, height - incomesHeight, 80, incomesHeight, 'yellow');
        drawHistogram(ctx, width - 100 - 80, height - expensesHeight, 80, expensesHeight, 'green');

        function drawHistogram(ctx, x, y, w, h, color) {
            ctx.save();

            ctx.fillStyle = color;
            ctx.fillRect(x, y, w, h);

            ctx.restore();
        }
    }
}