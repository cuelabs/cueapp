import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import Nav from './components/Nav'
import Main from './components/Main'
import Home from './pages/Home'
import JoinEvent from './pages/JoinEvent'
import CreateEvent from './pages/CreateEvent'

class App extends Component {
  render () {
    return (
      <Router>
        <div className='container'>
          <Nav />
          <Main>
            <Route
              exact path='/'
              component={Home} />
            <Route
              path='/join'
              component={JoinEvent} />
            <Route 
              path='/create'
              component={CreateEvent} />
          </Main>
        </div>
      </Router>
    )
  }
}

export default App
