import React, { Component } from 'react'
import Nav from './components/Nav'
import Main from './components/Main'
import Button from './components/Button'

class App extends Component {
  render () {
    return (
      <div className='container'>
        <Nav />
        <Main>
          <Button>Join An Event</Button>
          <Button>Create Event</Button>
        </Main>
      </div>
    )
  }
}

export default App
