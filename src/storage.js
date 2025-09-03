import { Project } from "./project.js";
import { Todo } from "./todo.js";

const KEY = "top-todo-projects";

export function loadProjects() {
  const saved = localStorage.getItem(KEY);
  let rawArray;

  if (saved === null) {
    rawArray = [];
  } else {
    rawArray = JSON.parse(saved);
  }

  const projects = [];
  for (let i = 0; i < rawArray.length; i++) {
    const p = rawArray[i];
    const proj = new Project(p.title, p.id);
    proj.todos = [];

    for (let j = 0; j < p.todos.length; j++) {
      const t = p.todos[j];
      const todo = new Todo(t.text, t.done, t.id);
      proj.todos.push(todo);
    }

    projects.push(proj);
  }

  return projects;
}

export function saveProjects(projects) {
  const dataToSave = [];

  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    const rawProject = {
      title: p.title,
      id: p.id,
      todos: [],
    };

    for (let j = 0; j < p.todos.length; j++) {
      const t = p.todos[j];
      rawProject.todos.push({
        text: t.text,
        done: t.done,
        id: t.id,
      });
    }

    dataToSave.push(rawProject);
  }

  const jsonString = JSON.stringify(dataToSave);
  localStorage.setItem(KEY, jsonString);
}

/*

export function loadProjects() {
  const saved = JSON.parse(localStorage.getItem(KEY) || "[]");
  return saved.map((p) => {
    const proj = new Project(p.title, p.id);
    proj.todos = p.todos.map((t) => new Todo(t.text, t.done, t.id));
    return proj;
  });
}

export function saveProjects(projects) {
  const data = projects.map((p) => ({
    title: p.title,
    id: p.id,
    todos: p.todos.map((t) => ({
      text: t.text,
      done: t.done,
      id: t.id,
    })),
  }));
  localStorage.setItem(KEY, JSON.stringify(data));
}

*/
