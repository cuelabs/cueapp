import React from 'react'
import {
  playNextTrack,
  resumePlaying,
  pause
} from '../actions'

const PlayControls = ({dispatch, cid, token, playState}) => {
  return (
    <div className='controls'>
      <div className='controls-row'>
        <i className='fa fa-step-backward' />
        <div className='center-circle' />
        { playState === 'STOPPED' || playState === 'PAUSED' 
          ? <i className='fa fa-play'
              onClick={() => {
                playState === 'STOPPED' 
                ? dispatch(playNextTrack(cid, token))
                : dispatch(resumePlaying())
              }} />
          : <i className='fa fa-pause'
              onClick={() => dispatch(pause())} />

        }
        <i className='fa fa-step-forward' 
          onClick={() => dispatch(playNextTrack(cid, token))}/>
      </div>
    </div>
  )
}

export default PlayControls
