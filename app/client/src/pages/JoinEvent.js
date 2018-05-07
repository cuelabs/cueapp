import React, { Component } from 'react'
import { connect } from 'react-redux'
import SearchResults from '../components/SearchResults'
import JoinEventModal from '../components/JoinEventModal'
import { handleSearch, incomingJoinRequest } from '../actions'

class JoinEvent extends Component {
  componentWillMount () {
    const { dispatch, isActive, hostId, userId } = this.props
    const ws2 = new WebSocket('ws://localhost:8080/ws')
      ws2.addEventListener('message', e => {
        const stuff = JSON.parse(e.data)
        if (stuff.is_accept) {
          this.props.dispatch({
            type: 'GUEST_ACCEPTANCE'
          })
        }
      })
  }

  componentWillReceiveProps (nextProps) {
    const { dispatch, isActive, hostId, userId } = this.props
    if (nextProps.joinRequestPending) {
      const ws2 = new WebSocket('ws://localhost:8080/ws')
      ws2.addEventListener('message', e => {
        const stuff = JSON.parse(e.data)
        console.log(stuff)
        if (stuff.is_accept) {
          nextProps.dispatch({
            type: 'GUEST_ACCEPTANCE'
          })
        } else if (stuff.is_reject) {
          nextProps.dispatch({
            type: 'GUEST_REJECTION'
          })
        }
      })
    }
  }

  render () {
    const {
      query,
      userId,
      displayName,
      dispatch,
      selectedEventId,
      selectedEventName,
      joinRequestPending

    } = this.props

    return (
      <div className='page join'>
        <input
          placeholder='search for ongoing event'
          value={query}
          onChange={e => {
            dispatch(handleSearch(e))
          }} />
        <SearchResults
          display={query !== ''}
          {...this.props} />
        {
          selectedEventId > -1 &&
          <JoinEventModal
            id={selectedEventId}
            uid={userId}
            name={selectedEventName}
            dispatch={dispatch}
            pending={joinRequestPending}
            uname={displayName} />
        }
      </div>
    )
  }
}

const mapStateToProps = state => state

export default connect(mapStateToProps)(JoinEvent)
