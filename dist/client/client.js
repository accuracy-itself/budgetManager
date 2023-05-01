import { showUserExpenses } from "./expenses.js";
let socket;
const addTask$ = document.querySelector(".task-creator__task-add");
const taskName$ = document.querySelector(".task-creator__task-name");
const taskStatus$ = document.querySelector(".task-creator__task-status");
const tasksList$ = document.querySelector(".tasks-list");
const openNav$ = document.querySelector(".open-nav");
socket = io();
socket.on('connect', function () {
    console.log('connect');
});
export function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}
openNav$.onclick = () => {
    openNav();
};
/* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}
const addTask = (data) => {
    socket.emit("message", (data));
};
// addTask$.onclick = () => {
//     if (taskName$.value.trim().length === 0) {
//         alert("task name is REQUIRED!!!");
//     } else {
//         addTask({
//             taskName: taskName$.value,
//             taskStatus: taskStatus$.options[taskStatus$.selectedIndex].text,
//             taskId: Math.round(Math.random() * 10000)
//         });
//     }
// };
socket.on('tasks', function (message) {
    clearTasksList();
    console.log(message);
    (message).forEach((task) => {
        console.log("your task is", task);
        console.log(task["taskId"]);
        tasksList$.innerHTML += `
                <div class="task ${task.taskId}">
                    <span class="tasks-list__task-name">
                        ${task.taskName}
                    </span>
                    <span class="tasks-list__task-status">
                        ${task.taskStatus}
                    </span>
                    <span class="tasks-list__delete-task">
                        &times
                    </span>
                </div>
                `;
        for (let task of document.querySelectorAll(".task")) {
            task.children[task.children.length - 1].onclick = () => {
                deleteTask(task.classList[1]);
            };
        }
    });
});
const deleteTask = (taskId) => {
    clearTasksList();
    socket.emit("deleteTask", taskId);
};
function clearTasksList() {
    tasksList$.innerHTML = "";
}
socket.on('disconnect', function (message) {
    console.log('disconnect ' + message);
    location.reload();
});
const homePage$ = document.querySelector('.home-page');
console.log('element: ', homePage$);
homePage$.addEventListener('click', () => {
    console.log('on click event!!!');
    showUserExpenses(socket);
});
