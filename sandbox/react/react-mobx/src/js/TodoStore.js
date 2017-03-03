import { autorun, computed, observable } from 'mobx'

class Todo {
  @observable id
  @observable text
  @observable completed

  constructor(text) {
    this.id = Date.now()
    this.text = text
    this.completed = false
  }

  toggleCompleted() {
    this.completed = !this.completed
  }
}


class TodoStore {
  @observable todos = [];
  @observable filter = "";
  @computed get filteredTodos() {
    const matchesFilter = new RegExp(this.filter, 'i')
    return this.todos.filter(todo => !this.filter || matchesFilter.test(todo.text))
  }

  createTodo(text) {
    this.todos.push(new Todo(text))
  }

  changeFilter(value) {
    this.filter = value
  }

  // toggleCompleted(todo) {
  //   todo.completed = !todo.completed
  // }

  clearCompleted = () => {
    const incompletedTodos = this.todos.filter(todo => !todo.completed)
    this.todos.replace(incompletedTodos)
  }

}

const store = window.store = new TodoStore

export default store

// autorun(() => {
//   console.log(store.todos[0]);
//   console.log(store.filter);
// })
