import { expensesConstants } from "./constants.js";
export function requestUserAccounts(socket) {
    console.log("show accounts");
    socket.emit(expensesConstants.showAccounts);
}
// export function showUserExpenses(EXPENSES: Expense[]) {
//     console.log('got expenses: ', EXPENSES);
//     const contentHolder$: HTMLElement = document.querySelector('.container');
//     contentHolder$.innerHTML = '';
//     EXPENSES.forEach((expense: Expense) => {
//         const date: Date = new Date(expense.date);
//         contentHolder$.innerHTML += `
//             <div class="expense ${expense.id}">
//                 <span class="expenses-list__expense-comment">
//                     ${expense.comment}
//                 </span>
//                 <span class="expenses-list__expense-price">
//                     ${expense.price}
//                 </span>
//                 <span class="expenses-list__expense-date">
//                     ${date.getFullYear()}/${date.getMonth() + 1}/${date.getDay()}
//                 </span>
//                 <span class="expenses-list__delete-expense">
//                     &times
//                 </span>
//             </div>
//             `;
//     });
// }
// export function addExpenseForm(socket) {
//     const buttonHolder$: HTMLElement = document.querySelector('.button-container');
//     const contentHolder$: HTMLElement = document.querySelector('.container');
//     buttonHolder$.innerHTML = '';
//     buttonHolder$.innerHTML += `
//         <div class="expense-creator">
//             <div class="expense-inputs">
//                 <input
//                     type="text"
//                     class="expense-comment"
//                     id="expense-comment"
//                     placeholder="Comment"
//                 />
//             <select
//                 name="account"
//                 id="expense-account"
//                 class="expense-account"
//             >
//             </select>
//             <select
//                 name="state"
//                 id="expense-state"
//                 class="expense-state"
//             >
//                 <option value="income">Income</option>
//                 <option value="expense">Expense</option>
//             </select>
//             <input
//               type="number"
//               min="1"
//               class="expense-price"
//               placeholder="Price $"
//             />
//         </div>
//         <div class="expense-controls">
//             <button class="expense-add button">Add</button>
//         </div>
//         </div>
//             `;
//     // <input
//     //   type="date"
//     //   class="expense-date"
//     //   placeholder="Pay date"
//     // />
//     const addExpense$: HTMLButtonElement = document.querySelector(".expense-add");
//     addExpense$.onclick = () => {
//         console.log('clicked expense-add');
//         const expenseComment$: HTMLInputElement = document.querySelector(".expense-comment");
//         const expensePrice$: HTMLInputElement = document.querySelector(".expense-price");
//         const expenseAccount$: HTMLSelectElement = document.querySelector(".expense-account");
//         const expenseState$: HTMLSelectElement = document.querySelector(".expense-state");
//         const expenseState: boolean = expenseState$.options[expenseState$.selectedIndex].value == "income" ? false : true;
//         if (expenseComment$.value.trim().length === 0 || expensePrice$.value.trim().length === 0 || expensePrice$.valueAsNumber < 1) {
//             alert('Comment and normal price required!');
//         } else {
//             const expense: Expense = {
//                 id: Math.round(Math.random() * 10000),
//                 comment: expenseComment$.value,
//                 price: expensePrice$.valueAsNumber,
//                 date: new Date(),
//                 expense: expenseState
//             };
//             socket.emit(expensesConstants.addExpenses, expense);
//         }
//     }
// }
