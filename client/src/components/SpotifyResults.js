import React from 'react'

const SpotifyResults = ({data}) => {
  return (
    <div className='spotify-results'>
      {
        data.map(item => (
          <div key={item.uri} className='spotify-result'>
            <div className='spotify-result-left'>
              <h4 className='spotify-song-title'>
                {item.name}
              </h4>
              <div className='spotify-song-info'>
                <h5 className='spotify-song-artist'>
                  {item.artists[0].name}
                </h5>
                <span className='circle-search'>&#9679;</span>
                <h5 className='spotify-song-album'>
                  {item.album.name}
                </h5>
              </div>
            </div>
            <button className='add-to-cue'>
              <i className="fa fa-plus"></i>
            </button>
          </div>
        ))
      }
    </div>
  )
}

export default SpotifyResults