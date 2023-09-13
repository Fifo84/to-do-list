var taskInput = document.getElementById("taskInput");
var regularTaskBtn = document.getElementById("regularTaskBtn");
var importantTaskBtn = document.getElementById("importantTaskBtn");
var addTaskBtn = document.getElementById("addTaskBtn");
var taskList = document.getElementById("taskList");
var deleteAllBtnContainer = document.getElementById("deleteAllBtnContainer");
var isImportantTask = false;

regularTaskBtn.addEventListener("click", setRegularTaskOption);
importantTaskBtn.addEventListener("click", setImportantTaskOption);

function setRegularTaskOption() {
  isImportantTask = false;
  regularTaskBtn.classList.add("active");
  importantTaskBtn.classList.remove("active");
}
function setImportantTaskOption() {
  isImportantTask = true;
  importantTaskBtn.classList.add("active");
  regularTaskBtn.classList.remove("active");
}

var tasks = [];

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach(function (task) {
    var li = document.createElement("li");
    li.innerHTML = "\n    <div>"
      .concat(
        task.name,
        '</div>\n<div class="task-actions">\n<input type="text" class="edit-input" value="'
      )
      .concat(task.name, '">\n<div class="task-created-time">')
      .concat(task.createdDate, '</div>\n<span class="edit-btn" data-id="')
      .concat(task.id, '">&#9998;</span>\n<span class="delete-btn" data-id="')
      .concat(
        task.id,
        '">&#10006;</span>\n</div>\n<p class="error-label">Can\'t edit with an empty name.</p> '
      );
    if (task.important) {
      li.classList.add("important-task");
    }
    taskList.appendChild(li);
  });
  var editButtons = document.querySelectorAll(".edit-btn");
  editButtons.forEach(function (button) {
    button.addEventListener("click", editTask);
  });
  var deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach(function (button) {
    button.addEventListener("click", deleteTask);
  });
  renderDeleteAllButton();
}

function updateLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  console.log("Saved to Local Storage:", tasks);
}

function loadTasksFromLocalStorage() {
  var savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }
  if (!isImportantTask) {
    setRegularTaskOption();
  }
  renderTasks();
}
var mainErrorMessage = document.getElementById("mainErrorMessage");
// Function to add a new task
function addTask() {
  var taskName = taskInput.value.trim();
  if (taskName !== "") {
    mainErrorMessage.style.display = "none";
    var currentDate = new Date();
    var formattedDate = currentDate.toLocaleDateString("en-GB");
    var newTask = {
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
    setTimeout(function () {
      taskInput.classList.remove("shake");
    }, 500);
  }
}

taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addTask();
  }
});

function deleteTask(event) {
  var target = event.target;
  var taskId = parseInt(target.getAttribute("data-id"));
  tasks = tasks.filter(function (task) {
    return task.id !== taskId;
  });
  renderTasks();
}

function saveAllTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  alert("All tasks saved to local storage.");
}

function editTask(event) {
  var target = event.target;
  var li = target.parentElement.parentElement;
  var editInput = li.querySelector(".edit-input");
  var errorLabel = li.querySelector(".error-label");
  editInput.style.display = "block";
  editInput.focus();
  editInput.addEventListener("blur", function () {
    var updatedName = editInput.value.trim();
    if (updatedName !== "") {
      var taskId_1 = parseInt(target.getAttribute("data-id"));
      var taskToUpdate = tasks.find(function (task) {
        return task.id === taskId_1;
      });
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
      setTimeout(function () {
        li.classList.remove("shake");
        ne;
      }, 500);
    }
  });
}

function renderDeleteAllButton() {
  deleteAllBtnContainer.innerHTML =
    tasks.length > 0
      ? '<button id="deleteAllBtn" class="allBtn delete-all-btn">Delete All Tasks</button> <button id="saveAllBtn" class="allBtn save-all-btn">Save All Tasks</button>'
      : "";
  var deleteAllBtn = document.getElementById("deleteAllBtn");
  if (deleteAllBtn) {
    deleteAllBtn.addEventListener("click", deleteAllTasks);
  }
  var saveAllTasksBtn = document.getElementById("saveAllBtn");
  if (saveAllTasksBtn) {
    saveAllTasksBtn.addEventListener("click", saveAllTasksToLocalStorage);
  }
}

function deleteAllTasks() {
  if (confirm("Are you sure you want to delete all tasks?")) {
    tasks = [];
    updateLocalStorage();
    renderTasks();
  }
}

addTaskBtn.addEventListener("click", addTask);
loadTasksFromLocalStorage();
renderTasks();
