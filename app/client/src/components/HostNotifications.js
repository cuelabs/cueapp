import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadRequests } from '../actions'

class HostNotifications extends Component {
  componentDidMount () {
    const { dispatch, eventId } = this.props
    dispatch(loadRequests(eventId))
  }

  render () {
    const { guests } = this.props
    const pendingGuests = guests
      .filter(g => {
        if (g.IsActive) {
        } else {
          return true
        }
      })
    return (
      <div className='view'>
        <h3 className='host-view-page-title'>Notifications</h3>
        <ul className='host-view-page-list'>
          {
            pendingGuests.map(item => (
              <li key={item.DisplayName}
                style={{flexDirection: `column`}}>
                <p style={{alignSelf: `flex-start`}}>
                  {item.DisplayName} wants to join your event!
                </p>
                <div className='host-request-options'>
                  <button style={{padding: '2vh'}}>Accept</button>
                  <button style={{padding: '2vh'}}>Reject</button>
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
