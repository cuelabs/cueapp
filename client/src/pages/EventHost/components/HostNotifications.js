import React, { Component } from 'react'
import { loadRequests, acceptRequest, rejectRequest } from '../../../actions'

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

    // const pendingGuests = [
    //   {
    //     UserID: 1,
    //     SUID: '123416101',
    //     DisplayName: 'Matt Carpowich',
    //     DisplayImage: 'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/32169476_10215922716037991_3090206953469640704_n.jpg?_nc_cat=0&oh=40670caaf299735497d47929a818e7c5&oe=5B81B0BD'
    //   }, {
    //     UserID: 2,
    //     SUID: '123416101',
    //     DisplayName: 'Matthew Carpowich',
    //     DisplayImage: 'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/32169476_10215922716037991_3090206953469640704_n.jpg?_nc_cat=0&oh=40670caaf299735497d47929a818e7c5&oe=5B81B0BD'
    //   }, {
    //     UserID: 3,
    //     SUID: '123416101',
    //     DisplayName: 'Matty Carp',
    //     DisplayImage: 'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/32169476_10215922716037991_3090206953469640704_n.jpg?_nc_cat=0&oh=40670caaf299735497d47929a818e7c5&oe=5B81B0BD'
    //   }, {
    //     UserID: 4,
    //     SUID: '123416101',
    //     DisplayName: 'Mattincredible',
    //     DisplayImage: 'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/32169476_10215922716037991_3090206953469640704_n.jpg?_nc_cat=0&oh=40670caaf299735497d47929a818e7c5&oe=5B81B0BD'
    //   }
    // ]
    return (
      <div className='view'>
        <ul className='host-view-page-list'>
          {
            pendingGuests.map(item => (
              <li key={item.DisplayName}
                style={{flexDirection: `column`}}>
                <div className='notification-top-row'>
                  <img src={item.DisplayImage}
                    alt={`Display image for ${item.DisplayName}`}
                    style={{
                      height: 40,
                      width: 40,
                      borderRadius: '50%',
                      marginRight: 12
                    }} />
                  <p style={{height: 40}}>
                    {item.DisplayName} wants to join your event!
                  </p>
                </div>
                <div className='host-request-options'>
                  <button className='button-host-request'
                    onClick={() => handler(item.UserID, true)}>ACCEPT</button>
                  <button className='button-host-request'
                    onClick={() => handler(item.UserID, false)}>REJECT</button>
                </div>
              </li>
            )).reverse()
          }
        </ul>
      </div>
    )
  }
}

export default HostNotifications
