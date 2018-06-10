// Guest is accepted into event
export const guestAcceptance = () => {
  return dispatch => {
    dispatch({
      type: 'GUEST_ACCEPTANCE'
    })
  }
}
