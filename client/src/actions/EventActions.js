import axios from 'axios'
import { baseURL } from './index'

// Event info loaded from DB
export const loadEventInfo = id => {
  return dispatch => {
    dispatch({
      type: 'LOAD_EVENT_REQUEST',
      done: false
    })

    axios.post(`${baseURL}/events/read/one`, {
      ID: id
    })
      .then(res => {
        dispatch({
          type: 'LOAD_EVENT_SUCCESS',
          hostId: res.data.HostID,
          name: res.data.EventName,
          eventId: res.data.EvID
        })
      })
      .catch(err => console.log(err))
  }
}

// Requests to join loaded from DB
export const loadRequests = evId => {
  return dispatch => {
    dispatch({
      type: 'LOADING_REQUESTS'
    })

    axios.post(`${baseURL}/events/guests`, {
      ID: evId
    })
      .then(res => {
        const { Data } = res.data
        dispatch({
          type: 'LOAD_REQUESTS_SUCCESS',
          data: Data || []
        })
      })
      .catch(err => console.log(err))
  }
}

// If a user sends a request, and reloads the page before host accepts
// or rejects, this action will trigger the pending request view (loader)
export const resumePending = (eventId, eventName) => {
  return dispatch => {
    dispatch({
      type: 'RESUME_PENDING',
      eventId,
      eventName
    })
  }
}
