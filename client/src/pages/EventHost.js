import React, { Component } from 'react'
import { connect } from 'react-redux'
import GuestList from '../components/GuestList'
import HostNotifications from '../components/HostNotifications'
import HostSettings from '../components/HostSettings'
import {
  loadEventInfo,
  incomingJoinRequest,
  changeHostView,
  acceptRequest,
  rejectRequest,
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
    this.handleRequest = this.handleRequest.bind(this)
    this.handleEnd = this.handleEnd.bind(this)
  }

  componentDidMount () {
    const { dispatch, eventId, userId } = this.props
    const ws = new Socket(eventId)
    ws.assignMessageReader(msg => {
      switch (msg.message_type) {
        case 'JOIN_REQUEST':
          console.log('you have a message -> ', msg)
          dispatch(incomingJoinRequest(msg.user_id, msg.display_name, eventId, (this.state.selected === 1)))
          break
        case 'ACCEPT':
          dispatch(acceptRequest(msg.user_id, eventId))
          break
        case 'REJECT':
          dispatch(rejectRequest(msg.user_id, eventId))
          break
        case 'GUEST_LEAVE_EVENT':
          dispatch({
            type: 'GUEST_LEFT_EVENT',
            id: msg.user_id
          })
          break
        case 'END_EVENT':
          dispatch({
            type: 'HOST_END_EVENT'
          })
          break
        default:
          return false
      }
    })
    sockets[eventId.toString()] = ws
    dispatch(loadEventInfo(eventId))
  }

  circleChange (num) {
    const { dispatch } = this.props
    dispatch(changeHostView(num))
  }

  handleRequest (uid, accept) {
    const { eventId } = this.props
    const evId = eventId.toString()
    if (sockets.hasOwnProperty(evId)) {
      sockets[evId].sendMessage({
        event_id: eventId,
        host_id: -1,
        user_id: uid,
        display_name: '',
        message_type: accept ? 'ACCEPT' : 'REJECT'
      })
    }
  }

  handleEnd () {
    const { dispatch, eventId } = this.props
    if (sockets.hasOwnProperty(eventId)) {
      sockets[eventId].sendMessage({
        event_id: eventId,
        host_id: -1,
        user_id: -1,
        display_name: '',
        message_type: 'END_EVENT'
      })
    }
  }

  componentWillUnmount () {
    const { eventId } = this.props
    if (sockets.hasOwnProperty(eventId.toString())) {
      sockets[eventId.toString()].destroy()
    }
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
        if ((g.EventID === eventId) && g.IsActive && (g.UserID !== userId)) {
          return true
        } else {
          return false
        }
      })
    const pendingGuests = guests
      .filter(g => {
        if (g.IsActive || (g.EventID !== eventId)) {
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
          <HostNotifications 
            data={pendingGuests}
            handler={this.handleRequest} />
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

const sockets = {}

const mapStateToProps = state => state

export default connect(mapStateToProps)(EventHost)
