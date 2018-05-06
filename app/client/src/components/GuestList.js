import React, { Component } from 'react'
import { connect } from 'react-redux'
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
    const { users } = this.props
    return (
      <div className='view'>
        <h3 className='host-view-page-title'>Guests</h3>
        <ul className='host-view-page-list'>
          {
            users.map(item => (
              <li key={item.UserID}>
                <p>{item.DisplayName}</p>
              </li>
            ))
          }
        </ul>
      </div>
    )
  }
}

const mapStateToProps = state => state 

export default connect(mapStateToProps)(GuestList)
