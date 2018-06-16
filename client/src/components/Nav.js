import React from 'react'
import Logo from './Logo'
import { handleSpotifySearch } from '../actions'

const Nav = ({showSearch, handler, value, dispatch, suid}) => (
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
  </nav>
)

export default Nav
