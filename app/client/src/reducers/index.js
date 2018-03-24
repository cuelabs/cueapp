const initialState = {
  query: '',
  events: [],
  selectedEventId: -1,
  selectedEventName: '',
  searchLoading: false,
  userId: 1
}

const cueReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SEARCH_EVENTS_REQUEST':
      return {
        ...state,
        query: action.value,
        searchLoading: true
      }
    case 'SEARCH_EVENTS_SUCCESS':
      return {
        ...state,
        query: action.value,
        events: action.results,
        searchLoading: false
      }
    case 'SEARCH_EVENTS_FAILURE':
      return {
        ...state,
        query: action.value,
        events: [],
        searchLoading: false
      }
    case 'EVENT_SELECT':
      return {
        ...state,
        selectedEventId: action.eventId,
        selectedEventName: action.eventName
      }
    case 'MODAL_CLOSE':
      return {
        ...state,
        selectedEventName: '',
        selectedEventId: -1
      }

    default:
      return state
  }
}

export default cueReducer
