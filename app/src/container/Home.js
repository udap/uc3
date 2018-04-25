import React from 'react'
import { NavBar, WhiteSpace, Carousel, WingBlank, NoticeBar, Icon} from 'antd-mobile'
import List from '../components/List'
import corn from '../img/corn.jpg'
import walnut from '../img/walnut.jpg'
import garlic from '../img/garlic.jpg'
import getWeb3 from '../util/getWeb3'
import { default as contract } from 'truffle-contract'
import assetRegistry_artifacts from '../../../build/contracts/AssetRegistry.json'
import standardAsset_artifacts from '../../../build/contracts/StandardAsset.json'
import {Warrant, Product} from '../data/warrant'

const products = {
  walnut,
  corn,
  garlic
}

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      inited: false,
      refreshing: false,
      addr: null,
      data: []
    }
  }
  componentDidMount () {
    if (this.state.refreshing) return
    getWeb3.then(results => {
      console.log('results=====', results)
      this.setState({
        web3: results.web3,
        refreshing: true
      })
      this.initAccount()
      this.instantiateContract()
    }).catch((e) => {
      console.log('Error finding web3.', e)
    })
  }
  initAccount () {
    let self = this
    this.state.web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }
      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }
          // this.setState({ accounts: accs })
      self.setState({ account: accs[0] })
          // document.getElementById('accountNum').innerText = account;
    })
  }
  instantiateContract () {
    let self = this
    let AssetRegistry = contract(assetRegistry_artifacts)
    let StandardAsset = contract(standardAsset_artifacts)
    AssetRegistry.setProvider(this.state.web3.currentProvider)
    StandardAsset.setProvider(this.state.web3.currentProvider)

    AssetRegistry.deployed().then(function (instance) {
      return instance.getOwnAssets.call({from: self.state.account})
    }).then(assetAddrs => {
      assetAddrs.forEach((addr, index) => {
        StandardAsset.at(addr).then(instance => {
          return instance.getMetaData.call({from: self.state.account})
        }).then(metaData => {
          let data = []
          data.push(JSON.parse(metaData[4]))
          self.setState({
            data: data,
            addr: addr,
            inited: true,
            refreshing: false
          })
        })
      })
    })
  }

  render () {
    return (
      <div>
        <NavBar mode='light'>WARRANT</NavBar>
        {
          this.state.inited ? <div>
            <WhiteSpace size='lg' />
            <WingBlank>
              <NoticeBar mode='closable' icon={null} action={<span />}>{this.state.addr ? this.state.addr : 'No Account'}</NoticeBar>
              {
                  this.state.data.map((data, index) => <List key={index} data={data} products={products} />)
                }
            </WingBlank>
            <WhiteSpace size='lg' />
          </div> : <div className='center'><Icon type='loading' /></div>
        }

      </div>
    )
  }
}
