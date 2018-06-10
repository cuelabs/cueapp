import { baseURL } from './index.js'

// User is redirected to spotify login upon hitting index route
export const loginSpotify = () => {
  return dispatch => {
    dispatch({
      type: 'AUTH_REDIRECT'
    })
    window.location.href = `${baseURL}/login`
  }
}
