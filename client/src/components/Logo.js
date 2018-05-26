import React from 'react'
import { Link } from 'react-router-dom'

const Logo = ({dispatch}) => (
  <h1 onClick={() => dispatch({
    type: 'CHANGE_HOME_VIEW',
    view: 'HOME'
  })} className='logo'>
    cue
  </h1>
)

export default Logo
