import React from 'react'
import {
  playNextTrack,
  resumePlaying,
  pause
} from '../actions'
import playPurple from '../images/play-purple-thicker.svg'

const PlayControls = ({dispatch, cid, token, playState}) => {
  return (
    <div className='controls'>
      <div className='controls-row'>
        <i className='fa fa-step-backward' />
        { playState === 'STOPPED' || playState === 'PAUSED' 
          ? <img src={playPurple}
              height={56}
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
