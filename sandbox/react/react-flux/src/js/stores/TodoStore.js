import { EventEmitter } from "events"

import dispatcher from '../dispatcher'

class TodoStore extends EventEmitter {
  constructor() {
    super()
    this.todos = [
      {
        id: 113464613,
        text: "Go Shopping",
        complete: false
      },
      {
        id: 235684679,
        text: "Pay Bill",
        complete: false
      },
    ]
  }

  createTodo(text) {
    const id = Date.now();

    this.todos.push({
      id,
      text,
      complete: false
    })

    this.emit('change')
  }

  getAll() {
    return this.todos
  }

  handleAction(action) {
    switch (action.type) {
      case 'CREATE_TODO':
        this.createTodo(action.text)
        break;
      case 'FETCH_TODO_COMPLETE':
        this.todos.push(...action.todos)
        this.emit('change')
        break;
      default:

    }
  }
}

const todoStore = new TodoStore
dispatcher.register(todoStore.handleAction.bind(todoStore))

export default todoStore;
