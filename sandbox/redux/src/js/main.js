import { applyMiddleware, combineReducers, createStore } from 'redux'
import axios from 'axios'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import promise from 'redux-promise-middleware'

const userReducer = (state={}, action) => {
  switch (action.type) {
    case 'CHANGE_NAME':
      return { ...state, name: action.payload }
      break;
    case 'CHANGE_AGE':
      return { ...state, age: action.payload }
      break;
    case 'ERR':
      throw new Error('error message')
      break;
    default:
      return state
  }
}

const tweetsReducer = (state=[], action) => {
  return state
}

const initialState = {
  fetching: false,
  fetched: false,
  users: [],
  error: null
}

const usersReducer = (state=initialState, action) => {
  switch (action.type) {
    case 'FETCH_USERS_PENDING':
      return { ...state, fetching: true }
      break;
    case 'FETCH_USERS_REJECTED':
      return { ...state, fetching: false, error: action.payload }
      break;
    case 'FETCH_USERS_FULFILLED':
      return { ...state, fetching: false, fetched: true, users: action.payload }
      break;
    default:

  }
  return state
}

const reducers = combineReducers({
  user: userReducer,
  tweets: tweetsReducer,
  users: usersReducer
})

// const logger = (store) => (next) => (action) => {
//   console.log('action fired', action);
//   // action.type = "E"
//   if (action.type === "CHANGE_NAME") action.payload = 'marley'
//   next(action);
// }

const error = (store) => (next) => (action) => {
  try {
    next(action)
  } catch(e) {
    console.log('!!!', e)
  }
}

// const middleware = applyMiddleware(logger, error)
const middleware = applyMiddleware(promise(), thunk, logger())

const store = createStore(reducers, middleware);

// store.subscribe(() => console.log('store changed', store.getState()))

// store.dispatch({type: 'CHANGE_NAME', payload: "Mia"})
// store.dispatch({type: 'CHANGE_AGE', payload: 5})
// store.dispatch({type: 'CHANGE_AGE', payload: 6})
// store.dispatch({type: 'ERR', payload: 6})

// store.dispatch((dispatch) => {
//   dispatch({type: 'FETCH_USERS_PENDING'})
//   axios.get('http://rest.learncode.academy/api/wstern/users')
//     .then((res) => { dispatch({type: 'FETCH_USERS_FULFILLED', payload: res.data})})
//     .catch((err) => { dispatch({type: 'FETCH_USERS_REJECTED', payload: err})})
// })

store.dispatch({
  type: 'FETCH_USER',
  payload: axios.get('http://rest.learncode.academy/api/wstern/users')
})
