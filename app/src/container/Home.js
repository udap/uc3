/* eslint no-dupe-keys: 0, no-mixed-operators: 0 */
import React from 'react'
import {Link} from 'react-router-dom'
import List from '../components/List'
import empty from '../img/empty.png'
import { PullToRefresh, ListView, Button,NavBar,Icon,WingBlank,WhiteSpace, Carousel } from 'antd-mobile';
import { default as contract } from 'truffle-contract'
import assetRegistry_artifacts from '../../../build/contracts/AssetRegistry.json'
import standardAsset_artifacts from '../../../build/contracts/StandardAsset.json'
import {Warrant, Product} from '../data/warrant'

let NUM_ROWS = 10;

class Home extends React.Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {
      inited:false,
      warrants:[],
      pageIndex:0,
      hasMore:true,
      dataSource,
      refreshing: true,
      isLoading: true,
      useBodyScroll: true,
    };
  }

  // If you use redux, the data maybe at props, you need use `componentWillReceiveProps`
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.dataSource !== this.props.dataSource) {
  //     this.setState({
  //       dataSource: this.state.dataSource.cloneWithRows(nextProps.dataSource),
  //     });
  //   }
  // }

  componentWillMount () {
    window.scrollTo(0, 0)
  }

  componentDidUpdate() {
    if (this.state.useBodyScroll) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
  }

  componentDidMount() {
    if (window.web3) {
      this.instantiateContract()
    }
  }
  componentWillUnmount(){
      if (this.timer)clearTimeout(this.timer);
      if (this.timer2)clearTimeout(this.timer2);
  }

  genData=(pageIndex)=>{
    const dataArr = [];
    if(pageIndex == parseInt((this.state.warrants.length)/NUM_ROWS)){
      NUM_ROWS = (this.state.warrants.length)%NUM_ROWS;
      this.setState({
        hasMore:false
      })
    }else{
      NUM_ROWS = 10;
    }
    for (let i = 0; i < NUM_ROWS; i++) {
      dataArr.push(`row - ${(pageIndex * NUM_ROWS) + i}`);
    }
    return dataArr;
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
        let warrants = [];
        assetAddrs.forEach((addr, index) => {
          StandardAsset.at(addr).then(instance => {
            return instance.getMetaData.call({from: account})
          }).then(metaData => {
            //console.log(metaData)
            warrants.push(JSON.parse(metaData[4]));
            self.setState({warrants: warrants , inited: true})
            this.timer=setTimeout(() => {
              this.rData = this.genData();
              this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.genData()),
                refreshing: false,
                isLoading: false,
              });
            }, 1500);
          })
      });
      if(assetAddrs.length == 0){
          self.setState({inited: true});
      }
     
    })

  }


  onRefresh = () => {
    this.setState({ refreshing: true, isLoading: true });
    // simulate initial Ajax
    setTimeout(() => {
      this.rData = this.genData();
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        refreshing: false,
        isLoading: false,
      });
    }, 600);
  };

  onEndReached = (event) => {

    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    if (!this.state.hasMore) {
      return;
    }
    this.setState({ isLoading: true });
    this.timer2 = setTimeout(() => {
      this.rData = [...this.rData, ...this.genData(++this.state.pageIndex)];
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        isLoading: false,
      });
    }, 1000);
  };

  loading () {
    return <WingBlank>
              <WhiteSpace size='lg' />
                 <div className='center'><Icon type='loading' /></div>
           </WingBlank>;
  }

  listWarrant () {
     if (this.state.warrants.length == 0){
       return <img className='empty' src={empty} />;
     }else{
      const warrants = this.state.warrants;
      const separator = (sectionID, rowID) => (
        <div
          key={`${sectionID}-${rowID}`}
          style={{
            backgroundColor: '#F5F5F9',
            height: 8,
            borderTop: '1px solid #ECECED',
            borderBottom: '1px solid #ECECED',
          }}
        />
      );
      const row = (rowData, sectionID, rowID) => {
        if (rowID==warrants.length) {
          return 'end';
        }else{
         return (
           <div key={rowID}
             style={{
               padding: '0 15px',
               backgroundColor: 'white',
             }}
           >
              <List key={rowID} index={rowID} warrant={warrants[rowID]} />
           </div>
         );
        }
        
      };
       return (
       <div>
             <ListView
               key={this.state.useBodyScroll ? '0' : '1'}
               ref={el => this.lv = el}
               dataSource={this.state.dataSource}
               renderFooter={() => (<div style={{ padding: 15, textAlign: 'center' }}>
                 {this.state.isLoading ? 'Loading...' : 'Loaded'}
               </div>)}
               renderRow={row}
               renderSeparator={separator}
               useBodyScroll={this.state.useBodyScroll}
               style={this.state.useBodyScroll ? {} : {
                 height: this.state.height,
                 border: '1px solid #ddd',
                 margin: '5px 0',
               }}
               pullToRefresh={<PullToRefresh
                 refreshing={this.state.refreshing}
                 onRefresh={this.onRefresh}
               />}
               onEndReached={this.onEndReached}
               pageSize={NUM_ROWS}
             />
           </div>
       )
     }
     

   }

  render() {   
    return (<div>
      <NavBar mode='dark'
      rightContent={
        <Link to={{pathname: '/issue'}}>
        <i className="fa fa-plus" style={{color:'#fff'}}></i>
        </Link>
      }
      leftContent='Warrants'
      ></NavBar>
      {this.state.inited ? this.listWarrant() : this.loading()}
    </div>);
  }
}

export default Home