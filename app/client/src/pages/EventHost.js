import React, { Component } from 'react'
import { connect } from 'react-redux'
import GuestList from '../components/GuestList'
import HostNotifications from '../components/HostNotifications'
import HostSettings from '../components/HostSettings'
import {
  loadEventInfo,
  incomingJoinRequest,
  changeHostView,
  endEvent
} from '../actions'
import Socket from '../utils/Socket'

class EventHost extends Component {
  constructor () {
    super()
    this.state = {
      selected: 0
    }
    this.circleChange = this.circleChange.bind(this)
    this.handleEnd = this.handleEnd.bind(this)
  }

  componentDidMount () {
    const { dispatch, eventId, userId } = this.props
    const ws = new Socket(eventId)
    ws.assignMessageReader(msg => {
      switch (msg.message_type) {
        case 'JOIN_REQUEST':
          console.log('you have a message -> ', msg)
          break
        default:
          return false
      }
    })
    dispatch(loadEventInfo(eventId))
  }

  circleChange (num) {
    const { dispatch } = this.props
    dispatch(changeHostView(num))
  }

  handleEnd () {
    const { dispatch, eventId } = this.props
    dispatch(endEvent(eventId))
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
      hostView,
      counter
    } = this.props

    const activeGuests = guests
      .filter(g => {
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
          { title }
        </h2>
        {
          hostId === userId &&
          (
            <div className='host-circles'>
              { counter > 0 && hostView !== 1 &&
                <div className='notifications'>{counter}</div>
              }
              <i className={`fa fa-users ${hostView === 0 && 'selected'}`}
                onClick={() => this.circleChange(0)} />
              <i className={`fa fa-envelope ${hostView === 1 && 'selected'}`}
                onClick={() => this.circleChange(1)} />
              <i className={`fa fa-sliders ${hostView === 2 && 'selected'}`}
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
          <HostNotifications data={pendingGuests} />
        }
        {
          hostView === 2 &&
          hostId === userId &&
          <HostSettings handler={this.handleEnd} />
        }
        {
          hostId !== userId &&
          <div>Welcome to { eventName }!</div>
        }
      </div>
    ) : <div />
  }
}

const mapStateToProps = state => state

export default connect(mapStateToProps)(EventHost)
