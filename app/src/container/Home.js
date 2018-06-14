import React from 'react'
import {Link} from 'react-router-dom'
import Lists from '../components/List'
import empty from '../img/empty.png'
import { Button, NavBar, Icon, WingBlank, WhiteSpace, PullToRefresh,Toast,Pagination} from 'antd-mobile'
import { default as contract } from 'truffle-contract'
import assetRegistry_artifacts from '../../../build/contracts/AssetRegistry.json'
import standardAsset_artifacts from '../../../build/contracts/StandardAsset.json'
import {Warrant, Product} from '../data/warrant'
import pagerhelper from '../util/pagerhelper'

let tokenName = "cangdan";
let tokenSymbol = "CD";
let tokenUri = "";

let maxNum;
let lastIndex;
const locale = {
  prevText: 'Prev',
  nextText: 'Next',
};
class Home extends React.Component {
  constructor (props) {
    super(props)
    this.oldWarrantsList = [];
    this.beforeList=[];
    this.state = {
      inited: false,
      warrants: [],
      down: true,
      pageSize:2,
      lastIndex:null,
      selectedPage:1
    }
  }

  componentWillMount () {
    window.scrollTo(0, 0)
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.onResize);
  }

   componentWillUnmount() {
     window.removeEventListener('scroll', this.handleScroll);
     window.removeEventListener('resize', this.onResize);
   }

  componentDidMount () {
    if (window.web3) {
      // this.instantiateContract()
      this.getData(0,this.state.pageSize)
    }
  }
  componentshouldupdate(){
    return true
  }
  /*componentWillReceiveProps(nextProps,nextState) {
        this.setState({content: nextProps.content});
  }*/

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
  getData (lastIndex,size,loading,pc) {
        if(loading){
          Toast.loading('Loading...',0);          
        }
        let self = this;
        let AssetRegistry = contract(assetRegistry_artifacts);
        AssetRegistry.setProvider(web3.currentProvider);

        let assetRegistryInstance;
        AssetRegistry.deployed().then(function (instance) {
            assetRegistryInstance = instance;
            return instance.getId.call(tokenName,tokenSymbol,tokenUri,{from: account});
        }).then(id => {
            return assetRegistryInstance.idAssets.call(id,{from: account});
        }).then(assetAddr => {
            if (assetAddr == 0x0){
                Toast.info('The contract has not yet been created !!', 10);
                throw 'The contract has not yet been created !!';
            }
            let pageNo = self.state.selectedPage;
            let pageSize = self.state.pageSize;
            let totalPage = 0;
            this.getAssertIds(assetAddr).then(assertIds =>{
                 totalPage = pagerhelper.calcTotalPage(pageSize,assertIds.length);
                 assertIds.forEach((id, index) => {
                     self.getWarrant(assetAddr,assertIds);
                 });
            });




            maxNum = assetAddrs.length;
            let endNumd;
            endNumd = (lastIndex + size)>maxNum?maxNum:(lastIndex + size);
            let lists = [];
           for (var i = lastIndex; i < endNumd; i++) {
              self.oldWarrantsList.push(assetAddrs[i])
            }
            /*if(pc){
                 lists=assetAddrs.slice(lastIndex,endNumd)
             }else{
                 lists = self.oldWarrantsList;
             }*/
            lists=assetAddrs.slice(lastIndex,endNumd)
            lastIndex = self.oldWarrantsList.length;
            let warrants = [];
            lists.forEach((addr, index) => {
               self.getWarrant(addr).then(warrant => {
                    warrants.push(warrant);
                    this.beforeList.push(warrant);
                    self.setState({
                      warrants: pc?warrants:this.beforeList, 
                      lastIndex:lastIndex,
                      inited: true
                    }, ()=> {
                        Toast.hide()
                    })
                })
            });
            if (self.oldWarrantsList.length == 0) {
              self.setState({inited: true})
              Toast.hide()
            }
        }).catch(error => console.log(error));
        this.setState({})
    }
  getAssertIds(addr){
      let StandardAsset = contract(standardAsset_artifacts);
      StandardAsset.setProvider(web3.currentProvider);
      return StandardAsset.at(addr).then(instance => {
          return instance.getOwnedTokens.call(account,{from: account})
      });
  }
  getWarrant(addr,assertId){
      let warrant={assertId:assertId};
      let StandardAsset = contract(standardAsset_artifacts);
      StandardAsset.setProvider(web3.currentProvider);
      let assetInstance;
      return StandardAsset.at(addr).then(instance => {
              assetInstance = instance;
              return instance.tokenURI.call(assertId,{from: account})
          }).then(tokenURI => {
              warrant = JSON.parse(metaData);
              warrant.tokenURI = tokenURI;
              warrant.metaData = this.getMetaData(tokenURI);
              return assetInstance.ownerOf.call(assertId,{from: account})
          }).then(owner => {
              warrant.owner = owner;
              return assetInstance.tokenIssuer.call(assertId,{from: account})
          }).then(issuer => {
              warrant.issuer = issuer;
          })
  }
  getMetaData(tokenURI){
      let warrant = {
          warrantCode : "W1803151",
          productName:"玉米",
          totalWeight:"100TON",
          storageRoomCode:"TZQ1002-B1",
          warehouseAddress:"北京市北京市朝阳区五里桥",
          products:[{
              sku:"171004100000000",
              origin:"通辽",
              specName:"A级一等粮(霉变<=2%)",
              numberOfPieces:"10",
              weight:"10",
              unit:"TON"
          }]
      }
      return warrant;
  }

  onResize=(e)=>{
    this.setState({
      inited:false
    })
    this.oldWarrantsList=[];
    this.beforeList=[];
    this.getData(0,this.state.pageSize,false,true);                
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
    if(this.state.down){//pull up
      if(this.oldWarrantsList.length!==0){
        this.beforeList=[];
        this.oldWarrantsList=[];
        this.getData(0,this.state.lastIndex);        
      }else{
        this.getData(0,this.state.pageSize);                
      }
    }else{
      if (this.state.lastIndex >= maxNum) {
         this.beforeList=[];
         Toast.info('All load has been completed!!!', 2);
          return;
      }
      this.getData(this.state.lastIndex,this.state.pageSize);
    }
  }

  selectPage = (page)=> {
      if (this.state.selectedPage != page) {
          this.state.selectedPage = page;
          if(page==1){
            this.oldWarrantsList=[];
            this.getData(0,this.state.pageSize,true,true);                
          }else{
            this.getData((this.state.selectedPage-1)*this.state.pageSize,this.state.pageSize,true,true);
          }
      }
     this.setState({})
};

  loading () {
    return <WingBlank>
      <WhiteSpace size='lg' />
      <div className='center'><Icon type='loading' /></div>
    </WingBlank>
  }

  listData () {
    if (this.state.warrants.length == 0) {
      return <img className='empty' src={empty} />
    }
    let content = this.state.warrants.map((warrant, index) => <Lists key={index} index={warrant.addr} warrant={warrant} />)
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
          <Pagination className="pcShow" 
              total={parseInt((maxNum-1)/this.state.pageSize)+1} 
              current={this.state.selectedPage} 
              locale={locale} 
              onChange={this.selectPage}
          />
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
