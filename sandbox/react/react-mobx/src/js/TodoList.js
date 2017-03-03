import React from 'react';
import { observer } from 'mobx-react'

@observer
export default class TodoList extends React.Component {
    createTodo(e) {
      if (e.which === 13) {
        this.props.store.createTodo(e.target.value)
        e.target.value = ""
      }
    }

    filter(e) {
      this.props.store.changeFilter(e.target.value)
    }

    toggleCompleted(todo) {
      todo.toggleCompleted();
    }

    render() {
        const { filteredTodos, todos, filter, clearCompleted } = this.props.store

        const todoList = filteredTodos.map(todo => <li key={todo.id}>
          <input type="checkbox" value={todo.completed} checked={todo.completed} onChange={this.toggleCompleted.bind(this, todo)}/>{todo.text}
          </li>);

        return <div>
        <h1>todos</h1>
        <input className="create" onKeyPress={this.createTodo.bind(this)} />
        <input className="filter" value={filter} onChange={this.filter.bind(this)}/>
        <ul>{todoList}</ul>
        <button className="btn btn-danger" onClick={clearCompleted} >Clear</button>
        < /div>;
    }
}
