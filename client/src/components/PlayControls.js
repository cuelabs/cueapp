import React from 'react'
import {
  playNextTrack
} from '../actions'

const PlayControls = ({dispatch}) => {
  return (
    <div className='controls'>
      <div className='controls-row'>
        <i className='fa fa-step-backward' />
        <div className='center-circle' />
        <i className='fa fa-play' />
        <i className='fa fa-step-forward' />
      </div>
    </div>
  )
}

export default PlayControls
