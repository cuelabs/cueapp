import React from 'react'

const Logo = ({dispatch, flip}) => (
  <h1 onClick={() => dispatch({
    type: 'CHANGE_HOME_VIEW',
    view: 'HOME'
  })} className={`logo ${flip ? 'logo-flip' : ''}`}>
    cue
  </h1>
)

export default Logo
