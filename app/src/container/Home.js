import React from 'react'
import {Link} from 'react-router-dom'
import Lists from '../components/List'
import empty from '../img/empty.png'
import { Button, NavBar, Icon, WingBlank, WhiteSpace, PullToRefresh,Toast,Pagination} from 'antd-mobile'
import { default as contract } from 'truffle-contract'
import standardAsset_artifacts from '../../../build/contracts/StandardAsset.json'
import pagerhelper from '../util/pagerhelper'
import getAssertAddr from '../util/getAssertAddr'
const request = require('superagent');


const locale = {
  prevText: 'Prev',
  nextText: 'Next',
};
class Home extends React.Component {
  constructor (props) {
    super(props)
    this.idList = [];
    this.oldList = [];
    this.state = {
      inited: false,
      warrants: [],
      down: true,
      pageSize:2,
      selectedPage:1,
      totalPage:0
    }
  }

  componentWillMount () {
    window.scrollTo(0, 0)
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.onResize);
  }

   componentWillUnmount() {
      this._isMounted = false;
      window.removeEventListener('scroll', this.handleScroll);
      window.removeEventListener('resize', this.onResize);     
   }

  componentDidMount () {
    this._isMounted = true;
    if (window.web3) {
      // this.instantiateContract()
      this.getData(1,true)
    }
  }
  componentshouldupdate(){
    return true
  }
  getData (selectedPage,hideLoading,isList,hasList) {
        let self = this;
        if(!selectedPage){
          selectedPage = self.state.selectedPage;
        }
        if(!hideLoading){
            Toast.loading('Loading...',0);                
        }
      getAssertAddr.then(assetAddr => {
          self.addr = assetAddr;
          let pageSize = self.state.pageSize;
          let totalPage = self.state.totalPage;
          let startIndex,endIndex;
          this.getAssertIds(assetAddr).then(assertIds =>{
             if(this._isMounted&&assertIds.length==0){
                self.setState({
                  inited:true,
                  warrants:[]
                })
                return;
             }
             totalPage = pagerhelper.calcTotalPage(pageSize,assertIds.length);
              startIndex = pagerhelper.calcStart(selectedPage,pageSize);
              endIndex = hasList?this.oldList.length:pageSize+startIndex;
              this.idList = assertIds;
              let lists = [];
              let newWarrants = [];
              if(hasList){
                  this.oldList = [];
              }
              for (var i = startIndex; i < endIndex; i++) {
                  if(assertIds[i]){
                      lists.push(assertIds[i]);
                  }
              }
              lists.forEach((id, index) => {
                  self.getWarrant(assetAddr,id).then(warrant => {
                      newWarrants.push(warrant);
                      self.oldList.push(warrant);
                      if(this._isMounted){
                        self.setState({
                            totalPage:totalPage,
                            warrants: isList?this.oldList:newWarrants,
                            inited: true
                        }, ()=> {
                            Toast.hide()
                        })
                      }
                      
                  })
              });
          });
      })

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
              warrant.tokenURI = tokenURI;
              // warrant.metaData = this.getMetaData(tokenURI);
               this.getMetaData(tokenURI,warrant);
              return assetInstance.ownerOf.call(assertId,{from: account})
          }).then(owner => {
              warrant.owner = owner;
              return assetInstance.tokenIssuer.call(assertId,{from: account})
          }).then(issuer => {
              warrant.issuer = issuer;
              return warrant;
          })
  }
  getMetaData(tokenURI,warrant){
      if (!tokenURI)
          return ;
      if (!tokenURI.toString().startsWith("http"))
          return ;
      request.get(tokenURI.toString())
          .then( res => {
              warrant.metaData = JSON.parse(res.body);
          })
/*
      let warrant = {
          warrantCode : "W1803151",
          productName:"玉米",
          totalWeight:"100TON",
          storageRoomCode:"TZQ1002-B1",
          warehouseAddress:"北京市北京市朝阳区五里桥",
          products:[{
              sku:"171004100000000",
              producedIn:"通辽",
              specName:"A级一等粮(霉变<=2%)",
              amount:"10",
              weight:"10",
              unit:"TON"
          }]
      }
      return warrant;*/
  }

  onResize=(e)=>{
    this.setState({
      inited:false
    })
    this.oldList = [];
    this.getData(1,true)
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
        if(this.state.warrants.length!=0){
          this.getData(1,false,true,true);  
        }else{
          this.getData(1,false,true);                
        }
    }else{
      if (this.state.warrants.length >= this.idList.length) {
         Toast.info('All load has been completed!!!', 3);
          return;
      }
      let selectedNum = parseInt(this.state.warrants.length/this.state.pageSize)+1;
      this.getData(selectedNum,false,true);
    }
  }

  selectPage = (page)=> {
    if (this.state.selectedPage != page) {
        this.state.selectedPage = page;
        this.getData();
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
    let content = this.state.warrants.map((warrant, index) => <Lists key={index} index={warrant.assertId} warrant={warrant} />)
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
              total={this.state.totalPage} 
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
