export class Todo {
  constructor(text, done = false, id = Date.now()) {
    this.text = text;
    this.done = done;
    this.id = id;
  }

  toggleDone() {
    this.done = !this.done;
  }
}
