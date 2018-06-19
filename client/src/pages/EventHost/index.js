import React, { Component } from 'react'
import Script from 'react-load-script'
import GuestList from './components/GuestList'
import HostNotifications from './components/HostNotifications'
import HostSettings from './components/HostSettings'
import Player from './components/Player'
import {
  loadEventInfo,
  incomingJoinRequest,
  changeHostView,
  acceptRequest,
  rejectRequest,
  endEvent
} from '../../actions'
import Socket from '../../utils/Socket'

class EventHost extends Component {
  constructor () {
    super()
    this.state = {
      selected: 0
    }
    this.circleChange = this.circleChange.bind(this)
    this.handleRequest = this.handleRequest.bind(this)
    this.handleEnd = this.handleEnd.bind(this)
    this.handleScriptLoad = this.handleScriptLoad.bind(this)
  }

  componentDidMount () {
    const { dispatch, eventId } = this.props
    const ws = new Socket(eventId)
    ws.assignMessageReader(msg => {
      switch (msg.message_type) {
        case 'JOIN_REQUEST':
          console.log('you have a message -> ', msg)
          dispatch(incomingJoinRequest(msg.user_id, msg.display_name, msg.display_image, eventId, (this.state.selected === 1)))
          break
        case 'ACCEPT':
          dispatch(acceptRequest(msg.user_id, eventId))
          break
        case 'REJECT':
          dispatch(rejectRequest(msg.user_id, eventId))
          break
        case 'GUEST_LEAVE_EVENT':
          dispatch({
            type: 'GUEST_LEFT_EVENT',
            id: msg.user_id
          })
          break
        case 'CANCEL_REQUEST':
          dispatch({
            type: 'GUEST_CANCELED_REQUEST',
            id: msg.user_id
          })
          break
        case 'END_EVENT':
          dispatch(endEvent())
          break
        default:
          return false
      }
    })
    sockets[eventId.toString()] = ws
    dispatch(loadEventInfo(eventId))
  }

  circleChange (num) {
    const { dispatch } = this.props
    dispatch(changeHostView(num))
  }

  handleScriptLoad() {

    const { token } = this.props
    console.log('here is a token :', token)

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
      spotify_uri: 'spotify:track:7xGfFoTpQ2E7fRF5lN10tr',
    });
    
    // fetch(`https://api.spotify.com/v1/me/player/play`, {
    //   method: 'PUT',
    //   body: JSON.stringify({ uris: ['spotify:track:49zD0wr2S3d0lZPib0K4e1'] }),
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`
    //   },
    // });

  }

  handleRequest (uid, accept) {
    const { eventId } = this.props
    const evId = eventId.toString()
    if (sockets.hasOwnProperty(evId)) {
      sockets[evId].sendMessage({
        event_id: eventId,
        host_id: -1,
        user_id: uid,
        display_name: '',
        display_image: '',
        message_type: accept ? 'ACCEPT' : 'REJECT'
      })
    }
  }

  handleEnd () {
    const { eventId } = this.props
    if (sockets.hasOwnProperty(eventId)) {
      sockets[eventId].sendMessage({
        event_id: eventId,
        host_id: -1,
        user_id: -1,
        display_name: '',
        display_image: '',
        message_type: 'END_EVENT'
      })
    }
  }

  componentWillUnmount () {
    const { eventId } = this.props
    if (sockets.hasOwnProperty(eventId.toString())) {
      sockets[eventId.toString()].destroy()
    }
  }

  render () {
    const {
      title,
      guests,
      eventId,
      userId,
      hostId,
      eventName,
      eventLoading,
      hostView,
      counter
    } = this.props

    const activeGuests = guests
      .filter(g => {
        if ((g.EventID === eventId) && g.IsActive && (g.UserID !== userId)) {
          return true
        } else {
          return false
        }
      })
    const pendingGuests = guests
      .filter(g => {
        if (g.IsActive || (g.EventID !== eventId)) {
          return false
        } else {
          return true
        }
      })

    return !eventLoading ? (
      <div className='page event-host'>
        <h2 className='host-view-event-title'>
          { title }
        </h2>
        {
          hostId === userId &&
          (
            <div className='host-circles'>
              { counter > 0 && hostView !== 1 &&
                <div className='notifications'>{counter}</div>
              }
              <i className={`fa fa-users ${hostView === 0 && 'selected'}`}
                onClick={() => this.circleChange(0)} />
              <i className={`fa fa-envelope ${hostView === 1 && 'selected'}`}
                onClick={() => this.circleChange(1)} />
              <i className={`fa fa-sliders ${hostView === 2 && 'selected'}`}
                onClick={() => this.circleChange(2)} />
              <i className={`fa fa-users ${hostView === 3 && 'selected'}`}
                onClick={() => this.circleChange(3)} />
            </div>
          )
        }
        {
          hostView === 0 &&
          hostId === userId &&
          <GuestList {...this.props} />
        }
        {
          hostView === 1 &&
          hostId === userId &&
          <HostNotifications
            {...this.props}
            handler={this.handleRequest} />
        }
        {
          hostView === 2 &&
          hostId === userId &&
          <HostSettings handler={this.handleEnd} />
        }
        {
          hostView === 3 &&
          hostId === userId &&
          <Player />
        }
        {
          hostId !== userId &&
          <div>Welcome to { eventName }!</div>
        }
        <Script 
          url="https://sdk.scdn.co/spotify-player.js" 
          onError={() => console.log('oops!')} 
          onLoad={this.handleScriptLoad}
        />
      </div>
    ) : <div />
  }
}

const sockets = {}

export default EventHost
