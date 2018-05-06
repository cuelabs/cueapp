import React from 'react'
import Button from './Button'
import { sendJoinRequest, closeModal } from '../actions'

const JoinEventModal = ({
  name,
  dispatch,
  id,
  uid,
  uname,
  pending
}) => {
  if (!pending) {
    return (
      <div className='modal'>
        <p>Join event {name}?</p>
        <div className='modal-inner'>
          <Button join
            handler={() => dispatch(sendJoinRequest(uid, uname, id))}>
            Let's Go!
          </Button>
          <Button join
            handler={() => dispatch(closeModal())}>
            Nevermind...
          </Button>
        </div>
      </div>
    )
  } else {
    return (
      <div className='modal modal-loading'>
        <img
          className='loader'
          src='https://www.iconfinder.com/icons/113196/235402/128/raster?token=1525402996-cdcVN2Llh07OXXuQIyhgfNBxqqz8vwlV-pYdTbyWlSATBIYxJNnoN%2BXGxxQU%3D' />
      </div>
    )
  }
}

export default JoinEventModal
