import dispatcher from '../dispatcher'

export function createTodo(text) {
  dispatcher.dispatch({
    type: 'CREATE_TODO',
    text,
  })
}

export function deleteTodo(id) {
  dispatcher.dispatch({
    type: 'DELETE_TODO',
    id,
  })
}

export function reloadTodos() {
  dispatcher.dispatch({
    type: 'FETCH_TODO_PENDING'
  })

  setTimeout(() => {
    dispatcher.dispatch({
      type: 'FETCH_TODO_COMPLETE',
      todos: [
        {
          id: 123,
          text: "Go Shopping again",
          complete: false
        },
        {
          id: 456,
          text: "Kiss wife",
          complete: true
        },
      ]
    })

    if (false) {
      dispatcher.dispatch({
        type: 'FETCH_TODO_ERROR'
      })
    }
  }, 1000)
}
