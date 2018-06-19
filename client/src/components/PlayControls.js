import React from 'react'
import {
  playNextTrack
} from '../actions'

const PlayControls = ({dispatch, cid, token}) => {
  return (
    <div className='controls'>
      <div className='controls-row'>
        <i className='fa fa-step-backward' />
        <div className='center-circle' />
        <i className='fa fa-play'
          onClick={() => dispatch(playNextTrack(cid, token))} />
        <i className='fa fa-step-forward' />
      </div>
    </div>
  )
}

export default PlayControls
