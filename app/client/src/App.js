import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom'
import { connect } from 'react-redux'
import { loadUser, incomingJoinRequest } from './actions'
import Nav from './components/Nav'
import Main from './components/Main'
import Home from './pages/Home'
import JoinEvent from './pages/JoinEvent'
import CreateEvent from './pages/CreateEvent'
import EventHost from './pages/EventHost'

class App extends Component {
  componentDidMount () {
    const { dispatch, isActive, userId, hostId } = this.props
    if (window.localStorage.getItem('uid') != null) {
      dispatch(loadUser(localStorage.getItem('uid')))
    }
  }

  render () {
    const { 
      isActive, 
      eventName 
    } = this.props

    return (
      <Router>
        <div className='container'>
          <Nav />
          <Main>
            { !isActive
              ? <Home />
              : <EventHost title={eventName} />
            }
          </Main>
        </div>
      </Router>
    )
  }
}

const mapStateToProps = state => state

export default connect(mapStateToProps)(App)
