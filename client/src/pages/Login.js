import React from 'react'
import Main from '../components/Main'
import Nav from '../components/Nav'
import { loginSpotify } from '../actions'
import { connect } from 'react-redux'

const Login = props => {
  return (
    <div>
      <Main>
        <Nav showSearch={false}
          dispatch={() => false} />
        <div className='container'>
          <div className='login-page'>
            <div className='login-inner-large'>
              <div className='login-content'>
                <h2 className='login-phrase'>
                  Easy. Fun.
                </h2>
                <p className='login-phrase'>
                  The music you love, with friends.
                </p>
                <button onClick={() => props.dispatch(loginSpotify())}>
                  CONNECT WITH SPOTIFY
                </button>
              </div>
            </div>
            <div className='login-inner-large'>
              <div className='login-content'>
                <p><i class="fa fa-plus-circle" aria-hidden="true"></i>Create a Cue.</p>
                <p><i class="fa fa-users" aria-hidden="true"></i>Invite your friends.</p>
                <p><i class="fa fa-music" aria-hidden="true"></i>Add your favorite tracks.</p>
              </div>
            </div>
          </div>
        </div>
      </Main>
      <footer><span>&copy;</span> 2018 Cue</footer>
    </div>
  )
}

const mapStateToProps = state => state

export default connect(mapStateToProps)(Login)
