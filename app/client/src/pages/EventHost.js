import React, { Component } from 'react'
import { connect } from 'react-redux'
import data from '../data'
import GuestList from '../components/GuestList'
import HostNotifications from '../components/HostNotifications'
import HostSettings from '../components/HostSettings'
import { loadEventInfo, incomingJoinRequest, changeHostView } from '../actions'

class EventHost extends Component {
  constructor () {
    super()
    this.state = {
      selected: 0
    }
    this.circleChange = this.circleChange.bind(this)
  }

  componentDidMount () {
    const { dispatch, eventId } = this.props
    dispatch(loadEventInfo(eventId))
  }

  componentWillReceiveProps (nextProps) {
    const { dispatch, isActive, hostId, userId } = this.props
    if (nextProps.hostId > this.props.hostId) {
      const ws2 = new WebSocket('ws://localhost:8080/ws')
      ws2.addEventListener('message', e => {
        const stuff = JSON.parse(e.data)
        if (isActive && nextProps.hostId === userId && !stuff.is_accept) {
          dispatch(incomingJoinRequest(stuff.user_id, stuff.username))
        }
      })
    }
  }

  circleChange (num) {
    const { dispatch } = this.props
    dispatch(changeHostView(num))
  }

  render () {
    const { 
      title, 
      guests, 
      eventId, 
      userId, 
      hostId, 
      eventName, 
      eventLoading, 
      hostView 
    } = this.props
    
    const activeGuests = guests.
      filter(g => {
        if (g.IsActive && (g.UserID !== userId)) {
          return true
        } else {
          return false
        }
      })
    const pendingGuests = guests
      .filter(g => {
        if (g.IsActive) {
          return false
        } else {
          return true
        }
      })

    return !eventLoading ? (
      <div className='page event-host'>
        <h2 className='host-view-event-title'>
          { title.toUpperCase() }
        </h2>
        {
          hostId === userId &&
          (
            <div className='host-circles'>
              <div className={`circle ${hostView === 0 && 'circle-selected'}`}
                onClick={() => this.circleChange(0)} />
              <div className={`circle ${hostView === 1 && 'circle-selected'}`}
                onClick={() => this.circleChange(1)} />
              <div className={`circle ${hostView === 2 && 'circle-selected'}`}
                onClick={() => this.circleChange(2)} />
            </div>
          )
        }
        {
          hostView === 0 &&
          hostId === userId &&
          <GuestList users={activeGuests} evId={eventId} />
        }
        {
          hostView === 1 &&
          hostId === userId &&
          <HostNotifications data={pendingGuests}/>
        }
        {
          hostView === 2 &&
          hostId === userId &&
          <HostSettings />
        }
        {
          hostId !== userId &&
          <div>Welcome to { eventName }!</div>
        }
      </div>
    ) : <div></div>
  }
}

const mapStateToProps = state => state

export default connect(mapStateToProps)(EventHost)
