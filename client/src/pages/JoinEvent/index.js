import React, { Component } from 'react'
import SearchResults from '../../components/SearchResults'
import JoinEventModal from './components/JoinEventModal'
import { handleEventSearch, resumePending } from '../../actions'

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
      eventId
    } = this.props

    return (
      <div className='page join'>
        <div className='search'>
          <i className='fa fa-search' aria-hidden='true' />
          <input
            placeholder='search events'
            value={query}
            onChange={e => {
              dispatch(handleEventSearch(e))
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

export default JoinEvent
