import React from 'react'
import Main from '../components/Main'
import Nav from '../components/Nav'
import { loginSpotify } from '../actions'
import { connect } from 'react-redux'

const Login = props => {
  return (
    <Main>
      <Nav showSearch={false}
        dispatch={() => false} />
      <div className='container'>
        <div className='page'>
          <button type='button'
            className='btn-login'
            style={{padding: '12px'}}
            onClick={() => props.dispatch(loginSpotify())}>Login</button>
        </div>
      </div>
    </Main>
  )
}

const mapStateToProps = state => state

export default connect(mapStateToProps)(Login)
