import React from 'react'

const Masthead = props => {
  return (
    <div className='masthead'>
      <header>
        <h1>
          {props.children}
        </h1>
      </header>
    </div>
  )
}

export default Masthead