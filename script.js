// SELECT ELEMENTS
const form = document.getElementById("task-form");
const todoInput = document.getElementById("task-input");
const dueDateInput = document.getElementById("due-date-input");
const reminderInput = document.getElementById("reminder-input");
const categoryInput = document.getElementById("category-select");
const todosListEl = document.getElementById("task-list");
const defaultOrderButton = document.getElementById("default-order");
const dateAddedButton = document.getElementById("sort-date-added");
const sortDueDateButton = document.getElementById("sort-due-date");
const sortCompletedButton = document.getElementById("sort-completed");

// arrays
let todos = [];
let completedTodos = [];

// Load todos from local storage on page load
window.addEventListener("load", function () {
  const storedTodos = localStorage.getItem("todos");
  if (storedTodos) {
    todos = JSON.parse(storedTodos);
    renderTodos(todos);
  }
});
function saveToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function saveTodo() {
  const isEmpty =
    !todoInput.value.trim() ||
    !dueDateInput.value.trim() ||
    !reminderInput.value.trim() ||
    !categoryInput.value.trim();
  const isDuplicate = todos.some((todo) => todo.value.toUpperCase() === todoInput.value.toUpperCase());

  if (isEmpty) {
    alert("Please Complete all the fields");
  } else if (isDuplicate) {
    alert("Task already exists");
  } else {
    const now = new Date();
    const dueDate = new Date(dueDateInput.value);
    const reminderDate = new Date(reminderInput.value);

    if (dueDate < now) {
      alert("Please select a future due date");
      return;
    } else if (reminderDate < now || reminderDate > dueDate) {
      alert("Please select a valid reminder date");
      return;
    }
    const newTodo = {
      value: todoInput.value,
      checked: false,
      timeAdded: now,
      dueDate: dueDate,
      reminderDate: reminderDate,
      category: categoryInput.value,
    };
    todos.push(newTodo);
    form.reset();
    renderTodos(todos);
    saveToLocalStorage();
    setReminder(newTodo);
  }
}

//  Render the todos
function renderTodos(todosArray) {
  // clear elements before render
  todosListEl.innerHTML = "";

  todosArray.forEach((todo, index) => {
    const dueTime = new Date(todo.dueDate)
      .toLocaleString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
        hourCycle: "h23",
      })
      .replace(",", " ");
    todosListEl.innerHTML += `
    <li class="list-group-item d-flex justify-content-between align-items-center" id=${index}>
    <div class="d-flex justify-content-start align-items-center">
      <input class="form-check-input me-4" type="checkbox" ${todo.checked ? "checked" : ""}  />
      <span ${todo.checked ? 'class="text-decoration-line-through"' : ""}>${todo.value}</span>
      <span class="badge bg-primary align-middle ms-2">${todo.category}</span>
    </div>
    <div class="d-flex justify-content-end align-items-center">
       <span class="text-muted  mx-4">Due on ${dueTime}</span>
      <button class="btn btn-close "></button>
    </div>
  </li>
    `;
  });
}

// Event listener for all todos
todosListEl.addEventListener("click", (event) => {
  const target = event.target;
  const listItem = target.closest(".list-group-item");
  const todoId = Number(listItem.id);

  if (target.matches('input[type="checkbox"]')) {
    // Handle checkbox click
    todos[todoId].checked = target.checked;
    const todoSpan = listItem.querySelector("span");
    if (target.checked) {
      todoSpan.classList.add("text-decoration-line-through");
      saveToLocalStorage();
    } else {
      todoSpan.classList.remove("text-decoration-line-through");
      saveToLocalStorage();
    }
  } else if (target.matches("button")) {
    // Handle button click
    todos.splice(todoId, 1);
    listItem.remove();
    saveToLocalStorage();
    renderTodos(todos);
  }
});

// event listeners for all the buttons

form.addEventListener("submit", function (event) {
  event.preventDefault();
  saveTodo();
});

defaultOrderButton.addEventListener("click", function () {
  todos.sort((a, b) => new Date(a.timeAdded) - new Date(b.timeAdded));
  renderTodos(todos);
  saveToLocalStorage();
});

dateAddedButton.addEventListener("click", function () {
  todos.sort((a, b) => new Date(b.timeAdded) - new Date(a.timeAdded));
  renderTodos(todos);
  saveToLocalStorage();
});

sortDueDateButton.addEventListener("click", function () {
  todos.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  renderTodos(todos);
  saveToLocalStorage();
});

sortCompletedButton.addEventListener("click", function () {
  completedTodos = todos.filter((todo) => todo.checked);
  completedTodos.sort((a, b) => new Date(a.timeAdded) - new Date(b.timeAdded));
  renderTodos(completedTodos);
  saveToLocalStorage();
});

// add reminder alert functionality
function setReminder(todo) {
  const reminderDate = new Date(todo.reminderDate);
  const now = new Date();
  const dueDate = todo.dueDate.toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    hourCycle: "h23",
  });

  if (reminderDate > now) {
    const timeUntilReminder = reminderDate - now;
    setTimeout(() => {
      alert(`Reminder: ${todo.value} is due on ${dueDate}`);
    }, timeUntilReminder);
  }
}
