import React from 'react'
import Logo from './Logo'

const Nav = ({showSearch, handler, value, dispatch}) => (
  <nav>
    <Logo dispatch={dispatch} />
    {
      showSearch && (
        <div className='search'>
          <i className='fa fa-search search-nav' aria-hidden='true' />
          <input type='text'
            className='spotify-search'
            value={value}
            onChange={handler} />
        </div>
      )
    }
  </nav>
)

export default Nav
