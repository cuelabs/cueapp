import React from 'react'
import Button from './Button'
import Loader from './Loader'
import Modal from './Modal'
import { 
  sendJoinRequest, 
  closeModal 
} from '../actions'

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
      <Modal>
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
      </Modal>
    )
  } else {
    return (
      <Modal loading>
        <small>
          Requesting to join {
            name.split('').map(toCamelCase).join('')
          }...
        </small>
        <Loader />
      </Modal>
    )
  }
}

const toCamelCase = (val, i, arr) => {
  if (i === 0) {
    return val.toUpperCase()
  } else if (arr[i - 1] === ' ') {
    return val.toUpperCase()
  } else {
    return val
  }
}

export default JoinEventModal
