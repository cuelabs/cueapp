import React from 'react'
import Logo from './Logo'
import SpotifyResults from './SpotifyResults'
import { handleSpotifySearch } from '../actions'

const Nav = ({showSearch, handler, value, dispatch, suid, results}) => (
  <nav>
    <Logo dispatch={dispatch} />
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
      results && results.length > 0 && <SpotifyResults data={results} />
    }
  </nav>
)

export default Nav
