import React from 'react'

const SearchResults = ({data, display}) => (
  <ul className={
    `search-results 
    ${display ? 'show' : ''}`
  }>
    {
      data.map(event => (
        <li className='search-result'
          key={event.EvID}>
          <span className='search-result-event-title'>
            {event.EventName}
          </span>
        </li>
      ))
    }
  </ul>
)

export default SearchResults
