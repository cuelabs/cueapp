// Host recieves a new request to join event
export const incomingJoinRequest = (userId, username, displayImage, eventId, onPage) => {
  return dispatch => {
    console.log('display image in incomingJoinRequest: ', displayImage)
    if (userId > 0) {
      dispatch({
        type: 'HOST_NEW_REQUEST',
        userId,
        username,
        displayImage,
        eventId,
        isActive: false,
        updateCounter: !onPage
      })
    }
  }
}

// Host accepts request
export const acceptRequest = (uid, eventId) => {
  return dispatch => {
    dispatch({
      type: 'HOST_JUST_ACCEPTED',
      id: uid
    })
  }
}

// Host rejects request
export const rejectRequest = (uid, eventId) => {
  return dispatch => {
    dispatch({
      type: 'HOST_JUST_REJECTED',
      id: uid
    })
  }
}

// Host changes view (guest list, notifications, or settings)
export const changeHostView = num => {
  return dispatch => {
    dispatch({
      type: 'CHANGE_HOST_VIEW',
      num
    })
  }
}

// Host ends event :(
export const endEvent = () => {
  return dispatch => {
    dispatch({
      type: 'HOST_END_EVENT'
    })
  }
}
