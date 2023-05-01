import {showUserExpenses} from "./expenses.js";

let socket: SocketIOClient.Socket

const addTask$: HTMLButtonElement = document.querySelector(".task-creator__task-add")!;
const taskName$: HTMLInputElement = document.querySelector(".task-creator__task-name")!;
const taskStatus$: HTMLSelectElement = document.querySelector(".task-creator__task-status")!;
const tasksList$: HTMLElement = document.querySelector(".tasks-list")!;
const openNav$: HTMLElement = document.querySelector(".open-nav")!;

interface Task {
    taskName: string
    taskStatus: string,
    taskId: number,
}

socket = io()

socket.on('connect', function () {
    console.log('connect')
})

export function openNav() {
    document.getElementById("mySidenav")!.style.width = "250px";
}

openNav$.onclick = () => {
    openNav();
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
function closeNav() {
    document.getElementById("mySidenav")!.style.width = "0";
}

const addTask = (data: Task): void => {
    socket.emit("message", (data));
}

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

socket.on('tasks', function (message: any) {
    clearTasksList();
    console.log(message);
    (message).forEach((task: Task) => {
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

        for (let task of document.querySelectorAll(".task") as any) {
            (task.children[task.children.length - 1] as HTMLButtonElement).onclick = () => {
                deleteTask(task.classList[1]);
            };
        }
    })
})




const deleteTask = (taskId: number) => {
    clearTasksList();
    socket.emit("deleteTask", taskId);
}



function clearTasksList() {
    tasksList$.innerHTML = "";
}

socket.on('disconnect', function (message: any) {
    console.log('disconnect ' + message)
    location.reload()
})


const homePage$ =  document.querySelector('.home-page');
console.log('element: ', homePage$);
homePage$.addEventListener('click', () => {
    console.log('on click event!!!');
    showUserExpenses(socket);
})