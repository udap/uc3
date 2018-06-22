import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import { NoticeBar, Modal } from 'antd-mobile'
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
      account: null,
      modal: false,
      text: null
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

  onClose =() => {
      this.setState({
        modal: false,
      });
    }

  initAccount () {
    let self = this
    this.state.web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        self.setState({
          modal:true,
          text:'There was an error fetching your accounts!!!'
        })
        return
      }
      if (accs.length == 0) {
        self.setState({
          modal:true,
          text:'Could not get any accounts! Make sure your Ethereum client is configured correctly!!!'
        })
        return
      }
      self.setState({ account: accs[0] })
      window.account = accs[0]
      window.network = web3.version.network;

      web3.currentProvider.publicConfigStore.on('update', ()=>{
            if (web3.eth.accounts[0] !== account) {
                window.account = web3.eth.accounts[0];
                window.location.reload();

            }
            let newNetwork = web3.version.network;
            if (newNetwork != 'loading'){
                if(newNetwork != 'loading' && newNetwork !== network){
                    window.network = newNetwork;
                    window.location.reload();
                }else{
                    network = newNetwork;
                }
            }
        });
    });
  }

  render () {
    return (
      <Router>
        <div style={{height: '100%'}}>
          <div className='container'>
            {/* <NoticeBar className='account' mode='closable' icon={null} action={<span />}>{
                this.state.account ? this.state.account : 'No Account'}
            </NoticeBar> */}
            {
              this.state.modal?<Modal
                visible={this.state.modal}
                transparent
                maskClosable={false}
                title="Prompt"
                footer={[{ text: 'Ok', onPress: () => {this.onClose()} }]}
              >
                <div style={{ height: 100}}>
                  {this.state.text}
                </div>
              </Modal>:null
            }
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
