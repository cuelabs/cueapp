import React from 'react'
import Logo from './Logo'
import SpotifyResults from './SpotifyResults'
import { handleSpotifySearch } from '../actions'

const Nav = ({
  showSearch, 
  handler, 
  value, 
  dispatch, 
  suid, 
  results, 
  flip,
  cueId
}) => {
  return (
    <nav>
      <Logo dispatch={dispatch} flip={flip} />
      {
        showSearch && (
          <div className='search'>
            <input type='text'
              className='spotify-search'
              value={value}
              onChange={e => {
                dispatch(handleSpotifySearch(e, suid))
              }} />
          </div>
        )
      }
      {
        value ? value.length > 0 && 
          <SpotifyResults 
            data={results} 
            cueId={cueId}
            dispatch={dispatch} /> : null 
      }
    </nav>
  )
}

export default Nav
