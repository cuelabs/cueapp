import React, { Component } from 'react'
import { connect } from 'react-redux'
import { tempLogin } from '../actions'
import CreateEvent from '../pages/CreateEvent'
import JoinEvent from '../pages/JoinEvent'
import Button from '../components/Button'

class Home extends Component {
  constructor () {
    super()
    this.state = {
      tempUsername: '',
      create: false,
      join: false
    }
    this.handleNameChange = this.handleNameChange.bind(this)
    this.login = this.login.bind(this)
    this.createEvent = this.createEvent.bind(this)
    this.joinEvent = this.joinEvent.bind(this)
  }

  handleNameChange (e) {
    const { value } = e.target
    this.setState({
      tempUsername: value
    })
  }

  login () {
    const { dispatch } = this.props
    if (this.value !== '') {
      dispatch(tempLogin(this.state.tempUsername))
    }
  }

  joinEvent () {
    this.setState({
      join: true
    })
  }

  createEvent () {
    this.setState({
      create: true
    })
  }

  render () {
    const { userId } = this.props
    const { create, join } = this.state

    let content
    if (userId > 0) {
      if (create) {
        content = <CreateEvent />
      } else if (join) {
        content = <JoinEvent />
      } else {
        content = (
          <div className='page home'>
            <Button home
              handler={this.joinEvent}>
              Join An Event
            </Button>
            <Button home
              handler={this.createEvent}>
              Create Event
            </Button>
          </div>
        )
      }
    } else {
      content = (
        <div className='page'>
          <input type='text'
            onChange={this.handleNameChange} />
          <button type='button'
            style={{padding: '12px'}}
            onClick={this.login}>Login</button>
        </div>
      )
    }

    return content
  }
}

const mapStateToProps = state => state

export default connect(mapStateToProps)(Home)
