import React, { Component } from 'react'
import Button from '../../../components/Button'
import Loader from '../../../components/Loader'
import Modal from '../../../components/Modal'
import { closeModal } from '../../../actions'
import Socket from '../../../utils/Socket'

class JoinEventModal extends Component {
  constructor (props) {
    super(props)
    this.joinRequest = this.joinRequest.bind(this)
    this.cancelRequest = this.cancelRequest.bind(this)
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
            ws.destroy()
            delete sockets[this.props.evid.toString()]
            this.props.dispatch({
              type: 'GUEST_ACCEPTANCE'
            })
            break
          case 'REJECT':
            ws.destroy()
            delete sockets[this.props.evid.toString()]
            this.props.dispatch({
              type: 'GUEST_REJECTION'
            })
            break
          case 'CANCEL_REQUEST':
            ws.destroy()
            delete sockets[this.props.evid.toString()]
            this.props.dispatch(closeModal())
            break
          default:
            return false
        }
      })
    }
  }

  joinRequest () {
    const { id, uid, dispatch, uname, displayImage } = this.props
    dispatch({
      type: 'JOIN_REQUEST'
    })
    const data = {
      event_id: id,
      host_id: -1,
      user_id: uid,
      display_name: uname,
      display_image: displayImage,
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
          ws.destroy()
          delete sockets[id.toString()]
          dispatch({
            type: 'GUEST_ACCEPTANCE'
          })
          break
        case 'REJECT':
          ws.destroy()
          delete sockets[id.toString()]
          dispatch({
            type: 'GUEST_REJECTION'
          })
          break
        case 'CANCEL_REQUEST':
          ws.destroy()
          delete sockets[id.toString()]
          dispatch(closeModal())
          break
        default:
          return false
      }
    })
  }

  cancelRequest () {
    const { uid } = this.props
    let id
    if (this.props.evid > -1) {
      id = this.props.evid
    } else {
      id = this.props.id
    }
    if (sockets.hasOwnProperty(id.toString())) {
      sockets[id.toString()].sendMessage({
        event_id: id,
        host_id: -1,
        user_id: uid,
        display_name: '',
        display_image: '',
        message_type: 'CANCEL_REQUEST'
      })
    }
  }

  componentWillUnmount () {
    const { id } = this.props
    if (sockets.hasOwnProperty(id.toString())) {
      sockets[id.toString()].destroy()
      delete sockets[id.toString()]
    }
  }

  render () {
    const {
      name,
      dispatch,
      pending
    } = this.props

    if (!pending) {
      return (
        <Modal>
          <p>Join event {name}?</p>
          <div className='modal-inner'>
            <Button small
              handler={this.joinRequest}>
              Let's Go!
            </Button>
            <Button small
              handler={() => dispatch(closeModal())}>
              Nevermind
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
          <small className='small-cancel'
            onClick={this.cancelRequest}>CANCEL</small>
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
