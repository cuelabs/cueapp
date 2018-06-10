import React, { Component } from 'react'
import { loadRequests } from '../actions'

class GuestList extends Component {
  componentDidMount () {
    const { dispatch, eventId } = this.props
    if (this.props.evId && (this.props.evId > eventId)) {
      dispatch(loadRequests(this.props.evId))
    } else {
      dispatch(loadRequests(eventId))
    }
  }

  render () {
    // const { guests } = this.props
    // const users = guests
    //   .filter(g => {
    //     if ((g.EventID === eventId) && g.IsActive && (g.UserID !== userId)) {
    //       return true
    //     } else {
    //       return false
    //     }
    //   })
    const users = [
      {
        UserID: 1,
        SUID: '123416101',
        DisplayName: 'Matt Carpowich',
        DisplayImage: 'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/32169476_10215922716037991_3090206953469640704_n.jpg?_nc_cat=0&oh=40670caaf299735497d47929a818e7c5&oe=5B81B0BD'
      }, {
        UserID: 2,
        SUID: '123416101',
        DisplayName: 'Matthew Carpowich',
        DisplayImage: 'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/32169476_10215922716037991_3090206953469640704_n.jpg?_nc_cat=0&oh=40670caaf299735497d47929a818e7c5&oe=5B81B0BD'
      }, {
        UserID: 3,
        SUID: '123416101',
        DisplayName: 'Matty Carp',
        DisplayImage: 'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/32169476_10215922716037991_3090206953469640704_n.jpg?_nc_cat=0&oh=40670caaf299735497d47929a818e7c5&oe=5B81B0BD'
      }, {
        UserID: 4,
        SUID: '123416101',
        DisplayName: 'Mattincredible',
        DisplayImage: 'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/32169476_10215922716037991_3090206953469640704_n.jpg?_nc_cat=0&oh=40670caaf299735497d47929a818e7c5&oe=5B81B0BD'
      }
    ]
    return (
      <div className='view'>
        <ul className='host-view-page-list guests'>
          {
            users.map(item => (
              <li key={item.UserID}>
                <img src={item.DisplayImage}
                  alt={`Display image for ${item.DisplayName}`} />
                <p>{item.DisplayName}</p>
              </li>
            ))
          }
        </ul>
      </div>
    )
  }
}

export default GuestList
