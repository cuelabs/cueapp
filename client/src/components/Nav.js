import React from 'react'
import Logo from './Logo'
import SpotifyResults from './SpotifyResults'
import { handleSpotifySearch } from '../actions'

const Nav = ({showSearch, handler, value, dispatch, suid, results, flip}) => {
  return (
    <nav>
      <Logo dispatch={dispatch} flip={flip} />
      {
        showSearch && (
          <div className='search'>
            <i className='fa fa-search search-nav' aria-hidden='true' />
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
        results.length > 0 && <SpotifyResults data={results} />
      }
    </nav>
  )
}

export default Nav
