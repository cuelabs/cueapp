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

    // axios.post(`${baseURL}/spotify/search`, {
    //   SUID: suid,
    //   Query: value
    // })
    // .then(res => {
    //   dispatch({
    //     type: 'SEARCH_SPOTIFY_SUCCESS', 
    //     results: res.data.items
    //   })
    // })
    // .catch(err => console.log(err))

    dispatch({
      type:'SEARCH_SPOTIFY_SUCCESS',
      results: [
        {
          album: {
            name: 'Culture',
            images: [ 
              {
                url: ''
              }, {
                url: ''
              },
              {
                url: 'https://i.scdn.co/image/7e718ad5b8719dd6350f69514585d9b47c28a79d'
              }
            ]
          },
          artists: [
            {
              name: 'Migos'
            }
          ],
          popularity: 75,
          uri: 'spotify:track:59wcUkUV5EeMgvRl2cibwW',
          name: 'Stir Fry'
        }, {
          album: {
            name: 'Ye',
            images: [ 
              {
                url: ''
              }, {
                url: ''
              },
              {
                url: 'https://i.scdn.co/image/578b7dc80f0e3a626001ad0fd9ac06bacff8c0d7'
              }
            ]
          },
          artists: [
            {
              name: 'Kanye West'
            }
          ],
          popularity: 88,
          uri: 'spotify:track:49zD0wr2S3d0lZPib0K4e1',
          name: 'Some Good Song'
        } 
      ]
    })
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
