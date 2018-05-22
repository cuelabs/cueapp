import axios from 'axios'

export const changeHostView = num => {
  return dispatch => {
    dispatch({
      type: 'CHANGE_HOST_VIEW',
      num
    })
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

    axios.post('/users/create', {
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

    axios.post('/users/load', {
      Uid: parseInt(id)
    })
      .then(res => {
        setTimeout(() => {
          console.log(res.data)
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

    axios.post('/events/read/one', {
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
  }
}

export const incomingJoinRequest = (userId, username, eventId, onPage) => {
  return dispatch => {
    if (userId > 0) {
      dispatch({
        type: 'HOST_NEW_REQUEST',
        userId,
        username,
        eventId,
        isActive: false,
        updateCounter: !onPage
      })
    } 
  }
}

export const rejectRequest = (uid, eventId) => {
  return dispatch => {
    dispatch({
      type: 'HOST_JUST_REJECTED',
      id: uid
    })
  }
}

export const acceptRequest = (uid, eventId) => {
  return dispatch => {
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

    axios.post('/events/guests', {
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

    axios.post('/events/create', {
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
      axios.get('/events/read/all')
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
