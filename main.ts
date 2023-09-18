interface Task {
  id: number;
  name: string;
  important: boolean;
  createdDate: string;
}

const taskInput = document.getElementById("taskInput") as HTMLInputElement;
const regularTaskBtn = document.getElementById(
  "regularTaskBtn"
) as HTMLButtonElement;
const importantTaskBtn = document.getElementById(
  "importantTaskBtn"
) as HTMLButtonElement;
const addTaskBtn = document.getElementById("addTaskBtn") as HTMLButtonElement;
const taskList = document.getElementById("taskList") as HTMLUListElement;
const deleteAllBtnContainer = document.getElementById(
  "deleteAllBtnContainer"
) as HTMLDivElement;

let isImportantTask = false;

regularTaskBtn.addEventListener("click", setRegularTaskOption);
importantTaskBtn.addEventListener("click", setImportantTaskOption);

function setRegularTaskOption(): void {
  isImportantTask = false;
  regularTaskBtn.classList.add("active");
  importantTaskBtn.classList.remove("active");
}

function setImportantTaskOption(): void {
  isImportantTask = true;
  importantTaskBtn.classList.add("active");
  regularTaskBtn.classList.remove("active");
}

let tasks: Task[] = [];

function renderTasks(): void {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.innerHTML = `
    <div>${task.name}</div>
    <div class="task-actions">
        <input type="text" class="edit-input" value="${task.name}">
        <div class="task-created-time"> ${task.createdDate}</div>
        <span class="edit-btn" data-id="${task.id}">&#9998;</span>
        <span class="delete-btn" data-id="${task.id}">&#10006;</span>
    </div>
    <p class="error-label">Can't edit with an empty name.</p> `;

    if (task.important) {
      li.classList.add("important-task");
    }

    taskList.appendChild(li);
  });

  const editButtons = document.querySelectorAll(".edit-btn");
  editButtons.forEach((button) => {
    button.addEventListener("click", editTask);
  });

  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", deleteTask);
  });

  renderDeleteAllButton();
}

function updateLocalStorage(): void {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  console.log("Saved to Local Storage:", tasks);
}

function loadTasksFromLocalStorage(): void {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }
  if (!isImportantTask) {
    setRegularTaskOption();
  }

  renderTasks();
}

const mainErrorMessage = document.getElementById(
  "mainErrorMessage"
) as HTMLParagraphElement;

// Function to add a new task
function addTask(): void {
  const taskName = taskInput.value.trim();
  if (taskName !== "") {
    mainErrorMessage.style.display = "none";

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("en-GB");

    const newTask: Task = {
      id: Date.now(),
      name: taskName,
      important: isImportantTask,
      createdDate: formattedDate,
    };

    tasks.push(newTask);

    renderTasks();
    taskInput.value = "";
  } else {
    mainErrorMessage.style.display = "block";
    taskInput.classList.add("shake");
    setTimeout(() => {
      taskInput.classList.remove("shake");
    }, 500);
  }
}

taskInput.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addTask();
  }
});

function deleteTask(event: Event): void {
  const target = event.target as HTMLElement;
  const taskId = parseInt(target.getAttribute("data-id") as string);
  tasks = tasks.filter((task) => task.id !== taskId);
  // updateLocalStorage();
  renderTasks();
}

function saveAllTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  alert("All tasks saved to local storage.");
}

function editTask(event: Event): void {
  const target = event.target as HTMLElement;
  const li = target.parentElement!.parentElement!;
  const editInput = li.querySelector(".edit-input") as HTMLInputElement;
  const errorLabel = li.querySelector(".error-label") as HTMLParagraphElement;

  editInput.style.display = "block";
  editInput.focus();

  editInput.addEventListener("blur", () => {
    const updatedName = editInput.value.trim();
    if (updatedName !== "") {
      const taskId = parseInt(target.getAttribute("data-id") as string);
      const taskToUpdate = tasks.find((task) => task.id === taskId);
      if (taskToUpdate) {
        taskToUpdate.name = updatedName;
        editInput.style.display = "none";
        renderTasks();
        errorLabel.style.display = "none";
      }
    } else {
      editInput.style.display = "none";
      errorLabel.style.display = "block";
      li.classList.add("shake");
      setTimeout(() => {
        li.classList.remove("shake");
      }, 500);
    }
  });
}

function renderDeleteAllButton(): void {
  deleteAllBtnContainer.innerHTML =
    tasks.length > 0
      ? '<button id="deleteAllBtn" class="allBtn delete-all-btn">Delete All Tasks</button> <button id="saveAllBtn" class="allBtn save-all-btn">Save All Tasks</button>'
      : "";
  const deleteAllBtn = document.getElementById(
    "deleteAllBtn"
  ) as HTMLButtonElement;
  if (deleteAllBtn) {
    deleteAllBtn.addEventListener("click", deleteAllTasks);
  }
  const saveAllTasksBtn = document.getElementById(
    "saveAllBtn"
  ) as HTMLButtonElement;

  if (saveAllTasksBtn) {
    saveAllTasksBtn.addEventListener("click", saveAllTasksToLocalStorage);
  }
}

function deleteAllTasks(): void {
  if (confirm("Are you sure you want to delete all tasks?")) {
    tasks = [];
    updateLocalStorage();
    renderTasks();
  }
}

addTaskBtn.addEventListener("click", addTask);

loadTasksFromLocalStorage();
renderTasks();
