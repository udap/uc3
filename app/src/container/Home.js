import React from 'react'
import { NavBar, WhiteSpace, Carousel, WingBlank, NoticeBar} from 'antd-mobile'
import List from '../components/List'
import corn from '../img/corn.jpg'
import walnut from '../img/walnut.jpg'
import garlic from '../img/garlic.jpg'
import getWeb3 from "../util/getWeb3"
import { default as contract } from 'truffle-contract'
import assetRegistry_artifacts from '../../../build/contracts/AssetRegistry.json'
import standardAsset_artifacts from '../../../build/contracts/StandardAsset.json'
import {Warrant,Product} from '../data/warrant'



const products = {
  walnut,
  corn,
  garlic
}
const data = [
  /*{
    id: '1',
    warrantCode: 'W1803152',
    productName: 'corn',
    status: 'pledge',
    totalWeight: '69kg'
  },
  {
    id: '2',
    warrantCode: 'W1803151',
    productName: 'garlic',
    status: '',
    totalWeight: '144kg'
  },
  {
    id: '3',
    warrantCode: 'W1803153',
    productName: 'walnut',
    status: 'pledge',
    totalWeight: '144kg'
  },
  {
    id: '4',
    warrantCode: 'W1803152',
    productName: '',
    status: '',
    totalWeight: '144kg'
  },
  {
    id: '5',
    warrantCode: 'W1803151',
    productName: 'walnut',
    status: 'pledge',
    totalWeight: '144kg'
  },
  {
    id: '6',
    warrantCode: 'W1803153',
    productName: 'corn',
    status: 'pledge',
    totalWeight: '144kg'
  }*/
]

export default class extends React.Component {

  componentDidMount () {
    getWeb3.then(results => {

        console.log('results=====',results);
        this.setState({
          web3: results.web3
        });
        this.initAccount();
        this.instantiateContract();
      }).catch((e) => {
        console.log('Error finding web3.',e)
      })
  }
  initAccount(){
      let self  = this;
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
          self.setState({ account: accs[0] });
          // document.getElementById('accountNum').innerText = account;
      });
  }
  instantiateContract() {
      let self  = this;
      let AssetRegistry = contract(assetRegistry_artifacts);
      let StandardAsset = contract(standardAsset_artifacts);
      AssetRegistry.setProvider(this.state.web3.currentProvider);
      StandardAsset.setProvider(this.state.web3.currentProvider);

      AssetRegistry.deployed().then(function (instance) {
          return instance.getOwnAssets.call({from: self.state.account});
      }).then(assetAddrs => {
          assetAddrs.forEach((addr, index) => {
              StandardAsset.at(addr).then( instance => {
                  return instance.getMetaData.call({from: self.state.account});
              }).then(metaData => {
                  // let data = metaData[4];
                  data.push(JSON.parse(metaData[4]));
              });
              console.log(index,addr);

          });
          self.setState({ data: data });
          console.log(data);
      });
  }

  render () {
    return (
      <div>
        <NavBar mode='light'>WARRANT</NavBar>
        <WhiteSpace size='lg' />
        <WingBlank>
          <Carousel className='my-carousel'
            vertical
            dots={false}
            dragging={false}
            swiping={false}
            autoplay
            infinite
            >
            {
              data.map((data, index) => <NoticeBar key={index} marqueeProps={{ loop: false, style: { padding: '0 7.5px' } }}>{data.warrantCode}</NoticeBar>)
            }
          </Carousel>
          {
              data.map((data, index) => <List key={data.id} data={data} products={products} />)
            }
        </WingBlank>
        <WhiteSpace size='lg' />
      </div>
    )
  }
}
