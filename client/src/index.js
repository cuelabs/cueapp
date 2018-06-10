import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import thunk from 'redux-thunk'
import cueReducer from './reducers'
import App from './App'
import Login from './pages/Login'
import './index.css'

const cueStore = createStore(
  cueReducer,
  applyMiddleware(thunk)
)

ReactDOM.render(
  <Provider store={cueStore}>
    <Router>
      <div>
        <Route exact path='/' component={Login} />
        <Route path='/user/:suid' component={({match}) => <App suid={match.params.suid} />} />
      </div>
    </Router>
  </Provider>,
  document.getElementById('root')
)
