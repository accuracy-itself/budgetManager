import { Expense } from "../types/model.js";
import { Account } from "../types/model.js";
import { expensesConstants } from "./constants.js";

export function showStatistics(socket) {
    const buttonHolder$: HTMLElement = document.querySelector('.button-container');
    const contentHolder$: HTMLElement = document.querySelector('.container');
    const headerHolder$: HTMLElement = document.querySelector('.header-content');
    
    headerHolder$.innerHTML = 'STATISTICS';
    buttonHolder$.innerHTML = '';
    contentHolder$.innerHTML = '';

    buttonHolder$.innerHTML = `
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

    const dateFirst$: HTMLInputElement = document.querySelector(".statistic-date-first");
    const dateSecond$: HTMLInputElement = document.querySelector(".statistic-date-second");
    const showSats$: HTMLButtonElement = document.querySelector(".statistic-add");

    showSats$.onclick = () => {
        socket.emit(expensesConstants.getExpenses, {dateFirst: dateFirst$.value, dateSecond: dateSecond$.value});
        socket.on(expensesConstants.getExpenses, (EXPENSES: Expense[]) => {
            console.log(EXPENSES);
        });
    }
    
}