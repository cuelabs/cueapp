import React, { Component } from 'react'
import {
  BrowserRouter as Router
} from 'react-router-dom'
import { connect } from 'react-redux'
import { loadUser } from './actions'
import Nav from './components/Nav'
import Main from './components/Main'
import PlayControls from './components/PlayControls'
import Home from './pages/Home'
import EventHost from './pages/EventHost'

class App extends Component {
  componentDidMount () {
    const { dispatch } = this.props
    if (window.localStorage.getItem('uid') != null) {
      dispatch(loadUser(window.localStorage.getItem('uid')))
    } else {
      dispatch({
        type: 'STOP_LOADING'
      })
    }
  }

  render () {
    const {
      isActive,
      hostId,
      userId,
      eventName,
      beginning
    } = this.props

    return (
      <Router>
        <div className='container'>
          { !beginning &&
            <Nav showSearch={isActive} />
          }
          { !beginning ? (
            <Main>
              { !isActive
                ? <Home />
                : <EventHost title={eventName} />
              }
              {
                hostId === userId && isActive && !beginning &&
                  <PlayControls />
              }
            </Main>
          ) : (
            <div className='sk-circle first'>
              <div className='sk-circle1 sk-child' />
              <div className='sk-circle2 sk-child' />
              <div className='sk-circle3 sk-child' />
              <div className='sk-circle4 sk-child' />
              <div className='sk-circle5 sk-child' />
              <div className='sk-circle6 sk-child' />
              <div className='sk-circle7 sk-child' />
              <div className='sk-circle8 sk-child' />
              <div className='sk-circle9 sk-child' />
              <div className='sk-circle10 sk-child' />
              <div className='sk-circle11 sk-child' />
              <div className='sk-circle12 sk-child' />
            </div>
          )
          }
        </div>
      </Router>
    )
  }
}

const mapStateToProps = state => state

export default connect(mapStateToProps)(App)
