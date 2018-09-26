import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { combineReducers, createStore } from 'redux'
import { Provider } from 'react-redux'
import { Actions, jsonformsReducer } from '@jsonforms/core'
import { materialFields, materialRenderers } from '@jsonforms/material-renderers'
import RatingControl from './RatingControl'
import ratingControlTester from './ratingControlTester'
import WebViewJavascriptBridge from './WebViewJavascriptBridge'

var data1 = {}

var schema
var uischema
var newString
window.schema = schema
window.uischema = uischema
window.newString = newString

const store = createStore(
  combineReducers({ jsonforms: jsonformsReducer() }),
  {
    jsonforms: {
      fields: materialFields,
      renderers: materialRenderers
    }
  }
)

window.WebViewJavascriptBridge.registerHandler('initialData', function (data, responseCallback) {
  let newData = JSON.parse(data)
  schema = JSON.parse(newData.schema)
  if (newData.uischema) {
    uischema = JSON.parse(newData.uischema)
  }
  store.dispatch(Actions.init(data1, schema, uischema))
  if (responseCallback) {
    responseCallback('initialData responseData')
  }
})

store.dispatch(Actions.init(data1, schema))

// Uncomment this line (and respective import) to register our custom renderer
store.dispatch(Actions.registerRenderer(ratingControlTester, RatingControl))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
