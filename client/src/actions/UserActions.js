import axios from 'axios'
import { baseURL } from './index.js'

// Load all user data
export const loadUser = suid => {
  return dispatch => {
    dispatch({
      type: 'LOAD_USER_REQUEST'
    })

    axios.post(`${baseURL}/users/load`, {
      SUID: suid
    })
      .then(res => {
        setTimeout(() => {
          console.log(res.data)
          dispatch({
            type: 'LOAD_USER_SUCCESS',
            id: res.data.ID,
            suid,
            username: res.data.DisplayName,
            displayImage: res.data.DisplayImage,
            isActive: res.data.IsActive,
            eventId: res.data.EventId ? res.data.EventId : null,
            eventName: res.data.EventName ? res.data.EventName : null
          })
        }, 1000)
      })
      .catch(err => {
        console.log(err)
        dispatch({
          type: 'STOP_LOADING'
        })
      })
  }
}

// User creates new event
export const handleNewEvent = (name, user) => {
  return dispatch => {
    dispatch({
      type: 'NEW_EVENT_REQUEST'
    })

    axios.post(`${baseURL}/events/create`, {
      HostId: user,
      EventName: name
    })
      .then(res => {
        dispatch({
          type: 'NEW_EVENT_SUCCESS',
          evId: res.data.EvID,
          cueId: res.data.CueID,
          evName: name
        })
      })
      .catch(err => console.log(err))
  }
}

// User selects event and is then prompted to join or decline
export const selectEvent = (eventId, eventName) => {
  return dispatch => {
    dispatch({
      type: 'EVENT_SELECT',
      eventId,
      eventName
    })
  }
}

// User requests to join an event
export const sendJoinRequest = (userId, username, eventId) => {
  return dispatch => {
    dispatch({
      type: 'JOIN_REQUEST'
    })
  }
}

// Users closes join event modal
export const closeModal = () => {
  return dispatch => {
    dispatch({
      type: 'MODAL_CLOSE'
    })
  }
}
