import React from 'react'
import Main from '../components/Main'
import Nav from '../components/Nav'

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
            onClick={() => console.log('hi')}>Login</button>
        </div>
      </div>
    </Main>
  )
}

export default Login
