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
        <small>Requesting to join {name.split('').map((val, i, arr) => {
          if (i === 0) {
            return val.toUpperCase()
          } else if (arr[i - 1] === ' ') {
            return val.toUpperCase()
          } else {
            return val
          }
        }).join('')}...</small>
        <div className='sk-circle'>
          <div className='sk-circle1 sk-child' />
          <div className='sk-circle2 sk-child' />
          <div className='sk-circle3 sk-child' />
          <div className='sk-circle4 sk-child' />
          <div className='sk-circle5 sk-child' />
          <div className='sk-circle6 sk-child' />
          <div className='sk-circle7 sk-child' />
          <div className='sk-circle8 sk-child' />
          <div className='sk-circle9 sk-child' />
          <div className='sk-circle10 sk-child' />
          <div className='sk-circle11 sk-child' />
          <div className='sk-circle12 sk-child' />
        </div>
      </div>
    )
  }
}

export default JoinEventModal
