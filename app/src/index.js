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
import dsBridge from 'dsbridge'
import schema1 from './invoice.json'
// import uischema1 from './uischema.json'
var data1 = {
  'comments': [
    {
      'date': '2001-09-10',
      'message': 'This is an example message'
    },
    {
      'date': '2018-09-27',
      'message': 'Get ready for booohay'
    }
  ]
}

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
dsBridge.register('initialData', function (arg1, responseCallback) {
  let newData = JSON.parse(arg1)
  schema = JSON.parse(newData.schema)
  if (newData.uischema) {
    uischema = JSON.parse(newData.uischema)
  }
  store.dispatch(Actions.init(data1, schema, uischema))
  if (responseCallback) {
    responseCallback('initialData responseData')
  }
})

store.dispatch(Actions.init(data1, schema1))

// Uncomment this line (and respective import) to register our custom renderer
store.dispatch(Actions.registerRenderer(ratingControlTester, RatingControl))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
