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
const data = {}

var schema
var uischema
window.schema = schema
window.uischema = uischema

const store = createStore(
  combineReducers({ jsonforms: jsonformsReducer() }),
  {
    jsonforms: {
      fields: materialFields,
      renderers: materialRenderers
    }
  }
)

console.log(window.WebViewJavascriptBridge)
window.WebViewJavascriptBridge.registerHandler('initalData', function (data, responseCallback) {
  return '123'
  console.log('data', data)
})

// paraName 等找参数的名称
function GetUrlParam (paraName) {
  var url = document.location.toString()
  var arrObj = url.split('?')
  if (arrObj.length > 1) {
    var arrPara = arrObj[1].split('&')
    var arr
    for (var i = 0; i < arrPara.length; i++) {
      arr = arrPara[i].split('=')
      if (arr != null && arr[0] === paraName) {
        return arr[1]
      }
    }
    return ''
  } else {
    return ''
  }
}

var typeId = GetUrlParam('typeId')
var appid = GetUrlParam('appid')
var network = GetUrlParam('network')

if (typeId && appid) {
   // 获取schema
  let urlschema = '/types/' + typeId + '/schema?appid=' + appid
  fetch(urlschema)
  .then(function (response) {
    return response.json()
  })
  .then(function (myJson) {
    if (myJson.content) {
      schema = JSON.parse(myJson.content)
      store.dispatch(Actions.init(data, schema))
    }
  })

   // 获取url参数 调取uischema
  let urluischema = '/types/' + typeId + '/viewTemplates?appid=' + appid + '&key=entry'
  fetch(urluischema)
    .then(function (response) {
      return response.json()
    })
    .then(function (myJson) {
      if (JSON.stringify(myJson.content) !== '{}') {
        let uiUrl = myJson.content.context + myJson.content.templateUri
        fetch(uiUrl, {
          mode: 'cors'
        })
        .then(function (response) {
          return response.json().then(function (myJson) {
            uischema = myJson
            store.dispatch(Actions.init(data, schema, uischema))
          })
        })
      }
    })
  store.dispatch(Actions.init(data, schema, uischema))
}

store.dispatch(Actions.init(data, schema))

// Uncomment this line (and respective import) to register our custom renderer
store.dispatch(Actions.registerRenderer(ratingControlTester, RatingControl))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
