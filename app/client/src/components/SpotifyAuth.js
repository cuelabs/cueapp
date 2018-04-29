import React from 'react'
import axios from 'axios'

const SpotifyAuth = ({ content }) => (
  <div>
    {
      <button onClick={
        () => {
          console.log('hello')
          axios.get('http://localhost:8080/login')
          .then(res => console.log(res))
          .catch(err => (console.log('err', err)))
        }
      }>Log in</button>
    }
  </div>
)


export default SpotifyAuth
