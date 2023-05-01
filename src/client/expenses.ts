import { expensesConstants } from "./constants.js";

export function showUserExpenses(socket) {
    console.log("show expenses");
    socket.emit(expensesConstants.showExpenses);
}




