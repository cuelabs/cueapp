import React, { Component } from 'react'
import { loadUser } from '../actions'
import Home from '../pages/Home'
import EventHost from '../pages/EventHost'
import EventGuest from '../pages/EventGuest'
import PlayControls from '../components/PlayControls'
import axios from 'axios'

class UserView extends Component {
  componentDidMount () {
    const { token } = this.props

    console.log('hey')

    // setInterval(() => {
    //   console.log(window)
    // }, 5000)

    window.onSpotifyWebPlaybackSDKReady = () => {
      const accessToken = token;
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(accessToken); }
      });

      // Error handling
      player.addListener('initialization_error', ({ message }) => { console.error(message); });
      player.addListener('authentication_error', ({ message }) => { console.error(message); });
      player.addListener('account_error', ({ message }) => { console.error(message); });
      player.addListener('playback_error', ({ message }) => { console.error(message); });

      // Playback status updates
      player.addListener('player_state_changed', state => { console.log(state); });

      // Ready
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      // Connect to the player!
      player.connect();
    };

  }

  render () {
    const {
      isActive,
      hostId,
      userId,
      eventName,
      beginning
    } = this.props

    console.log('here: ', window)

    return (
      <div className='container'>
        {
          !isActive
            ? <Home {...this.props} />
            : hostId === userId
              ? <EventHost title={eventName}
                {...this.props} />
              : <EventGuest {...this.props} />
        }
        {
          hostId === userId &&
          isActive &&
          !beginning &&
          <PlayControls />
        }
      </div>
    )
  }
}

export default UserView
