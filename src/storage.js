import { Project } from "./project.js";
import { Todo } from "./todo.js";

const STORAGE_KEY = "top-todo-projects";

export function loadProjects() {
  const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

  return raw.map(({ title, id, todos }) => {
    const project = new Project(title, id);
    project.todos = todos.map(
      ({ text, done, id: todoId }) => new Todo(text, done, todoId)
    );
    return project;
  });
}

export function saveProjects(projects) {
  const projectsToSave = projects.map(({ title, id, todos }) => ({
    title,
    id,
    todos: todos.map(({ text, done, id: todoId }) => ({
      text,
      done,
      id: todoId,
    })),
  }));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(projectsToSave));
}
