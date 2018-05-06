const initialState = {
  query: '',
  events: [],
  guests: [],
  selectedEventId: -1,
  selectedEventName: '',
  searchLoading: false,
  userId: -1,
  displayName: '',
  isHost: false,
  hostId: -1,
  isActive: false,
  eventId: null,
  eventName: '',
  userAuthorized: false,
  awaitingAuth: false,
  authPage: null,
  joinRequestPending: false
}

const cueReducer = (state = initialState, action) => {
  const { guests } = state
  switch (action.type) {
    case 'AUTH_CODE_REQUEST':
      return {
        ...state,
        awaitingAuth: true
      }
    case 'AUTH_PAGE_LOADED':
      return {
        ...state,
        authPage: action.content
      }
    case 'TEMP_LOGIN_REQUEST':
      return {
        ...state
      }
    case 'TEMP_LOGIN_SUCCESS':
      return {
        ...state,
        userId: action.id,
        displayName: action.username
      }
    case 'JOIN_REQUEST': {
      return {
        ...state,
        joinRequestPending: true
      }
    }
    case 'HOST_NEW_REQUEST': {
      return {
        ...state,
        guests: [
          ...guests,
          {
            type: 'JOIN_REQUEST',
            userId: action.userId,
            DisplayName: action.username
          }
        ]
      }
    }
    case 'LOAD_USER_REQUEST':
      return {
        ...state
      }
    case 'LOAD_USER_SUCCESS':
      return {
        ...state,
        userId: action.id,
        displayName: action.username,
        isActive: action.isActive,
        eventId: action.eventId,
        eventName: action.eventName
      }
    case 'LOADING_REQUESTS':
      return {
        ...state
      }
    case 'LOAD_REQUESTS_SUCCESS':
      return {
        ...state,
        guests: action.data
      }
    case 'NEW_EVENT_SUCCESS':
      return {
        ...state,
        eventName: action.evName,
        eventId: action.evId,
        isActive: true
      }
    case 'LOAD_EVENT_REQUEST':
      return {
        ...state
      }
    case 'LOAD_EVENT_SUCCESS':
      return {
        ...state,
        hostId: action.hostId,
        eventName: action.name
      }
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
