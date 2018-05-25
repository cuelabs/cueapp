import React from 'react'

const HostSettings = props => (
  <div className='view'>
    <div className='inner-right-column'>
      <button 
        className='button-host please-fade'
        style={{marginTop: '4vh', fontSize: 24, width: 240}}
        onClick={props.handler}>
        End Event
      </button>
    </div>
  </div>
)

export default HostSettings
