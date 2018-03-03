import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'

const Home = () => (
  <div className='page home'>
    <Button>
      <Link to='/join'>Join An Event</Link>
    </Button>
    <Button>
      Create Event
    </Button>
  </div>
)

export default Home
