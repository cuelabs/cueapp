import React from 'react'

const SpotifyResults = ({data}) => {
  console.log('in spot: ', data)
  return (
    <div className='spotify-results'>
      <div className='spotify-results-caption'>
        <h4 className='spotify-results-title'>
          TITLE
        </h4>
        <h4 className='spotify-results-title'>
          ARTIST
        </h4>
      </div>
      {
        data.map(item => (
          <div key={item.uri} className='spotify-result'>
            <h4 className='spotify-song-title'>
              {item.name}
            </h4>
            <h5 className='spotify-song-artist'>
              {item.artists[0].name}
            </h5>
          </div>
        ))
      }
    </div>
  )
}

export default SpotifyResults