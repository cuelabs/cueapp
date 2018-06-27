import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadUser } from './actions'
import Nav from './components/Nav'
import Main from './components/Main'
import Loader from './components/Loader'
import UserView from './components/UserView'

class App extends Component {
  componentDidMount () {
    const { dispatch, suid, userId } = this.props
    if (userId < 0) {
      dispatch(loadUser(suid))
    }
  }

  render () {
    const {
      isActive,
      beginning,
      dispatch,
      suid,
      spotifyResults,
      spotifyQuery,
      flip,
      cueId
    } = this.props

    console.log(suid)

    return (
      <Main>
        {
          !beginning &&
            <Nav 
              showSearch={isActive}
              dispatch={dispatch}
              suid={suid}
              results={spotifyResults}
              value={spotifyQuery}
              flip={flip}
              cueId={cueId} />
        }
        {
          !beginning
            ? <UserView {...this.props} />
            : <Loader first />
        }
      </Main>
    )
  }
}

const mapStateToProps = state => state

export default connect(mapStateToProps)(App)
