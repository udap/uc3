import React from 'react'
import { NavBar, WhiteSpace, Carousel, WingBlank, Icon} from 'antd-mobile'
import List from '../components/List'
import corn from '../img/corn.jpg'
import walnut from '../img/walnut.jpg'
import garlic from '../img/garlic.jpg'
import empty from '../img/empty.png'
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
      data: []
    }
  }

  componentDidMount () {
    if (window.web3) {
      this.instantiateContract()
    }
  }
  componentWillUnmount = () => {
      this.setState = (state,callback)=>{
          return;
      };
  }

  instantiateContract () {
    let self = this
    let AssetRegistry = contract(assetRegistry_artifacts)
    let StandardAsset = contract(standardAsset_artifacts)
    AssetRegistry.setProvider(web3.currentProvider)
    StandardAsset.setProvider(web3.currentProvider)

    AssetRegistry.deployed().then(function (instance) {
      return instance.getOwnAssets.call({from: account})
    }).then(assetAddrs => {
      assetAddrs.forEach((addr, index) => {
        StandardAsset.at(addr).then(instance => {
          return instance.getMetaData.call({from: account})
        }).then(metaData => {
          console.log(metaData)
          let data = []
          data.push(JSON.parse(metaData[4]))
          self.setState({data: data , inited: true})
        })
      });
      if(assetAddrs.length == 0){
          self.setState({inited: true});
      }
    })

  }

  loading () {
    return <WingBlank>
              <WhiteSpace size='lg' />
                 <div className='center'><Icon type='loading' /></div>
           </WingBlank>;
  }

  listData () {
    if (this.state.data.length == 0){
      return <img className='empty' src={empty} />;
    }
    let content = this.state.data.map((data, index) => <List key={index} data={data} products={products} />)
    return <div>
      <WhiteSpace size='lg' />
      <WingBlank>{content}</WingBlank>
      <WhiteSpace size='lg' />
    </div>
  }

  render () {
    return (
      <div>
        <NavBar mode='light'>WARRANT</NavBar>
        {this.state.inited ? this.listData() : this.loading()}
      </div>
    )
  }
}
