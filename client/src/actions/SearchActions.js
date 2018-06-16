import axios from 'axios'
import { baseURL } from './index.js'

//handles spotify search
export const handleSpotifySearch = (e, suid) => {
  return dispatch => {
    const { value } = e.target

    dispatch({
      type: 'SEARCH_SPOTIFY_REQUEST',
      value
    })

    axios.post(`${baseURL}/spotify/search`, {
      SUID: suid,
      Query: value
    })
    .then(res => {
      console.log(res.data.items)
      dispatch({
        type: 'SEARCH_SPOTIFY_SUCCESS', 
        results: res.data.items
      })
    })
    .catch(err => console.log(err))
  }
}

// handles event search
export const handleEventSearch = e => {
  return dispatch => {
    const { value } = e.target
    let results

    dispatch({
      type: 'SEARCH_EVENTS_REQUEST',
      value
    })

    if (value !== '') {
      axios.get(`${baseURL}/events/read/all`)
        .then(res => {
          const { Data } = res.data

          if (Data !== null) {
            results = Data
              .filter(item => {
                return item.EventName
                  .toLowerCase()
                  .startsWith(
                    value.toLowerCase()
                  )
              })
          } else {
            results = []
          }

          dispatch({
            type: 'SEARCH_EVENTS_SUCCESS',
            value,
            results
          })
        })
        .catch(err => {
          dispatch({
            type: 'SEARCH_EVENTS_FAILURE',
            value: err
          })
        })
    } else {
      dispatch({
        type: 'SEARCH_EVENTS_SUCCESS',
        value,
        results: []
      })
    }
  }
}
