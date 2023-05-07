import { expensesConstants } from "./constants.js";
export function showStatistics(socket) {
    const buttonHolder$ = document.querySelector('.button-container');
    const contentHolder$ = document.querySelector('.container');
    const headerHolder$ = document.querySelector('.header-content');
    headerHolder$.innerHTML = 'STATISTICS';
    buttonHolder$.innerHTML = '';
    contentHolder$.innerHTML = '';
    buttonHolder$.innerHTML = `
    <div class="statistic-creator">
        <div class="statistic-inputs">
           <select
                name="account"
                id="expense-account"
                class="expense-account"
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
    const dateFirst$ = document.querySelector(".statistic-date-first");
    const dateSecond$ = document.querySelector(".statistic-date-second");
    const showSats$ = document.querySelector(".statistic-add");
    showSats$.onclick = () => {
        socket.emit(expensesConstants.getStatExpenses, { dateFirst: dateFirst$.value, dateSecond: dateSecond$.value });
        socket.on(expensesConstants.getStatExpenses, (EXPENSES) => {
            console.log(EXPENSES);
        });
    };
}
