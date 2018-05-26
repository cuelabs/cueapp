import React, { Component } from 'react'
import { connect } from 'react-redux'
import SearchResults from '../components/SearchResults'
import JoinEventModal from '../components/JoinEventModal'
import { handleSearch, resumePending } from '../actions'

class JoinEvent extends Component {
  componentDidMount () {
    const { dispatch, eventId, eventName } = this.props
    if (eventId > 0) {
      dispatch(resumePending(eventId, eventName))
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
      joinRequestPending,
      resume,
      eventId
    } = this.props

    return (
      <div className='page join'>
        <div className='search'>
          <img className='search-icon blue' 
            src='./ass3.svg' 
            style={{height: 26}}/>
          <input
            placeholder='search events'
            value={query}
            onChange={e => {
              dispatch(handleSearch(e))
            }} />
        </div>
        <SearchResults
          display={query !== ''}
          {...this.props} />
        {
          selectedEventId > -1 &&
          <JoinEventModal
            id={selectedEventId}
            evid={eventId}
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
