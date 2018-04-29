import React from 'react'
import Button from './Button'
import { closeModal } from '../actions'

const JoinEventModal = ({name, dispatch}) => (
  <div className='modal'>
    <p>Join event {name}?</p>
    <div className='modal-inner'>
      <Button join>
        Let's Go!
      </Button>
      <Button join
        handler={() => dispatch(closeModal())}>
        Nevermind...
      </Button>
    </div>
  </div>
)

export default JoinEventModal
