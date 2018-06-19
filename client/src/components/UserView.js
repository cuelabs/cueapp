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

    window.onSpotifyWebPlaybackSDKReady = () => {
      const accessToken = token;
      window.myPlayer = new window.Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(accessToken); }
      });

      // Error handling
      window.myPlayer.addListener('initialization_error', ({ message }) => { console.error(message); });
      window.myPlayer.addListener('authentication_error', ({ message }) => { console.error(message); });
      window.myPlayer.addListener('account_error', ({ message }) => { console.error(message); });
      window.myPlayer.addListener('playback_error', ({ message }) => { console.error(message); });

      // Playback status updates
      window.myPlayer.addListener('player_state_changed', state => { console.log(state); });

      // Ready
      window.myPlayer.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });

      // Not Ready
      window.myPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      // Connect to the player!
      window.myPlayer.connect();
    };

  }

  render () {
    const {
      isActive,
      hostId,
      userId,
      eventName,
      beginning,
      dispatch,
      cueId
    } = this.props

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
          <PlayControls dispatch={dispatch} cid={cueId}/>
        }
      </div>
    )
  }
}

export default UserView
