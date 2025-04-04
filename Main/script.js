// Function to toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode"); // Toggle dark mode class

    // Save user preference in localStorage
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        document.getElementById("themeToggle").textContent = "☀️ Light Mode";
    } else {
        localStorage.setItem("theme", "light");
        document.getElementById("themeToggle").textContent = "🌙 Dark Mode";
    }
}

// Attach click event to theme toggle button
document.getElementById("themeToggle").addEventListener("click", toggleDarkMode);

// Function to start voice input
function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Your browser does not support speech recognition. Please use Chrome.");
        return;
    }

    let recognition = new webkitSpeechRecognition();
    recognition.lang = "en-US"; // Set language to English
    recognition.start();

    recognition.onresult = function (event) {
        let transcript = event.results[0][0].transcript; // Get spoken text
        document.getElementById("taskInput").value = transcript; // Insert into input field
    };

    recognition.onerror = function () {
        alert("Voice input failed. Please try again.");
    };
}

// Function to get AI Task Suggestions
function getAISuggestions() {
    let pastTasks = JSON.parse(localStorage.getItem("taskHistory")) || [];
    
    if (pastTasks.length === 0) {
        alert("No AI suggestions available yet. Add more tasks to get smart suggestions!");
        return;
    }

    // Find the most frequently added task
    let taskCounts = {};
    pastTasks.forEach(task => taskCounts[task] = (taskCounts[task] || 0) + 1);

    let suggestedTask = Object.keys(taskCounts).reduce((a, b) => taskCounts[a] > taskCounts[b] ? a : b);

    alert(`🤖 AI Suggestion: How about adding "${suggestedTask}" again?`);
}

// Function to save tasks for AI learning
function saveTaskForAI(task) {
    let pastTasks = JSON.parse(localStorage.getItem("taskHistory")) || [];
    pastTasks.push(task);
    localStorage.setItem("taskHistory", JSON.stringify(pastTasks));
}

function addTask() {
    let title = document.getElementById("taskInput").value.trim();
    let description = document.getElementById("taskDescription").value.trim();
    let priority = document.getElementById("taskPriority").value;
    let category = document.getElementById("filterCategory").value;
    let repeat = document.getElementById("taskRepeat").value;

    if (title === "") {
      alert("Task title cannot be empty! 🚫");
      return;
    }

    let task = {
      title: title,
      description: description,
      priority: priority,
      category: category,
      repeat: repeat,
      completed: false
    };

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    displayTasks();

    document.getElementById("taskInput").value = "";
    document.getElementById("taskDescription").value = "";
  }

  function displayTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let selectedCategory = document.getElementById("filterCategory").value;
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
      if (selectedCategory === "All" || task.category === selectedCategory) {
        let li = document.createElement("li");
        li.className = task.completed ? "completed" : "";

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.onclick = function () {
          task.completed = checkbox.checked;
          localStorage.setItem("tasks", JSON.stringify(tasks));
          displayTasks();
          updateProgressBar();
        };

        let content = `
          <strong>${task.title}</strong>
          <br><em>${task.description}</em>
          <br><span class="priority">Priority: ${task.priority}</span>
          | Category: ${task.category}
          | 🔁 ${task.repeat}
        `;

        li.innerHTML = content;
        li.prepend(checkbox);

        let removeBtn = document.createElement("button");
        removeBtn.textContent = "❌";
        removeBtn.onclick = function () {
          tasks.splice(index, 1);
          localStorage.setItem("tasks", JSON.stringify(tasks));
          displayTasks();
          updateProgressBar();
        };

        li.appendChild(removeBtn);
        taskList.appendChild(li);
      }
    });

    updateProgressBar();
  }

  function updateProgressBar() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let total = tasks.length;
    let completed = tasks.filter(t => t.completed).length;
    let percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    document.getElementById("progressPercent").textContent = `${percent}%`;
    document.getElementById("progressFill").style.width = `${percent}%`;
  }

  // Function to add a task with a countdown timer
function addTask() {
    let taskInput = document.getElementById("taskInput").value.trim();
    let taskDeadline = document.getElementById("taskDeadline").value;
    
    if (taskInput === "") {
        alert("Task cannot be empty! 🚫");
        return;
    }

    let taskList = document.getElementById("taskList");

    let li = document.createElement("li");
    li.innerHTML = `${taskInput} - <span class="deadline">Due: ${taskDeadline}</span>`;

    // Timer element
    let countdown = document.createElement("span");
    countdown.className = "countdown";
    li.appendChild(countdown);

    // Add remove button
    let removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";
    removeBtn.onclick = function () {
        li.remove();
        updateTaskCount();
        updateProgressBar();
        saveTasksToLocalStorage();
    };

    li.appendChild(removeBtn);
    taskList.appendChild(li);

    // Start countdown
    startCountdown(taskDeadline, countdown);

    document.getElementById("taskInput").value = "";
    saveTasksToLocalStorage();
    updateTaskCount();
    updateProgressBar();
}

