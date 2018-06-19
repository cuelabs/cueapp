import axios from 'axios'
import { baseURL } from './index.js'

export const playNextTrack = cid => {
  return dispatch => {
    dispatch({
      type: 'PLAY_NEXT_TRACK_REQUEST'
    })

    axios.post(`${baseURL}/cue/track/read`, {
      ID: cid
    })
    .then(res => console.log(res))
    .catch(err => console.log(err))
  }
}