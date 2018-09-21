import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { combineReducers, createStore } from 'redux'
import { Provider } from 'react-redux'
// import schema from './schema.json'
// import uischema from './uischema.json'
import { Actions, jsonformsReducer } from '@jsonforms/core'
import { materialFields, materialRenderers } from '@jsonforms/material-renderers'
import RatingControl from './RatingControl'
import ratingControlTester from './ratingControlTester'
import $ from 'jquery'

const data = {}

var schema
var uischema

const store = createStore(
  combineReducers({ jsonforms: jsonformsReducer() }),
  {
    jsonforms: {
      fields: materialFields,
      renderers: materialRenderers
    }
  }
)

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

/* console.log('appid', appid)
if (typeId) {
  let url = 'http://47.104.225.39/types/' + typeId + '/viewTemplates?appid=' + appid + '&key=entry'
  console.log('url', url)
  let url1 = 'http://localhost:3000/'
  $.ajax({
    type: 'get',
    crossDomain: true,
    contentType: 'application/json;charset=utf-8',
    async: false,
    data: {symbol: 'ctsh'},
    url: url1,
    dataType: 'jsonp',
    headers: {
      'X-Network-Id': network
    },
    success: function (msg) {
      alert(msg)
    },
    error: function (error) {
      alert(error)
    }
  })
}
*/
/* if (typeId) {
  console.log("typeId",typeId)
   // 获取schema
  let urlschema = '/types/' + typeId + '/schema?appid='+appid
  console.log("typeId",urlschema)
  let testurl = 'https://ylucky.github.io/test/schema.json'
  fetch(testurl)
  .then(function (response) {
    return response.json()
  .then(function (myJson) {
    console.log(myJson)
    schema = myJson.schema
    store.dispatch(Actions.init(data,schema))
  })

   // 获取url参数 调取uischema
  let urluischema = '/types/' + typeId + '/viewTemplates?appid=' + appid + '&key=entry'
  fetch(testurl)
    .then(function (response) {
      return response.json()
    })
    .then(function (myJson) {
      console.log(myJson)
      if (myJson.content) {
        let uiUrl = myJson.content.context + myJson.content.templateUri
        fetch(uiUrl)
        .then(function (response) {
          return response.json()
        })
        .then(function (myJson) {
          uischema = myJson
        })
      }
      store.dispatch(Actions.init(data,schema,uischema))
    })
} */

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
