import React from 'react'
import { NavBar, List, Accordion, WhiteSpace, Modal, Button, WingBlank, Toast,Flex,Icon } from 'antd-mobile'
import {
  Link
} from 'react-router-dom'
import PopoverItem from '../components/PopoverItem'

import standardAsset_artifacts from '../../../build/contracts/StandardAsset.json'
import { default as contract } from 'truffle-contract';

const Item = List.Item
const prompt = Modal.prompt
const alert = Modal.alert;
const stateObj = {
  0:'ISSUED',
  1:'APPROVED',
  2:'REJECTED'
}
const stateToNum = {
    'ISSUED':0,
    'APPROVED':1,
    'REJECTED':2
}
const StandardAsset = contract(standardAsset_artifacts);
StandardAsset.setProvider(web3.currentProvider);
export default class Detail extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: props.location.state ? props.location.state : {},
      visible:false
    }
  }

  componentWillMount () {
    window.scrollTo(0, 0)
  }

  handleVisibleChange = (visible) => {
    this.setState({
      visible,
    });
  }

  accept=()=> {
      let self = this;
      StandardAsset.at(this.state.data.addr).then(instance => {
          Toast.loading('Loading...',0);
          return instance.setState(stateToNum['APPROVED'], {from: account})
      }).then(result => {
          Toast.hide();
          self.props.history.push( '/',null);
      }).catch(function (e) {
          Toast.hide();
          Toast.fail(e.toString());
      });
  }
  reject=()=>{
      let self = this;
      StandardAsset.at(this.state.data.addr).then(instance => {
          return instance.setState(stateToNum['REJECTED'], {from: account})
      }).then(result => {
          Toast.hide();
          self.props.history.push( '/',null);
      }).catch(function (e) {
          Toast.hide();
          Toast.fail(e.toString());
      });
  }
  transfer(){
      prompt('Transfer', 'please input Recipient address',[ {text: 'Close'},{text: 'Submit',
                  onPress: value => new Promise((resolve, reject) => {
                      if (value) {
                          resolve(value)
                          console.log(`value:${value}`)
                      } else {
                          reject()
                          Toast.info('Recipient address is required !!!', 1)
                          return false
                      }
                  })
              }
          ], 'default', null, ['input your Recipient address'])
  }
  delete=()=>{
    console.log("delete")
  }

  render () {
    let newData = Object.entries(this.state.data);
    let arrList = [];
    let products = []
    let state = {}
    for(var [key, val] of newData) {
      if(key=="products"){
        products = val;
        continue;
      }
      if(key=="addr"){
        continue;
      }
      if(key=="state"){
        state=stateObj[val.toString()];
        arrList.push({key:key, val:state});
        continue;
      }
      arrList.push({key:key, val:val});
    }
    return (
      <div className='detail'>
        <NavBar
          mode='dark'
          icon={<Icon type="left" />}
          leftContent='Detail'
          onLeftClick={() => { this.props.history.go(-1) }}
        ></NavBar>
       
        <List renderHeader={() => 'Basic Infor'} className='my-list basic'>
          {
            arrList.map((obj,index)=> <Item key={index} wrap extra={(obj.key=='issuer'||obj.key=='owner')?
            <PopoverItem visible={this.state.visible} value={obj.val} 
              handleVisibleChange={this.handleVisibleChange}/>:obj.val}>
              {obj.key}
              </Item>)
          }
        </List>
        <List renderHeader={() => 'Items'} className='my-list'>
        </List>
        <div style={{ marginTop: 10, marginBottom: 10 }}>
          <Accordion className='my-accordion' onChange={this.onChange}>
            {
                  products.map((detail, index) => <Accordion.Panel key={index} header={'Item#' + (index + 1)} className='pad'>
                    <Item wrap extra={detail.sku}>sku</Item>
                    <Item wrap extra={detail.producedIn}>producedIn</Item>
                    <Item wrap extra={detail.specName}>specName</Item>
                    <Item wrap extra={detail.amount}>amount</Item>
                    <Item wrap extra={detail.weight + detail.unit}>totalWeight</Item>
                  </Accordion.Panel>)
                }
          </Accordion>
        </div>
          {/*<Link to={{pathname: '/pledge', state: data}}>
            <p className='btn'>PLEDGE</p>
          </Link>*/}
          {
            state==stateObj[0]?
              <div className="flex-container"><Flex justify="center">
              <Flex.Item>
              <Button  type='primary'  
                 onClick={() =>
                   alert('Accept', 'Are you sure???', [
                     { text: 'Cancel', onPress: () => console.log('cancel') },
                     { text: 'Ok', onPress: () => this.accept() },
                   ])
                 }
               >
                 accept
               </Button>
              </Flex.Item>
              <Flex.Item>
              <Button   type='primary' 
                   onClick={() =>
                     alert('Reject', 'Are you sure???', [
                       { text: 'Cancel', onPress: () => console.log('cancel') },
                       { text: 'Ok', onPress: () => this.reject() },
                     ])
                   }
                 >
                   reject
                 </Button></Flex.Item></Flex>
          </div>:(state==stateObj[1]?
          <Flex.Item><Button type='primary' onClick={this.transfer()}>TRANSFER</Button>
          </Flex.Item>:
                 <Flex.Item><Button  type='warning' 
                     onClick={() =>
                       alert('Delete', 'Are you sure???', [
                         { text: 'Cancel', onPress: () => console.log('cancel') },
                         { text: 'Ok', onPress: () => this.delete() },
                       ])
                     }
                   >
                     delete
                   </Button></Flex.Item>)
        }

      </div>
    )
  }
}
