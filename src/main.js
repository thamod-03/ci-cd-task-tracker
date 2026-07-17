import "./style.css";

import {
  createTask,
  deleteTask,
  filterTasks,
  isValidTask,
  toggleTask,
} from "./taskService.js";

const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const errorMessage = document.querySelector("#error-message");
const emptyMessage = document.querySelector("#empty-message");

const taskCount = document.querySelector("#task-count");
const completedCount = document.querySelector("#completed-count");
const filterButtons = document.querySelectorAll(".filter-button");

let tasks = loadTasks();
let currentFilter = "all";

function loadTasks() {
  try {
    const storedTasks = localStorage.getItem("tasks");

    return storedTasks ? JSON.parse(storedTasks) : [];
  } catch (error) {
    console.error("Could not load tasks:", error);
    return [];
  }
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  const visibleTasks = filterTasks(tasks, currentFilter);

  visibleTasks.forEach((task) => {
    const listItem = document.createElement("li");
    listItem.className = task.completed ? "task-item completed" : "task-item";

    const taskInformation = document.createElement("div");
    taskInformation.className = "task-information";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark ${task.text} as completed`);

    checkbox.addEventListener("change", () => {
      tasks = toggleTask(tasks, task.id);
      saveTasks();
      renderTasks();
    });

    const taskText = document.createElement("span");
    taskText.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
      tasks = deleteTask(tasks, task.id);
      saveTasks();
      renderTasks();
    });

    taskInformation.append(checkbox, taskText);
    listItem.append(taskInformation, deleteButton);
    taskList.appendChild(listItem);
  });

  updateSummary();
  updateEmptyMessage(visibleTasks);
}

function updateSummary() {
  const totalTasks = tasks.length;

  const totalCompleted = tasks.filter((task) => task.completed).length;

  taskCount.textContent = totalTasks === 1 ? "1 task" : `${totalTasks} tasks`;

  completedCount.textContent =
    totalCompleted === 1 ? "1 completed" : `${totalCompleted} completed`;
}

function updateEmptyMessage(visibleTasks) {
  if (visibleTasks.length > 0) {
    emptyMessage.hidden = true;
    return;
  }

  emptyMessage.hidden = false;

  if (currentFilter === "completed") {
    emptyMessage.textContent = "No completed tasks.";
  } else if (currentFilter === "pending") {
    emptyMessage.textContent = "No pending tasks.";
  } else {
    emptyMessage.textContent = "No tasks available. Add your first task.";
  }
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const taskText = taskInput.value;

  if (!isValidTask(taskText)) {
    errorMessage.textContent = "Please enter a task.";
    taskInput.focus();
    return;
  }

  try {
    const newTask = createTask(taskText);

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    errorMessage.textContent = "";
    taskInput.focus();
  } catch (error) {
    errorMessage.textContent = error.message;
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach((filterButton) => {
      filterButton.classList.remove("active");
    });

    button.classList.add("active");

    renderTasks();
  });
});

renderTasks();
