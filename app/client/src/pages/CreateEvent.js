import React from 'react'
import Button from '../components/Button'

const CreateEvent = props => (
  <div className='page create'>
    <form>
      <input type='text' />
      <Button create>Create</Button>
    </form>
  </div>
)

export default CreateEvent
