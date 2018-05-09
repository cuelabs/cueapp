import React from 'react'

const PlayControls = () => {
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
