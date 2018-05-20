import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadUser } from './actions'
import Nav from './components/Nav'
import Main from './components/Main'
import PlayControls from './components/PlayControls'
import Loader from './components/Loader'
import Home from './pages/Home'
import EventHost from './pages/EventHost'

class App extends Component {
  componentDidMount () {
    const { dispatch } = this.props
    const uid = window.localStorage.getItem('uid')
    if (uid !== null) {
      dispatch(loadUser(uid))
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
            <Loader first />
          )
          }
        </div>
    )
  }
}

const mapStateToProps = state => state

export default connect(mapStateToProps)(App)
