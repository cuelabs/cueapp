import React from 'react'
import Logo from './Logo'

const Nav = ({showSearch, handler, value}) => (
  <nav>
    <Logo />
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
