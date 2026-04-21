// ----------------------------- TO-DO LIST LOGIC -----------------------------
let todos = [];

// DOM elements
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addTaskBtn");
const deleteAllBtn = document.getElementById("deleteAllBtn");
const todoContainer = document.getElementById("todoListContainer");

// Load from localStorage
function loadTodos() {
  const stored = localStorage.getItem("phase1_todos");
  if (stored) {
    todos = JSON.parse(stored);
  } else {
    todos = [];
  }
  renderTodoList();
}

// Save to localStorage
function saveTodos() {
  localStorage.setItem("phase1_todos", JSON.stringify(todos));
}

// Render list
function renderTodoList() {
  if (!todoContainer) return;
  if (todos.length === 0) {
    todoContainer.innerHTML =
      '<div class="empty-msg">✨ No tasks yet. Add one above!</div>';
    return;
  }

  todoContainer.innerHTML = "";
  todos.forEach((todo, index) => {
    const li = document.createElement("li");
    li.className = "todo-item";

    const textSpan = document.createElement("span");
    textSpan.className = `todo-text ${todo.completed ? "completed" : ""}`;
    textSpan.innerText = todo.text;
    // Toggle complete on click
    textSpan.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleComplete(index);
    });
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "todo-actions";

    const editBtn = document.createElement("button");
    editBtn.innerHTML = "✏️";
    editBtn.className = "edit-btn";
    editBtn.title = "Edit task";
    editBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      editTask(index);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "❌";
    deleteBtn.className = "delete-btn";
    deleteBtn.title = "Delete task";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteTask(index);
    });
    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);
    li.appendChild(textSpan);
    li.appendChild(actionsDiv);
    todoContainer.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  if (text === "") {
    alert("Please enter a task.");
    return;
  }
  todos.push({ text: text, completed: false });
  saveTodos();
  renderTodoList();
  taskInput.value = "";
  taskInput.focus();
}
function deleteTask(index) {
  todos.splice(index, 1);
  saveTodos();
  renderTodoList();
}

function toggleComplete(index) {
  todos[index].completed = !todos[index].completed;
  saveTodos();
  renderTodoList();
}

function editTask(index) {
  const newText = prompt("Edit your task:", todos[index].text);
  if (newText !== null && newText.trim() !== "") {
    todos[index].text = newText.trim();
    saveTodos();
    renderTodoList();
  }
}
function deleteAllTasks() {
  if (todos.length > 0 && confirm("Delete all tasks permanently?")) {
    todos = [];
    saveTodos();
    renderTodoList();
  }
}

// Event listeners for To-Do
addBtn.addEventListener("click", addTask);
deleteAllBtn.addEventListener("click", deleteAllTasks);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});
// ----------------------------- CALCULATOR LOGIC -----------------------------
let currentInput = "0";
let previousInput = null;
let operation = null;
let shouldResetDisplay = false;

const calcDisplay = document.getElementById("calcDisplay");

function updateDisplay() {
  if (calcDisplay) {
    // limit length for UI comfort
    let displayValue = currentInput;
    if (displayValue.length > 18)
      displayValue = parseFloat(displayValue).toExponential(10);
    calcDisplay.innerText = displayValue;
  }
}
function inputDigit(digit) {
  if (shouldResetDisplay) {
    currentInput = digit;
    shouldResetDisplay = false;
  } else {
    // avoid multiple leading zeros
    if (currentInput === "0" && digit === "0") return;
    if (currentInput === "0" && digit !== ".") {
      currentInput = digit;
    } else {
      currentInput += digit;
    }
  }
  updateDisplay();
}
function inputDecimal() {
  if (shouldResetDisplay) {
    currentInput = "0.";
    shouldResetDisplay = false;
    updateDisplay();
    return;
  }
  if (!currentInput.includes(".")) {
    currentInput += ".";
  }
  updateDisplay();
}

function clearAll() {
  currentInput = "0";
  previousInput = null;
  operation = null;
  shouldResetDisplay = false;
  updateDisplay();
}
function backspace() {
  if (shouldResetDisplay) return;
  if (
    currentInput.length === 1 ||
    (currentInput.length === 2 && currentInput.startsWith("-"))
  ) {
    currentInput = "0";
  } else {
    currentInput = currentInput.slice(0, -1);
    if (currentInput === "" || currentInput === "-") currentInput = "0";
  }
  updateDisplay();
}

