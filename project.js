import { Todo } from "./todo.js";

export class Project {
  constructor(title, id = Date.now()) {
    this.title = title;
    this.id = id;
    this.todos = [];
  }

  addTodo(text) {
    const todo = new Todo(text);
    this.todos.push(todo);
    return todo;
  }

  removeTodo(todoId) {
    this.todos = this.todos.filter(function (t) {
      return t.id !== todoId;
    });
  }

  toggleTodo(todoId) {
    this.todos.forEach(function (t) {
      if (t.id === todoId) {
        t.toggleDone();
      }
    });
  }
}
