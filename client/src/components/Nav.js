import React from 'react'
import Logo from './Logo'

const Nav = ({showSearch, handler, value, dispatch}) => (
  <nav>
    <Logo dispatch={dispatch} />
    {
      showSearch && (
        <div className='search'>
          <img className='search-icon' src='./ass4.svg' />
          <input type='text'
            value={value}
            onChange={handler} />
        </div>
      )
    }
  </nav>
)

export default Nav
