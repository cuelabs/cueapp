import React, { Component } from 'react'
import { connect } from 'react-redux'
import data from '../data'
import GuestList from '../components/GuestList'
import HostNotifications from '../components/HostNotifications'
import HostSettings from '../components/HostSettings'
import { loadEventInfo, incomingJoinRequest } from '../actions'

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
      console.log('yo')
      const ws2 = new WebSocket('ws://localhost:8080/ws')
      ws2.addEventListener('message', e => {
        const stuff = JSON.parse(e.data)
        console.log(isActive, hostId, userId)
        if (isActive && nextProps.hostId === userId) {
          dispatch(incomingJoinRequest(stuff.user_id, stuff.username))
        }
      })
    }
  }

  circleChange (num) {
    console.log(data)
    this.setState({
      selected: num
    })
  }

  render () {
    const { title } = this.props
    const { selected } = this.state
    return (
      <div className='page event-host'>
        <h2 className='host-view-event-title'>
          { title.toUpperCase() }
        </h2>
        <div className='host-circles'>
          <div className={`circle ${selected === 0 && 'circle-selected'}`}
            onClick={() => this.circleChange(0)} />
          <div className={`circle ${selected === 1 && 'circle-selected'}`}
            onClick={() => this.circleChange(1)} />
          <div className={`circle ${selected === 2 && 'circle-selected'}`}
            onClick={() => this.circleChange(2)} />
        </div>
        {
          selected === 0 &&
          <GuestList users={data.fakeUsers} />
        }
        {
          selected === 1 &&
          <HostNotifications data={[]} />
        }
        {
          selected === 2 &&
          <HostSettings />
        }
      </div>
    )
  }
}

const mapStateToProps = state => state

export default connect(mapStateToProps)(EventHost)
