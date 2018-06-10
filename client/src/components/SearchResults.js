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
        events.length > 0 ? (
          events.map(event => (
            <SearchResult
              key={event.EvID}
              id={event.EvID}
              {...props}>
              {event.EventName}
            </SearchResult>
          ))
        ) : null
      }
    </ul>
  )
}

export default SearchResults
