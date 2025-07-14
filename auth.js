// 🔐 Signup Function
function signUp() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || {};

  if (users[username]) {
    alert("Username already exists. Try logging in.");
    return;
  }

  users[username] = password;
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("loggedInUser", username); // Save active user

  window.location.href = "dashboard.html"; // Redirect
}

// 🔐 Login Function
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const users = JSON.parse(localStorage.getItem("users")) || {};

  if (users[username] && users[username] === password) {
    localStorage.setItem("loggedInUser", username); // Set active user
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid username or password.");
  }
}
