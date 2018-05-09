import React from 'react'
import {Link} from 'react-router-dom'
import List from '../components/List'
import empty from '../img/empty.png'
import { Button, NavBar, Icon, WingBlank, WhiteSpace, PullToRefresh} from 'antd-mobile'
import { default as contract } from 'truffle-contract'
import assetRegistry_artifacts from '../../../build/contracts/AssetRegistry.json'
import standardAsset_artifacts from '../../../build/contracts/StandardAsset.json'
import {Warrant, Product} from '../data/warrant'

class Home extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      inited: false,
      warrants: [],
      down: true,
      pageIndex:0,
      pageSize:8
    }
  }

  componentWillMount () {
    window.scrollTo(0, 0)
    window.addEventListener('scroll', this.handleScroll);
  }

   componentWillUnmount() {
     window.removeEventListener('scroll', this.handleScroll);
   }

  componentDidMount () {
    if (window.web3) {
      // this.instantiateContract()
    }
  }

 /* instantiateContract () {
    let self = this
    let AssetRegistry = contract(assetRegistry_artifacts)
    let StandardAsset = contract(standardAsset_artifacts)
    AssetRegistry.setProvider(web3.currentProvider)
    StandardAsset.setProvider(web3.currentProvider)

    AssetRegistry.deployed().then(function (instance) {
      return instance.getOwnAssets.call({from: account})
    }).then(assetAddrs => {
      let warrants = []
      assetAddrs.forEach((addr, index) => {
        StandardAsset.at(addr).then(instance => {
          return instance.getMetaData.call({from: account})
        }).then(metaData => {
            // console.log(metaData)
          warrants.push(JSON.parse(metaData[4]))
          self.setState({warrants: warrants, inited: true})
        })
      })
      if (assetAddrs.length == 0) {
        self.setState({inited: true})
      }
    })
  }*/
  getData () {
        let self = this;
        let AssetRegistry = contract(assetRegistry_artifacts);
        let StandardAsset = contract(standardAsset_artifacts);
        AssetRegistry.setProvider(web3.currentProvider);
        StandardAsset.setProvider(web3.currentProvider);

        AssetRegistry.deployed().then(function (instance) {
            return instance.getOwnAssets.call({from: account})
        }).then(assetAddrs => {
            let warrants = [];
            assetAddrs.forEach((addr, index) => {
                self.getWarrant(addr).then(warrant => {
                    warrants.push(warrant);
                    self.setState({warrants: warrants})
                })
            });
        });
    }

  getWarrant(addr){
      let warrant;
      return StandardAsset.at(addr).then(instance => {
              return instance.getData.call({from: account})
          }).then(metaData => {
              warrant = JSON.parse(metaData);
              return instance.getOwner.call({from: account})
          }).then(owner => {
              warrant.owner = owner;
              return instance.getIssuer.call({from: account})
          }).then(issuer => {
              warrant.issuer = issuer;
              return instance.getState.call({from: account})
          }).then(state => {
              warrant.state = state;
              return warrant;
          })
  }

  handleScroll=(e)=>{
    let scrollTop  = document.body.scrollTop||document.documentElement.scrollTop;  //滚动条滚动高度
    if(scrollTop<=10){
      this.setState({
        down:true//pull up
      })
    }else{
      this.setState({
        down:false//dropdown
      })
    }
  }

  onRefresh=() => {
    if(this.state.down){
      //pull up 0-this.state.pageSize
      //this.setState({ warrants: newwarrant})
    }else{
      //dropdown  ++pageIndex~this.state.pageSize
      //this.setState({ warrants: warrants.push(newwarrant)})
    }
  }

  loading () {
    return <WingBlank>
      <WhiteSpace size='lg' />
      <div className='center'><Icon type='loading' /></div>
    </WingBlank>
  }
  listData () {
    if (this.state.warrants.length == 0) {
      <img className='empty' src={empty} />
    }
    let content = this.state.warrants.map((warrant, index) => <List key={index} index={index} warrant={warrant} />)
    return <div>
      <WhiteSpace size='lg' />
      <WingBlank>
        <div>
          <PullToRefresh
            ref={el => this.ptr = el}
            indicator={this.state.down ? {} : { deactivate: 'Pull up can be refreshed' }}
            direction={this.state.down ? 'down' : 'up'}
            onRefresh={this.onRefresh}
                >
            {content}
          </PullToRefresh>
        </div>
      </WingBlank>
      <WhiteSpace size='lg' />
    </div>
  }

  render () {
    return (<div>
      <NavBar mode='dark'
        rightContent={
          <Link to={{pathname: '/issue'}}>
            <i className='fa fa-plus' style={{color: '#fff'}} />
          </Link>
      }
        leftContent='Warrants'
       />
      {this.state.inited ? this.listData() : this.loading()}
    </div>)
  }
}

export default Home
