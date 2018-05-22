import React from 'react'
import SearchResult from './SearchResult'

const SearchResults = props => {
  const {
    display,
    events
  } = props
  return (
    <ul className={
      `search-results 
      ${display ? 'show' : ''}`
    }>
      {
        events.map(event => (
          <SearchResult
            key={event.EvID}
            id={event.EvID}
            {...props}>
            {event.EventName}
          </SearchResult>
        ))
      }
    </ul>
  )
}

export default SearchResults
