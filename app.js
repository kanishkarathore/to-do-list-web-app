const currentUser = localStorage.getItem("loggedInUser");
if (!currentUser) {
  window.location.href = "index.html"; // Redirect if not logged in
}

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let searchQuery = "";

// 🌗 Theme setup
const savedTheme = localStorage.getItem("theme") || "light";
if (savedTheme === "dark") document.body.classList.add("dark");

document.getElementById("themeToggle").innerText =
  savedTheme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode";

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  document.getElementById("themeToggle").innerText = isDark ? "🌞 Light Mode" : "🌙 Dark Mode";
});

// ➕ Add Task
function addTask() {
  const text = document.getElementById("taskText").value.trim();
  const dueDate = document.getElementById("taskDate").value;
  const priority = document.getElementById("taskPriority").value;

  if (!text || !dueDate) {
    alert("Please enter both task and date.");
    return;
  }

  tasks.push({
    id: Date.now(),
    text,
    dueDate,
    priority,
    completed: false,
    createdAt: new Date().toISOString()
  });

  document.getElementById("taskText").value = "";
  document.getElementById("taskDate").value = "";
  document.getElementById("taskPriority").value = "Low";
  updateStorage();
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  const filteredTasks = [...tasks]
    .filter(task => {
      const matchesFilter =
        currentFilter === "completed" ? task.completed :
        currentFilter === "pending" ? !task.completed :
        true;

      const matchesSearch = task.text.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = task.completed ? "done" : "";

    const daysLeft = getDaysLeft(task.dueDate);
    const countdownText = task.completed
      ? "✅ Completed"
      : daysLeft < 0
        ? `<span class="overdue">⛔ Overdue by ${Math.abs(daysLeft)} day(s)</span>`
        : `<span class="countdown">⏳ ${daysLeft} day(s) left</span>`;

    if (task.isEditing) {
      li.innerHTML = `
        <input type="text" id="editText${task.id}" value="${task.text}" />
        <input type="date" id="editDate${task.id}" value="${task.dueDate}" />
        <select id="editPriority${task.id}">
          <option value="Low" ${task.priority === "Low" ? "selected" : ""}>Low</option>
          <option value="Medium" ${task.priority === "Medium" ? "selected" : ""}>Medium</option>
          <option value="High" ${task.priority === "High" ? "selected" : ""}>High</option>
        </select>
        <button onclick="saveEdit(${task.id})">💾 Save</button>
        <button onclick="cancelEdit(${task.id})">❌ Cancel</button>
      `;
    } else {
      li.innerHTML = `
        <span>
          <strong>${task.text}</strong>
          <span class="priority ${task.priority}">${task.priority}</span><br/>
          <small>(Due: ${task.dueDate})</small><br/>
          ${countdownText}
        </span>
        ${
          !task.completed
            ? `<button onclick="toggleTask(${task.id})">✅</button>
               <button onclick="editTask(${task.id})">✏️</button>`
            : `<button onclick="deleteTask(${task.id})">🗑️</button>`
        }
      `;
    }

    taskList.appendChild(li);
  });
}

function getDaysLeft(dueDate) {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function findTaskIndex(id) {
  return tasks.findIndex(t => t.id === id);
}

function toggleTask(id) {
  const index = findTaskIndex(id);
  if (index !== -1) {
    tasks[index].completed = !tasks[index].completed;
    updateStorage();
  }
}

function deleteTask(id) {
  const index = findTaskIndex(id);
  if (index !== -1) {
    tasks.splice(index, 1);
    updateStorage();
  }
}

function editTask(id) {
  const index = findTaskIndex(id);
  if (index !== -1) {
    tasks[index].isEditing = true;
    renderTasks();
  }
}

function cancelEdit(id) {
  const index = findTaskIndex(id);
  if (index !== -1) {
    delete tasks[index].isEditing;
    renderTasks();
  }
}

function saveEdit(id) {
  const index = findTaskIndex(id);
  if (index !== -1) {
    const newText = document.getElementById(`editText${id}`).value.trim();
    const newDate = document.getElementById(`editDate${id}`).value;
    const newPriority = document.getElementById(`editPriority${id}`).value;

    if (!newText || !newDate) {
      alert("Fields cannot be empty.");
      return;
    }

    tasks[index].text = newText;
    tasks[index].dueDate = newDate;
    tasks[index].priority = newPriority;
    delete tasks[index].isEditing;
    updateStorage();
  }
}

function setFilter(filter) {
  currentFilter = filter;
  renderTasks();
}

document.getElementById("searchInput").addEventListener("input", e => {
  searchQuery = e.target.value.toLowerCase();
  renderTasks();
});

function updateStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

// 🚀 Initial render
renderTasks();
