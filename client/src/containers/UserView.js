import React, { Component } from 'react'
import { loadUser } from '../actions'
import Home from '../pages/Home'
import EventHost from '../pages/EventHost'
import EventGuest from '../pages/EventGuest'
import PlayControls from '../components/PlayControls'

class UserView extends Component {
  componentDidMount () {
    const { dispatch, suid, userId } = this.props
    if (userId < 0) {
      dispatch(loadUser(suid))
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
        {
          !isActive
            ? <Home {...this.props} />
            : hostId === userId
              ? <EventHost title={eventName}
                {...this.props} />
              : <EventGuest {...this.props} />
        }
        {
          hostId === userId &&
          isActive &&
          !beginning &&
          <PlayControls />
        }
      </div>
    )
  }
}

export default UserView
