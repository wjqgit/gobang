import React from 'react';

import Todo from '../components/Todo'
import TodoStore from '../stores/TodoStore'
// import { createTodo } from '../actions/TodoActions'
import * as TodoActions from '../actions/TodoActions'

export default class Todos extends React.Component {
    constructor() {
      super()
      this.getTodos = this.getTodos.bind(this)
      this.state = {
        todos: TodoStore.getAll(),
        newTodoText: 'new todo',
      }
    }

    componentWillMount() {
      TodoStore.on('change', this.getTodos)

      // console.log('count: ', TodoStore.listenerCount('change'));
    }

    componentWillUnmount() {
      TodoStore.removeListener('change', this.getTodos)
    }

    getTodos() {
      this.setState({
        todos: TodoStore.getAll()
      })
    }

    createTodo() {
      // TodoActions.createTodo(this.state.newTodoText)
      createTodo(this.state.newTodoText)
    }

    reloadTodos() {
      TodoActions.reloadTodos()
    }

    handleChange(e) {
      const newTodoText = e.target.value;
      this.setState({
        newTodoText
      })
    }

    render() {
        const { todos } = this.state;

        const TodoComponents = todos.map((todo) => <Todo key={todo.id} {...todo} />)

        return <div>
          <button class="btn btn-success" onClick={this.reloadTodos.bind(this)} >Reload</button>
          <input value={this.state.newTodoText} onChange={this.handleChange.bind(this)}/>
          <button class="btn btn-primary" onClick={this.createTodo.bind(this)} >Create</button>
         <h1>Todos</h1>
         <ul>{TodoComponents}</ul>
        </div>;
    }
}
