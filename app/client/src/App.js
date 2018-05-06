import React, { Component } from 'react'
import {
  BrowserRouter as Router
} from 'react-router-dom'
import { connect } from 'react-redux'
import { loadUser } from './actions'
import Nav from './components/Nav'
import Main from './components/Main'
import Home from './pages/Home'
import EventHost from './pages/EventHost'

class App extends Component {
  componentDidMount () {
    const { dispatch } = this.props
    if (window.localStorage.getItem('uid') != null) {
      dispatch(loadUser(window.localStorage.getItem('uid')))
    }
  }

  render () {
    const {
      isActive,
      hostId,
      userId,
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
