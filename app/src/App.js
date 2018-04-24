import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

import {
  Home,
  My,
  ISSUE,
  Detail,
  Pledge,
  NoMatch
} from './container'
import {Nav} from './components'

import 'antd-mobile/dist/antd-mobile.css'

const App = () => (
  <Router>
    <div>
      <Nav />
      <div className='container'>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/issue' component={ISSUE} />
          <Route path='/warrant' component={Detail} />
          <Route path='/pledge' component={Pledge} />
          <Route path='/my' component={My} />
          <Route component={NoMatch} />
        </Switch>
      </div>
    </div>
  </Router>
)
export default App
