import axios from 'axios'

const ws = new WebSocket('ws://localhost:8080/ws')

ws.onopen = () => console.log('ello')

export const changeHostView = num => {
  return dispatch => {
    dispatch({
      type: 'CHANGE_HOST_VIEW',
      num
    })
  }
}

export const initAuth = () => {
  return dispatch => {
    dispatch({
      type: 'AUTH_CODE_REQUEST'
    })

    axios.get('http://localhost:8080/auth/code')
      .then(response => {
        dispatch({
          type: 'AUTH_PAGE_LOADED',
          content: response.data
        })
      })
      .catch(err => console.log(err))
  }
}

export const guestAcceptance = () => {
  return dispatch => {
    dispatch({
      type: 'GUEST_ACCEPTANCE'
    })
  }
}

export const tempLogin = name => {
  return dispatch => {
    dispatch({
      type: 'TEMP_LOGIN_REQUEST'
    })

    axios.post('http://localhost:8080/users/create', {
      Username: name
    })
      .then(res => {
        window.localStorage.setItem('uid', res.data.UserID)
        dispatch({
          type: 'TEMP_LOGIN_SUCCESS',
          id: res.data.UserID,
          username: res.data.Username
        })
      })
      .catch(err => console.log(err))
  }
}

export const loadUser = id => {
  return dispatch => {
    dispatch({
      type: 'LOAD_USER_REQUEST'
    })
    axios.post('http://localhost:8080/users/load', {
      Uid: parseInt(id)
    })
      .then(res => {
        setTimeout(() => {
          dispatch({
            type: 'LOAD_USER_SUCCESS',
            id: res.data.UserId,
            username: res.data.DisplayName,
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

export const loadEventInfo = id => {
  return dispatch => {
    dispatch({
      type: 'LOAD_EVENT_REQUEST',
      done: false
    })

    axios.post('http://localhost:8080/events/read/one', {
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

export const resumePending = (eventId, eventName) => {
  return dispatch => {
    dispatch({
      type: 'RESUME_PENDING',
      eventId,
      eventName
    })
  }
}

export const selectEvent = (eventId, eventName) => {
  return dispatch => {
    dispatch({
      type: 'EVENT_SELECT',
      eventId,
      eventName
    })
  }
}

export const sendJoinRequest = (userId, username, eventId) => {
  return dispatch => {
    dispatch({
      type: 'JOIN_REQUEST'
    })
    ws.send(
      JSON.stringify({
        user_id: userId,
        username: username,
        event_id: eventId,
        is_accept: false
      })
    )
  }
}

export const incomingJoinRequest = (userId, username, onPage) => {
  return dispatch => {
    if (userId > 0) {
      dispatch({
        type: 'HOST_NEW_REQUEST',
        userId,
        username,
        isActive: false,
        updateCounter: true
      })
    } else {
      dispatch({
        type: 'USER_JOIN_EVENT'
      })
    }
  }
}

export const rejectRequest = (uid, eventId) => {
  return dispatch => {
    ws.send(
      JSON.stringify({
        user_id: uid,
        username: '',
        event_id: eventId,
        is_accept: false,
        is_reject: true
      })
    )
    dispatch({
      type: 'HOST_JUST_REJECTED',
      id: uid
    })
  }
}

export const acceptRequest = (uid, eventId) => {
  return dispatch => {
    ws.send(
      JSON.stringify({
        user_id: uid,
        username: '',
        event_id: -1,
        is_accept: true,
        is_reject: false
      })
    )
    dispatch({
      type: 'HOST_JUST_ACCEPTED',
      id: uid
    })
  }
}

export const loadRequests = evId => {
  return dispatch => {
    dispatch({
      type: 'LOADING_REQUESTS'
    })

    axios.post('http://localhost:8080/events/guests', {
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

export const closeModal = () => {
  return dispatch => {
    dispatch({
      type: 'MODAL_CLOSE'
    })
  }
}

export const handleNewEvent = (name, user) => {
  return dispatch => {
    dispatch({
      type: 'NEW_EVENT_REQUEST'
    })

    axios.post('http://localhost:8080/events/create', {
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

export const endEvent = id => {
  return dispatch => {
    dispatch({
      type: 'EVENT_ENDING'
    })
    ws.send(
      JSON.stringify({
        user_id: -1,
        username: '',
        event_id: id,
        is_accept: false,
        is_reject: false,
        is_end_event: true
      })
    )
  }
}

export const handleSearch = e => {
  return dispatch => {
    const { value } = e.target
    let results

    dispatch({
      type: 'SEARCH_EVENTS_REQUEST',
      value
    })

    if (value !== '') {
      axios.get('http://localhost:8080/events/read/all')
        .then(res => {
          const { Data } = res.data

          results = Data
            .filter(item => {
              return item.EventName
                .toLowerCase()
                .startsWith(
                  value.toLowerCase()
                )
            })

          dispatch({
            type: 'SEARCH_EVENTS_SUCCESS',
            value,
            results
          })
        })
        .catch(err => {
          dispatch({
            type: 'SEARCH_EVENTS_FAILURE',
            value: err
          })
        })
    } else {
      dispatch({
        type: 'SEARCH_EVENTS_SUCCESS',
        value,
        results: []
      })
    }
  }
}
