import React from 'react'
import { selectEvent } from '../actions'

const SearchResult = ({id, children, dispatch}) => (
  <li className='search-result'
    onClick={() => dispatch(selectEvent(id, children))}>
    <span className='search-result-event-title'>
      {children}
    </span>
  </li>
)

export default SearchResult