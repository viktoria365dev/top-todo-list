import { Project } from "./project.js";
import { loadProjects, saveProjects } from "./storage.js";

// -- State -----------------------------------------------------------------
let projects = loadProjects();
let activeProjectId = null;
const ALL_TODOS_ID = "all";

// -- DOM References --------------------------------------------------------
const projForm = document.getElementById("project-form");
const projInput = document.getElementById("project-input");
const projList = document.getElementById("project-list");
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const currentTitle = document.getElementById("current-project-title");

// -- Helpers ---------------------------------------------------------------

// Find a project by its ID
function getProjectById(id) {
  return (
    projects.find(function (p) {
      return p.id === id;
    }) || null
  );
}

// Create the All Todos <li>
function createAllTodosItem() {
  const li = document.createElement("li");
  li.dataset.id = ALL_TODOS_ID;
  li.classList.toggle("selected", activeProjectId === ALL_TODOS_ID);
  li.innerHTML = `<span class="label">All Todos</span>`;

  return li;
}

// Create a project <li>
function createProjectItem(proj) {
  const li = document.createElement("li");
  li.dataset.id = proj.id;
  li.classList.toggle("selected", proj.id === activeProjectId);
  li.innerHTML = `
    <span class="label">${proj.title}</span>
    <button class="button-small delete-proj">✕</button>
  `;

  return li;
}

// Create a todo <li>, optionally prefixed with its project
function createTodoItem(todo, project) {
  const li = document.createElement("li");
  li.dataset.id = todo.id;

  if (project) {
    li.dataset.projectId = project.id;
  }

  li.classList.toggle("completed", todo.done);

  const prefix = project ? `[${project.title}] ` : "";
  li.innerHTML = `
    <span class="label">${prefix}${todo.text}</span>
    <div>
      <button class="button-small toggle-todo">
        ${todo.done ? "↺" : "✓"}
      </button>
      <button class="button-small delete-todo">✕</button>
    </div>
  `;

  return li;
}

// Save state and re-render both lists
function persistAndRender() {
  saveProjects(projects);
  renderProjects();
  renderTodos();
}

// -- Rendering -------------------------------------------------------------

function renderProjects() {
  projList.innerHTML = "";
  projList.appendChild(createAllTodosItem());

  projects.forEach((proj) => {
    projList.appendChild(createProjectItem(proj));
  });
}

function renderTodos() {
  if (activeProjectId === ALL_TODOS_ID) {
    renderAllTodos();
  } else {
    const project = getProjectById(activeProjectId);
    project ? renderProjectTodos(project) : hideTodoSection();
  }
}

function renderAllTodos() {
  currentTitle.textContent = "All Todos";
  todoForm.classList.add("hidden");
  todoList.innerHTML = "";

  projects.forEach((project) => {
    project.todos.forEach((todo) => {
      todoList.appendChild(createTodoItem(todo, project));
    });
  });
}

function renderProjectTodos(project) {
  currentTitle.textContent = project.title;
  todoForm.classList.remove("hidden");
  todoList.innerHTML = "";

  project.todos.forEach((todo) => {
    todoList.appendChild(createTodoItem(todo));
  });
}

function hideTodoSection() {
  currentTitle.textContent = "Create a project";
  todoForm.classList.add("hidden");
  todoList.innerHTML = "";
}

// -- Event Handlers -------------------------------------------------------

// Add a new project
projForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const title = projInput.value.trim();

  if (!title) {
    return;
  }

  projects.push(new Project(title));
  projInput.value = "";

  persistAndRender();
});

// Select or delete a project
projList.addEventListener("click", function (e) {
  const li = e.target.closest("li");

  if (!li) {
    return;
  }

  const id = li.dataset.id;

  if (e.target.matches(".delete-proj") && id !== ALL_TODOS_ID) {
    projects = projects.filter(function (p) {
      return String(p.id) !== id;
    });

    if (activeProjectId === Number(id)) {
      activeProjectId = ALL_TODOS_ID;
    }
  } else if (!e.target.matches("button")) {
    activeProjectId = id === ALL_TODOS_ID ? ALL_TODOS_ID : Number(id);
  }

  persistAndRender();
});

// Add a new todo
todoForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const text = todoInput.value.trim();

  if (!text) {
    return;
  }

  const project = getProjectById(activeProjectId);
  project.addTodo(text);
  todoInput.value = "";

  persistAndRender();
});

// Toggle or delete a todo
todoList.addEventListener("click", function (e) {
  const li = e.target.closest("li");

  if (!li) {
    return;
  }

  const todoId = Number(li.dataset.id);

  let project;
  if (activeProjectId === ALL_TODOS_ID) {
    project = getProjectById(Number(li.dataset.projectId));
  } else {
    project = getProjectById(activeProjectId);
  }

  if (!project) {
    return;
  }

  if (e.target.matches(".toggle-todo")) {
    project.toggleTodo(todoId);
  } else if (e.target.matches(".delete-todo")) {
    project.removeTodo(todoId);
  }

  persistAndRender();
});

// -- Initialization -------------------------------------------------------

function init() {
  renderProjects();

  if (projects.length > 0) {
    activeProjectId = ALL_TODOS_ID;
    renderTodos();
  } else {
    hideTodoSection();
  }
}

init();
