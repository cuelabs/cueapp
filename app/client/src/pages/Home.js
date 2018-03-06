import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'

const Home = () => (
  <div className='page home'>
    <Button home>
      <Link to='/join'>Join An Event</Link>
    </Button>
    <Button home>
      <Link to='/create'>Create Event</Link>
    </Button>
  </div>
)

export default Home
