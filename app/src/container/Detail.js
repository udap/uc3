import React from 'react'
import { NavBar, List, Accordion, WhiteSpace, Modal, Button, WingBlank, Toast,Flex,Icon } from 'antd-mobile'
import {
  Link
} from 'react-router-dom'
import PopoverItem from '../components/PopoverItem'

import standardAsset_artifacts from '../../../build/contracts/StandardAsset.json'
import { default as contract } from 'truffle-contract';
import getAssertAddr from '../util/getAssertAddr';

const Item = List.Item
const prompt = Modal.prompt
const alert = Modal.alert;
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
  transfer = () =>{
      let self = this;
       const promptInstance = prompt('Transfer', 'please input Recipient address',[ {text: 'Close'},{text: 'Submit',onPress: recipient => new Promise((resolve, reject) => {
                      if (recipient && web3.isAddress(recipient)){
                          getAssertAddr.then(addr =>{
                              StandardAsset.at(addr).then(instance => {
                                  Toast.loading('Loading...',0);
                                  return instance.transferFrom(account,recipient,self.state.data.assertId,{from: account});
                              }).then(result => {
                                  Toast.hide();
                                  promptInstance.close();
                                  self.props.history.push( '/',null);
                                  resolve(value)
                              }).catch(e => {
                                 Toast.hide();
                                 Toast.fail(e.name,2);
                                  reject()
                              });
                          });
                      } else {
                          Toast.info('Please enter the correct address', 1);
                          reject()
                      }
                  })
              }
          ], 'default', null, ['input your Recipient address']);
  }
  burn=()=>{
      let self = this;
      const alertInstance = alert('BURN', 'Are you sure???', [
        { text: 'Cancel', onPress: () => console.log('cancel') },
        { text: 'Ok', onPress: () =>new Promise((resolve) => {
                getAssertAddr.then(addr => {
                    StandardAsset.at(addr).then(instance => {
                        Toast.loading('Loading...',0);
                        return instance.burn(account,self.state.data.assertId,{from: account})
                    }).then(result => {
                        alertInstance.close();
                        Toast.hide();
                        self.props.history.push( '/',null);
                    }).catch(e => {
                        Toast.hide();
                        Toast.fail(e.name,2);
                    });
                });
          })
        },
    ]);
  }

  renderButtons(){
      let buttons = "";
      buttons = <Flex.Item>
          <Button type='primary' onClick={this.transfer}>TRANSFER</Button>
          <WhiteSpace size='lg' />
          <Button  type='warning' onClick={this.burn}>BURN</Button>
      </Flex.Item>;
      return buttons;
  }

  render () {
    let arrList = [];
    let products = []
    let newData = Object.entries(this.state.data);
    for(var [key, val] of newData) {
        if(key=='assertId'||key=='tokenURI'){
          continue;
        }
        arrList.push({
          key:key, 
          val:val
        });
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
                  arrList.products?arrList.products.map((detail, index) => <Accordion.Panel key={index} header={'Item#' + (index + 1)} className='pad'>
                    <Item wrap extra={detail.sku}>sku</Item>
                    <Item wrap extra={detail.producedIn}>producedIn</Item>
                    <Item wrap extra={detail.specName}>specName</Item>
                    <Item wrap extra={detail.amount}>amount</Item>
                    <Item wrap extra={detail.weight + detail.unit}>totalWeight</Item>
                  </Accordion.Panel>):null
                }
          </Accordion>
        </div>
          {this.renderButtons()}
      </div>
    )
  }
}
