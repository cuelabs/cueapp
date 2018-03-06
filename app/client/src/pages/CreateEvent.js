import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button from '../components/Button'
import { handleNewEvent } from '../actions'

class CreateEvent extends Component {
  constructor () {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (e) {
    e.preventDefault()
    const { dispatch, userId } = this.props
    const { value } = this.eventName
    if (value.length > 4) {
      dispatch(handleNewEvent(value, userId))
    }
  }

  render() {
    return (
      <div className='page create'>
        <form onSubmit={this.handleSubmit}>
          <input 
            type='text' 
            ref={
              node => {
                this.eventName = node
              }
            } />
          <Button create>Create</Button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = state => state

export default connect(mapStateToProps)(CreateEvent)