function performOperation(op) {
  if (operation !== null && !shouldResetDisplay) {
    calculate();
  }
  previousInput = parseFloat(currentInput);
  operation = op;
  shouldResetDisplay = true;
}
function calculate() {
  if (operation === null || previousInput === null || shouldResetDisplay)
    return;
  let result;
  const curr = parseFloat(currentInput);
  const prev = previousInput;

  switch (operation) {
    case "+":
      result = prev + curr;
      break;
    case "-":
      result = prev - curr;
      break;
    case "*":
      result = prev * curr;
      break;
    case "/":
      if (curr === 0) {
        alert("Cannot divide by zero");
        clearAll();
        return;
      }
      result = prev / curr;
      break;
    default:
      return;
  }
  // handle floating precision
  result = parseFloat(result.toFixed(8));
  currentInput = result.toString();
  operation = null;
  previousInput = null;
  shouldResetDisplay = true;
  updateDisplay();
}
// build calculator buttons dynamically
function buildCalcButtons() {
  const container = document.getElementById("calcButtons");
  if (!container) return;
  const buttons = [
    { label: "C", type: "clear", action: () => clearAll() },
    { label: "⌫", type: "back", action: () => backspace() },
    { label: "/", type: "operator", action: () => performOperation("/") },
    { label: "7", type: "digit", action: () => inputDigit("7") },
    { label: "8", type: "digit", action: () => inputDigit("8") },
    { label: "9", type: "digit", action: () => inputDigit("9") },
    { label: "*", type: "operator", action: () => performOperation("*") },
    { label: "4", type: "digit", action: () => inputDigit("4") },
    { label: "5", type: "digit", action: () => inputDigit("5") },
    { label: "6", type: "digit", action: () => inputDigit("6") },
    { label: "-", type: "operator", action: () => performOperation("-") },
    { label: "1", type: "digit", action: () => inputDigit("1") },
    { label: "2", type: "digit", action: () => inputDigit("2") },
    { label: "3", type: "digit", action: () => inputDigit("3") },
    { label: "+", type: "operator", action: () => performOperation("+") },
    { label: "0", type: "zero", action: () => inputDigit("0") },
    { label: ".", type: "decimal", action: () => inputDecimal() },
    { label: "=", type: "equals", action: () => calculate() },
  ];
  container.innerHTML = "";
  buttons.forEach((btn) => {
    const buttonEl = document.createElement("button");
    buttonEl.innerText = btn.label;
    buttonEl.classList.add("calc-btn");
    if (btn.type === "operator") buttonEl.classList.add("operator");
    if (btn.type === "equals") buttonEl.classList.add("equals");
    if (btn.type === "clear") buttonEl.classList.add("clear");
    if (btn.type === "zero") buttonEl.classList.add("zero");
    buttonEl.addEventListener("click", (e) => {
      e.stopPropagation();
      btn.action();
    });
    container.appendChild(buttonEl);
  });
}
// KEYBOARD SUPPORT for calculator
function handleKeyboard(e) {
  const key = e.key;
  // prevent default if needed (avoid page scrolling with arrows etc)
  if (
    [
      "+",
      "-",
      "*",
      "/",
      "Enter",
      "Backspace",
      "Escape",
      ".",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
    ].includes(key)
  ) {
    e.preventDefault();
  }
  if (/[0-9]/.test(key)) {
    inputDigit(key);
  } else if (key === ".") {
    inputDecimal();
  } else if (key === "+" || key === "-" || key === "*" || key === "/") {
    if (key === "*") performOperation("*");
    else if (key === "/") performOperation("/");
    else if (key === "+") performOperation("+");
    else if (key === "-") performOperation("-");
  } else if (key === "Enter" || key === "=") {
    calculate();
  } else if (key === "Backspace") {
    backspace();
  } else if (key === "Escape") {
    clearAll();
  }
}
// ----------------------------- INITIALIZE -----------------------------
function init() {
  loadTodos(); // load from localStorage and render
  buildCalcButtons();
  updateDisplay();
  window.addEventListener("keydown", handleKeyboard);
}

init();
