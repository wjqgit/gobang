export default function reducer(state={
  user: {
    id: null,
    name: null,
    age: null,
  },
  fetching: false,
  fetched: false,
  error: null
}, action) {
  switch (action.type) {
    case 'FETCH_USER_FULFILLED':
      return { ...state, fetched: true, user: action.payload }
      break;
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
