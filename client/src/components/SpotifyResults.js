import React from 'react'

const SpotifyResults = ({data}) => {
  <div className='spotify-results'>
    {
      data && data.map(item => {
        <p style={{color: 'white', zIndex: 8, textAlign: 'center'}}>
          {item.name}
        </p>
      })
    }
  </div>
}

export default SpotifyResults