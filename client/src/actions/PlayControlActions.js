import axios from 'axios'
import { baseURL } from './index.js'

// reads next song from cue and plays it
export const playNextTrack = (cid, token) => {
  return dispatch => {
    dispatch({
      type: 'PLAY_NEXT_TRACK_REQUEST'
    })

    axios.post(`${baseURL}/cue/track/read`, {
      ID: cid
    })
    .then(res => {
      const { SURI } = res.data

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
              'Authorization': `Bearer ${token}`
            },
          });
        });
      };

      play({
        playerInstance: window.myPlayer,
        spotify_uri: SURI,
      });

      dispatch({
        type: 'PLAY_NEXT_TRACK_SUCCESS',
        SURI
      })
    })
    .catch(err => console.log(err))
  }
}

export const resumePlaying = () => {
  return dispatch => {
    window.myPlayer.resume().then(() => {
      dispatch({
        type: 'RESUME_CURRENT_TRACK'
      })
    });
  }
}

export const pause = () => {
  return dispatch => {
    window.myPlayer.pause().then(() => {
      dispatch({
        type: 'PAUSE_CURRENT_TRACK'
      })
    });
  }
}