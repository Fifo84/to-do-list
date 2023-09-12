// Interface for a single task
interface Task {
  id: number;
  name: string;
  important: boolean; // Add this line
  createdDate: string;
}

// Get elements from the DOM
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

// event listeners
// Event listeners for task option buttons
regularTaskBtn.addEventListener("click", setRegularTaskOption);
importantTaskBtn.addEventListener("click", setImportantTaskOption);

// Function to set task option to regular
function setRegularTaskOption(): void {
  isImportantTask = false;
  regularTaskBtn.classList.add("active");
  importantTaskBtn.classList.remove("active");
}

// Function to set task option to important
function setImportantTaskOption(): void {
  isImportantTask = true;
  importantTaskBtn.classList.add("active");
  regularTaskBtn.classList.remove("active");
}

// Array to store tasks
let tasks: Task[] = [];

// Function to render tasks in the list
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
      li.classList.add("important-task"); // Add important task class
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

// Function to save tasks to local storage
function updateLocalStorage(): void {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  console.log("Saved to Local Storage:", tasks);
}

// Function to load tasks from local storage
function loadTasksFromLocalStorage(): void {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }
  if (!isImportantTask) {
    setRegularTaskOption();
  }

  renderTasks(); // Render tasks with appropriate styles
}

const mainErrorMessage = document.getElementById(
  "mainErrorMessage"
) as HTMLParagraphElement;

// Function to add a new task
function addTask(): void {
  const taskName = taskInput.value.trim();
  if (taskName !== "") {
    mainErrorMessage.style.display = "none"; // Hide error message

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("en-GB");

    const newTask: Task = {
      id: Date.now(),
      name: taskName,
      important: isImportantTask, // Add the important flag
      createdDate: formattedDate, // Add a timestamp
    };

    tasks.push(newTask);
    // Store the new task temporarily (not in the tasks array)
    // localStorage.setItem(`temp-task`, JSON.stringify(newTask));

    renderTasks();
    taskInput.value = "";
  } else {
    mainErrorMessage.style.display = "block"; // Show error message
    taskInput.classList.add("shake"); // Add shake animation class
    setTimeout(() => {
      taskInput.classList.remove("shake"); // Remove shake animation class after animation is done
    }, 500);
  }
}

taskInput.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addTask();
  }
});

// Function to delete a task
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

// Function to edit a task
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
        editInput.style.display = "none"; // Hide the edit input
        renderTasks();
        errorLabel.style.display = "none"; // Hide error message
      }
    } else {
      editInput.style.display = "none"; // Hide the edit input
      errorLabel.style.display = "block"; // Show error message
      li.classList.add("shake"); // Add shake animation class
      setTimeout(() => {
        li.classList.remove("shake"); // Remove shake animation class after animation is done
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

// Event listeners
addTaskBtn.addEventListener("click", addTask);

// Load tasks from local storage on page load
loadTasksFromLocalStorage();
renderTasks();