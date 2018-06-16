import React from 'react'

const SpotifyResults = ({results}) => {
  <div className='spotify-results'>
    {
      results.map(item => {
        console.log(item)
      })
    }
  </div>
}

export default SpotifyResults