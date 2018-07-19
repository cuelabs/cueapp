import React, { Component } from 'react'
import CreateEvent from '../pages/CreateEvent'
import JoinEvent from '../pages/JoinEvent'
import Button from '../components/Button'
import Loader from '../components/Loader'

class Home extends Component {
  constructor () {
    super()
    this.createEvent = this.createEvent.bind(this)
    this.joinEvent = this.joinEvent.bind(this)
  }

  componentDidMount () {
    const { dispatch } = this.props
    dispatch({
      type: 'CHANGE_HOME_VIEW',
      view: 'HOME'
    })
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
    const {
      userId,
      eventId,
      homeView
    } = this.props

    let content
    if (userId > 0) {
      if (homeView === 'CREATE') {
        content = <CreateEvent />
      } else if (homeView === 'JOIN' || (eventId > 0)) {
        content = <JoinEvent {...this.props} />
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
          <Loader />
        </div>
      )
    }

    return content
  }
}

export default Home
