import React, { Component } from 'react'
import { connect } from 'react-redux'
import SearchResults from '../components/SearchResults'
import JoinEventModal from '../components/JoinEventModal'
import { handleSearch } from '../actions'

class JoinEvent extends Component {
  render () {
    const {
      query,
      events,
      dispatch,
      selectedEventId,
      selectedEventName
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
          selectedEventId > -1 
          && <JoinEventModal 
                id={selectedEventId}
                name={selectedEventName}
                dispatch={dispatch} /> 
        }
      </div>
    )
  }
}

const mapStateToProps = state => state

export default connect(mapStateToProps)(JoinEvent)
