import React from 'react'

const Player = props => {
  const play = ({
      spotify_uri,
      playerInstance: {
        _options: {
          getOAuthToken,
          id
        }
      }
    }) => {
      getOAuthToken(access_token => {
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
          method: 'PUT',
          body: JSON.stringify({ uris: [spotify_uri] }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
          },
        });
      });
    };

    play({
      playerInstance: new window.Spotify.Player({ name: "ayy" }),
      spotify_uri: 'spotify:track:7xGfFoTpQ2E7fRF5lN10tr',
    });
  return (
    <div></div>
  )
}

export default Player