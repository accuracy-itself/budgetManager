// import { Category } from "../types/model.js";
// import { expensesConstants } from "./constants.js";

// export function requestUserExpenses(socket) {
//     console.log("show expenses");
//     socket.emit(expensesConstants.showExpenses);
// }

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
//                     ${date.getFullYear()}/${date.getMonth()}/${date.getDay()}
//                 </span>
                
//                 <span class="expenses-list__delete-expense">
//                     &times
//                 </span>
//             </div>
//             `;        
//     });
// }




