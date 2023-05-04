import { expensesConstants } from "./constants.js";
export function requestUserExpenses(socket) {
    console.log("show expenses");
    socket.emit(expensesConstants.showExpenses);
}
export function showUserExpenses(socket, EXPENSES, ACCOUNTS) {
    console.log('got expenses: ', EXPENSES);
    const headerHolder$ = document.querySelector('.header-content');
    headerHolder$.innerHTML = 'EXPENSES';
    const contentHolder$ = document.querySelector('.container');
    contentHolder$.innerHTML = '';
    EXPENSES.forEach((expense) => {
        const date = new Date(expense.date);
        contentHolder$.innerHTML += `
            <div class="expense ${expense.expense} ${expense.id}">
                <span class="expenses-list__expense-comment">
                    ${expense.comment}
                </span> 
                <span class="expenses-list__expense-price">
                    ${expense.price}
                    ${ACCOUNTS[ACCOUNTS.findIndex(account => account.id == expense.accountId)].currency}
                </span>
                <span class="expenses-list__expense-date">
                    ${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}
                </span>
                <span class="expense-account">
                    ${ACCOUNTS[ACCOUNTS.findIndex(account => account.id == expense.accountId)].name}
                </span>
                <button class="expenses-list__delete-expense delete-button-${expense.expense}">
                    Delete
                </button>
            </div>
            `;
    });
    for (let expense of document.querySelectorAll(".expense")) {
        expense.children[expense.children.length - 1].onclick = () => {
            deleteExpense(socket, expense.classList[2]);
        };
    }
}
const deleteExpense = (socket, id) => {
    socket.emit(expensesConstants.deleteExpenses, id);
};
export function addExpenseForm(socket, ACCOUNTS) {
    const buttonHolder$ = document.querySelector('.button-container');
    buttonHolder$.innerHTML = '';
    buttonHolder$.innerHTML += `
        <div class="expense-creator">
            <div class="expense-inputs">
                <input
                    type="text"
                    class="expense-comment"
                    id="expense-comment"
                    placeholder="Comment"
                />
            <select
                name="account"
                id="expense-account"
                class="expense-account"
            >
                
            </select>

            <select
                name="state"
                id="expense-state"
                class="expense-state"
            >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
            </select>

            <input
              type="number"
              min="1"
              class="expense-price"
              placeholder="Price $"
            />
            
        </div>
        <div class="expense-controls">
            <button class="expense-add button">Add expense</button>
        </div>
        </div>
            `;
    const accountSelect$ = document.querySelector(".expense-account");
    ACCOUNTS.forEach((account) => {
        accountSelect$.innerHTML += `
            <option value="${account.id}">${account.name} ${account.currency}</option> 
        `;
    });
    const addExpense$ = document.querySelector(".expense-add");
    addExpense$.onclick = () => {
        console.log('clicked expense-add');
        const expenseComment$ = document.querySelector(".expense-comment");
        const expensePrice$ = document.querySelector(".expense-price");
        const expenseAccount$ = document.querySelector(".expense-account");
        const expenseState$ = document.querySelector(".expense-state");
        const expenseState = expenseState$.options[expenseState$.selectedIndex].value == "income" ? false : true;
        if (expenseComment$.value.trim().length === 0 || expensePrice$.value.trim().length === 0 || expensePrice$.valueAsNumber < 1) {
            alert('Comment and normal price required!');
        }
        else {
            const expense = {
                accountId: Number(accountSelect$.options[expenseAccount$.selectedIndex].value),
                id: Math.round(Math.random() * 10000),
                comment: expenseComment$.value,
                price: expensePrice$.valueAsNumber,
                date: new Date(),
                expense: expenseState
            };
            socket.emit(expensesConstants.addExpenses, expense);
        }
    };
}
