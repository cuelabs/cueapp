import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import cueReducer from './reducers'
import App from './App'
import './index.css'

const cueStore = createStore(
  cueReducer,
  applyMiddleware(thunk)
)

ReactDOM.render(
  <Provider store={cueStore}>
    <App />
  </Provider>,
  document.getElementById('root')
)
