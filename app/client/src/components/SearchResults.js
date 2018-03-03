import React from 'react'

const SearchResults = ({data, display}) => (
  <ul className={
    `search-results 
    ${display ? 'show' : ''}`
  }>
    {
      data.map(event => (
        <li className='search-result'>
          <span className='search-result-event-title'>
            {event.name}
          </span>
        </li>
      ))
    }
  </ul>
)

export default SearchResults
