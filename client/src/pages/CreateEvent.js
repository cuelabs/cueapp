import React, { Component } from 'react'
import { connect } from 'react-redux'
import { handleNewEvent } from '../actions'

class CreateEvent extends Component {
  constructor () {
    super()
    this.state = {
      name: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (e) {
    const { value } = e.target
    this.setState({
      name: value
    })
  }

  handleSubmit (e) {
    e.preventDefault()
    const { dispatch, userId } = this.props
    const { name } = this.state
    if (name.length > 4) {
      dispatch(handleNewEvent(name, userId))
    }
  }

  render () {
    return (
      <div className='page create'>
        <form onSubmit={this.handleSubmit}>
          <input
            type='text'
            onChange={this.handleChange} />
          <button type='submit'>Create</button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = state => state

export default connect(mapStateToProps)(CreateEvent)
