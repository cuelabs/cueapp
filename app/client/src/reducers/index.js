const initialState = {
  query: '',
  events: []
}

const cueReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SEARCH_INPUT_CHANGE':
      return {
        ...state,
        query: action.value,
        events: action.results
      }

    default:
      return state
  }
}

export default cueReducer
