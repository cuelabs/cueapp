import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadRequests, acceptRequest, rejectRequest } from '../actions'

class HostNotifications extends Component {
  constructor () {
    super()
    this.handleAccept = this.handleAccept.bind(this)
  }

  componentDidMount () {
    const { dispatch, eventId } = this.props
    dispatch(loadRequests(eventId))
  }

  handleAccept (id) {
    const { dispatch, eventId } = this.props
    dispatch(acceptRequest(id, eventId))
  }

  handleReject (id) {
    const { dispatch, eventId } = this.props
    dispatch(rejectRequest(id, eventId))
  }

  render () {
    const { guests, handler } = this.props
    const pendingGuests = guests
      .filter(g => {
        if (g.IsActive || g.DisplayName === '') {
          return false
        } else {
          return true
        }
      })

    return (
      <div className='view'>
        <ul className='host-view-page-list'>
          {
            pendingGuests.map(item => (
              <li key={item.DisplayName}
                style={{flexDirection: `column`}}>
                <p style={{alignSelf: `flex-start`}}>
                  {item.DisplayName} wants to join your event!
                </p>
                <div className='host-request-options'>
                  <button style={{padding: '2vh'}}
                    className='button-host'
                    onClick={() => handler(item.UserID, true)}>Accept</button>
                  <button style={{padding: '2vh'}}
                    className='button-host'
                    onClick={() => handler(item.UserID, false)}>Reject</button>
                </div>
              </li>
            )).reverse()
          }
        </ul>
      </div>
    )
  }
}

const mapStateToProps = state => state

export default connect(mapStateToProps)(HostNotifications)
