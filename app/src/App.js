import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import { NoticeBar, Toast } from 'antd-mobile'
import {
  Home,
  ISSUE,
  Detail,
  Pledge,
  NoMatch
} from './container'
import getWeb3 from './util/getWeb3'

import 'antd-mobile/dist/antd-mobile.css'

if (window) {
  window.account = null
}
export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      web3: null,
      account: null
    }
  }
  componentWillMount () {
    getWeb3.then(results => {
      console.log('results=====', results)
      this.setState({
        web3: results.web3
      })
      this.initAccount()
    }).catch((e) => {
      console.log('Error finding web3.', e)
    })
  }

  initAccount () {
    let self = this
    this.state.web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        Toast.offline('There was an error fetching your accounts!!!', 3)
        return
      }
      if (accs.length == 0) {
        Toast.fail('Could not get any accounts! Make sure your Ethereum client is configured correctly!!!', 3)
        return
      }
      self.setState({ account: accs[0] })
      window.account = accs[0]
    })
  }

  render () {
    return (
      <Router>
        <div style={{height: '100%'}}>
          <div className='container'>
            {/* <NoticeBar className='account' mode='closable' icon={null} action={<span />}>{
                this.state.account ? this.state.account : 'No Account'}
            </NoticeBar> */}
            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/issue' component={ISSUE} />
              <Route path='/warrant' component={Detail} />
              <Route path='/pledge' component={Pledge} />
              <Route component={NoMatch} />
            </Switch>
          </div>
        </div>
      </Router>
    )
  }
}
