import React, { Component } from 'react'
import { connect } from 'react-redux'
import { tempLogin, resumePending, loginSpotify } from '../actions'
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
      dispatch(loginSpotify())
    }
  }

  joinEvent () {
    const { dispatch } = this.props
    dispatch({
      type: 'CHANGE_HOME_VIEW',
      view: 'JOIN'
    })
  }

  createEvent () {
    const { dispatch } = this.props
    dispatch({
      type: 'CHANGE_HOME_VIEW',
      view: 'CREATE'
    })
  }

  render () {
    const { userId, eventId, homeView } = this.props
    const { create, join } = this.state

    let content
    if (userId > 0) {
      if (homeView === 'CREATE') {
        content = <CreateEvent />
      } else if (homeView === 'JOIN' || (eventId > 0)) {
          content = <JoinEvent />
      } else {
        content = (
          <div className='page home'>
            <Button home
              handler={this.joinEvent}>
              JOIN
            </Button>
            <Button home
              handler={this.createEvent}>
              CREATE
            </Button>
          </div>
        )
      }
    } else {
      content = (
        <div className='page'>
          <button type='button'
            className='btn-login'
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
