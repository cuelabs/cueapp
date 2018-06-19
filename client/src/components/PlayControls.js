import React from 'react'
import {
  playNextTrack
} from '../actions'

const PlayControls = ({dispatch, cid}) => {
  return (
    <div className='controls'>
      <div className='controls-row'>
        <i className='fa fa-step-backward' />
        <div className='center-circle' 
          onClick={() => dispatch(playNextTrack(cid))}/>
        <i className='fa fa-play' />
        <i className='fa fa-step-forward' />
      </div>
    </div>
  )
}

export default PlayControls
