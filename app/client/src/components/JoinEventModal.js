import React, { Component } from 'react'
import Button from './Button'
import Loader from './Loader'
import Modal from './Modal'
import { 
  sendJoinRequest, 
  closeModal 
} from '../actions'
import Socket from '../utils/Socket'

class JoinEventModal extends Component {
  constructor(props) {
    super(props)
    this.joinRequest = this.joinRequest.bind(this)
  }

  componentDidMount () {
    if (this.props.evid !== null) {
      const ws = new Socket(this.props.evid)
      sockets[this.props.evid.toString()] = ws
      ws.assignMessageReader(msg => {
        if (!(msg.user_id === this.props.uid)) {
          return false
        }
        switch (msg.message_type) {
          case 'ACCEPT':
            console.log('You got accepted!')
            ws.destroy()
            this.props.dispatch({
              type: 'GUEST_ACCEPTANCE'
            })
            break
          case 'REJECT':
            console.log('You were rejected, actually.')
            ws.destroy()
            this.props.dispatch({
              type: 'GUEST_REJECTION'
            })
            break
          default:
            return false 
        }
      })
    }
  }

  joinRequest () {
    const { id, uid, dispatch, uname } = this.props
    dispatch({
      type: 'JOIN_REQUEST'
    })
    const data = {
      event_id: id,
      host_id: -1,
      user_id: uid,
      display_name: uname,
      message_type: 'JOIN_REQUEST'
    }
    const ws = new Socket(id, true, data)
    sockets[id.toString()] = ws
    ws.assignMessageReader(msg => {
      if (!(msg.user_id === uid)) {
        return false
      }
      switch (msg.message_type) {
        case 'ACCEPT':
          console.log('You got accepted!')
          ws.destroy()
          dispatch({
            type: 'GUEST_ACCEPTANCE'
          })
          break
        case 'REJECT':
          console.log('You were rejected, actually.')
          ws.destroy()
          dispatch({
            type: 'GUEST_REJECTION'
          })
          break
        default:
          return false 
      }
    })
  } 

  componentWillUnmount () {
    const { id } = this.props
    if (sockets.hasOwnProperty(id.toString())) {
      sockets[id.toString()].destroy()
    }
  }

  render () {
    const {
      name,
      dispatch,
      id,
      uid,
      uname,
      pending
    } = this.props

    if (!pending) {
      return (
        <Modal>
          <p>Join event {name}?</p>
          <div className='modal-inner'>
            <Button join
              handler={this.joinRequest}>
              Let's Go!
            </Button>
            <Button join
              handler={() => dispatch(closeModal())}>
              Nevermind...
            </Button>
          </div>
        </Modal>
      )
    } else {
      return (
        <Modal loading>
          <small>
            Requesting to join {
              name.split('').map(toCamelCase).join('')
            }...
          </small>
          <Loader />
        </Modal>
      )
    }
  }
}

const toCamelCase = (val, i, arr) => {
  if (i === 0) {
    return val.toUpperCase()
  } else if (arr[i - 1] === ' ') {
    return val.toUpperCase()
  } else {
    return val
  }
}

const sockets = {}

export default JoinEventModal