// Window Load - Initialize Application
window.onload = function () {
    loadTheme();
    loadUserName();
    displayTasks();
    updateProgressBar();
};

// Load Theme
function loadTheme() {
    let savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        document.getElementById("themeToggle").textContent = "☀️ Light Mode";
    }
}

// Toggle Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    document.getElementById("themeToggle").textContent = document.body.classList.contains("dark-mode") ? "☀️ Light Mode" : "🌙 Dark Mode";
}

document.getElementById("themeToggle").addEventListener("click", toggleDarkMode);

// Load User Name
function loadUserName() {
    let savedName = localStorage.getItem("userName");
    if (savedName) {
        document.getElementById("greetingMessage").textContent = `Hello, ${savedName}! 👋`;
        document.getElementById("userNameInput").value = savedName;
    }
}

// Save User Name
function saveUserName() {
    let name = document.getElementById("userNameInput").value.trim();
    if (name) {
        localStorage.setItem("userName", name);
        document.getElementById("greetingMessage").textContent = `Hello, ${name}! 👋`;
    }
}

// Add a Task
function addTask() {
    let title = document.getElementById("taskInput").value.trim();
    let description = document.getElementById("taskDescription").value.trim();
    let priority = document.getElementById("taskPriority").value;
    let category = document.getElementById("filterCategory").value;
    let repeat = document.getElementById("taskRepeat").value;
    let deadline = document.getElementById("taskDeadline").value;

    if (title === "") {
        alert("Task title cannot be empty! 🚫");
        return;
    }

    let task = { title, description, priority, category, repeat, deadline, completed: false };
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    displayTasks();
    document.getElementById("taskInput").value = "";
    document.getElementById("taskDescription").value = "";
}

// Display Tasks and Update Pending Count
function displayTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let selectedCategory = document.getElementById("filterCategory").value;
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    let pendingCount = 0;

    tasks.forEach((task, index) => {
        if (selectedCategory === "All" || task.category === selectedCategory) {
            let li = createTaskElement(task, index, tasks);
            taskList.appendChild(li);
            if (!task.completed) pendingCount++; 
        }
    });

    updatePendingTasks(pendingCount);
    updateProgressBar();
}

// Create Task Element
function createTaskElement(task, index, tasks) {
    let li = document.createElement("li");
    li.setAttribute("data-index", index);
    li.className = task.completed ? "completed" : "";

    let checkbox = createCheckbox(task, tasks);
    let removeBtn = createRemoveButton(index, tasks);
    let countdownSpan = document.createElement("span");

    let content = `<strong>${task.title}</strong><br><em>${task.description}</em><br>
                   <span class='priority'>Priority: ${task.priority}</span> | Category: ${task.category} | 🔁 ${task.repeat}`;
    
    li.innerHTML = content;
    li.prepend(checkbox);
    li.appendChild(removeBtn);
    li.appendChild(countdownSpan);

    if (task.deadline) {
        startCountdown(task.deadline, countdownSpan);
    }

    return li;
}

// Countdown Timer for Tasks
function startCountdown(deadline, element) {
    let taskTime = new Date(deadline).getTime();
    if (isNaN(taskTime)) {
        element.innerHTML = "❌ Invalid Deadline!";
        element.style.color = "red";
        return;
    }

    function updateTimer() {
        let now = new Date().getTime();
        let timeLeft = taskTime - now;

        if (timeLeft <= 0) {
            element.innerHTML = "⏳ Time Over!";
            element.style.color = "red";
            clearInterval(element.dataset.timer);
            delete element.dataset.timer;
            alert("Task Deadline Passed! ⏳");
        } else {
            let days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            let hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
            let minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
            let seconds = Math.floor((timeLeft / 1000) % 60);

            element.innerHTML = days > 0 
                ? `⏳ ${days}d ${hours}h ${minutes}m ${seconds}s` 
                : `⏳ ${hours}h ${minutes}m ${seconds}s`;
        }
    }

    if (element.dataset.timer) clearInterval(element.dataset.timer);
    updateTimer();
    element.dataset.timer = setInterval(updateTimer, 1000);
}

// Additional Utility Functions (Checkbox, Remove Button, etc.)
function createCheckbox(task, tasks) {
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.onclick = function () {
        task.completed = checkbox.checked;
        saveTasks(tasks);
        displayTasks();
    };
    return checkbox;
}

function createRemoveButton(index, tasks) {
    let removeBtn = document.createElement("button");
    removeBtn.textContent = "DELETE";
    removeBtn.onclick = function () {
        tasks.splice(index, 1);
        saveTasks(tasks);
        displayTasks();
    };
    return removeBtn;
}

function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updatePendingTasks(count) {
    document.getElementById("taskCounter").textContent = `📌 Pending Tasks: ${count}`;
}

function updateProgressBar() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let completed = tasks.filter(task => task.completed).length;
    let total = tasks.length;
    let percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    document.getElementById("progressPercent").textContent = `${percent}%`;
    document.getElementById("progressFill").style.width = `${percent}%`;
}