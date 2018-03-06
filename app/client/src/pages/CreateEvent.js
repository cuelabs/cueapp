import React from 'react'
import Button from '../components/Button'

const CreateEvent = props => (
  <div className='page create'>
    <form>
      <label>Event Name</label>
      <input type='text' />
      <Button create>Create</Button>
    </form>
  </div>
)

export default CreateEvent
