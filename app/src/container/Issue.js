import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import { NavBar,List, Button, WhiteSpace, WingBlank,Modal,Toast,Accordion,Icon} from 'antd-mobile';
import validate from 'validate.js';
import {Warrant,Product} from "../data/warrant";
import { default as contract } from 'truffle-contract';
import getAssertAddr from '../util/getAssertAddr';
import Item from './Item'
import tokenConfig from "../data/token";
import standardAsset_artifacts from '../../../build/contracts/StandardAsset.json'

const ipfsConfig = require("../config/ipfsConfig") ;
const ipfsAPI = require('ipfs-api');



const AntdItem = List.Item
class Issue extends Component {
  constructor (props) {
    super(props)
    this.state = {
      arrSku:[],
      warrant:{},
      errorMsg:null,
      modal:false,
      addItem:false,
      newSku:{}
    }
  }
  componentWillMount () {
    window.scrollTo(0, 0)
  }

  onClose = key => () => {
      this.setState({
        modal: false,
      });
  }
  handleTaskDelete=(taskId)=>{
    let skus = this.state.arrSku
    this.setState({
      arrSku: skus.filter(sku => sku.id !== taskId)
    })
    this.state.warrant.arrSku = skus.filter(sku => sku.id !== taskId);
  }
  backIssue=()=>{
   this.setState({
     addItem:false
   })
  }

  refreshSku=(sku)=>{
    let item = {
    'sku': sku.sku,
    'producedIn': sku.producedIn,
    'specName': sku.specName,
    'amount': sku.amount,
    'weight': sku.weight,
    'unit': sku.unit
    }
    sku.item = item;
    let skus = this.state.arrSku.concat([sku])
    this.state.warrant.arrSku = skus;
    this.setState({
      arrSku:skus,
      newSku:sku,
      addItem:false
    })
  }

  generateUUID=()=>{ // 生成全局唯一标识符【固定算法】
    let d = new Date().getTime()
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
    function (c) {
      let r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    }
    )
    return uuid
  }


  onAddClick=(e)=> {
      let newSku = {
        'id': this.generateUUID(),
        'sku': '',
        'producedIn': '',
        'specName': '',
        'amount': '',
        'weight': '',
        'unit': 'JIN'
      }

      this.setState({
        newSku:newSku,
        addItem:true
      })
  } 

  handleChange = (e) => {
      this.state.warrant[e.target.name] = e.target.value;
      this.setState({
        modal:false
      })
  }

   _validate = () => {

      let constraints = {
          "recipient":{ 
            presence: {message:'^recipient is required'}
          },
          "warrantCode":{presence: {message:'^warrantCode is required'}},
          "productName":{ presence: {message:'^productName is required'}},
          "storageRoomCode":{ presence: {message:'^storageRoomCode is required'}},
          "warehouseAddress":{presence: {message:'^warehouseAddress is required'}}
        }
      let  warrant  = this.state.warrant;
      let attributes = {
          "recipient":warrant.recipient,
          "warrantCode":warrant.warrantCode,
          "productName":warrant.productName,
          "storageRoomCode":warrant.storageRoomCode,
          "warehouseAddress":warrant.warehouseAddress
      };
       let errors = validate(attributes,constraints);
       let recipient = window.web3.isAddress(warrant.recipient);
      if (errors||!recipient) {
          let result = "",attr;
          for(attr in errors) {
              result = result + "<li><span>"+errors[attr]+"</span></li>";
          }
          if (!recipient) result = result + "<li><span>Please enter the correct 42 bit of recipient!</span></li>";
          result = result + "";
          return (<div style={{textAlign:'left'}} dangerouslySetInnerHTML={{__html:result}}></div>)
      }
      return false;
  };
  getData =  () => {
        let amount = 0;
        let arrSku = this.state.warrant.arrSku;
        let newProducts = [];
        for(let i = 0; i< arrSku.length; i++){
            // let product  = new Product(arrSku[i].sku,arrSku[i].producedIn,arrSku[i].specName,arrSku[i].amount,arrSku[i].weight,arrSku[i].unit);
            let proAmount = arrSku[i].amount;
            let proWeight = arrSku[i].weight;
            let proUnit = arrSku[i].unit;
            if(proUnit == "KG")
                amount += proWeight*proAmount*2;
            else if (proUnit == "TON")
                amount +=  proWeight*proAmount*2000;
            else
                amount +=  proWeight*proAmount;
            newProducts.push(arrSku[i].item);
        }
        let totalWeight = amount+"JIN";
        if(amount > 2000){
            totalWeight = amount / 2000.0 +"TON";
        }
        let  warrant  = this.state.warrant;
        let result = new Warrant(warrant.warrantCode,warrant.productName,totalWeight,warrant.storageRoomCode,warrant.warehouseAddress,newProducts);
        return result;
  };

  onSubmit = (e) => {
    let self = this;
    e.preventDefault();
    var errorMsg = this._validate();
    if (errorMsg) {
        this.setState({
          modal:true,
          errorMsg:errorMsg
        })
    return ;
    }
    if(validate.isEmpty(this.state.warrant.arrSku)){
      Toast.info('Please click the upper right corner to add item!!!', 1);
      return;
    }
    Toast.loading('Loading...',0); 
    getAssertAddr.then(addr => {
        let StandardAsset = contract(standardAsset_artifacts);
        StandardAsset.setProvider(web3.currentProvider);

        StandardAsset.at(addr).then(instance => {
            self.saveMetadata().then(cid => {
                let uri =ipfsConfig.protocol+cid.toBaseEncodedString();
                return instance.mint(self.state.warrant.recipient,uri,{from:window.account});
            });
        }).then(() =>{
            Toast.hide()
            self.props.history.push( '/',null)
        })
    }).catch(function (e) {
        console.log(e)
    });

  };
  saveMetadata(){
      let metadata = JSON.stringify(this.getData());
      let ipfs = ipfsAPI(ipfsConfig.host,ipfsConfig.port,{protocol:ipfsConfig.protocol});
      return ipfs.dag.put(User, { format: 'dag-cbor', hashAlg: 'sha2-256' });
  }

  listProducts(){
     return this.state.warrant.arrSku?this.state.warrant.arrSku.map((sku,index)=> 
      <div key={index} style={{ marginTop: 10, marginBottom: 10 }}>
       <Accordion accordion openAnimation={{}} className="my-accordion" onChange={this.onChange}>
      <Accordion.Panel header={'Item#'+(index+1)} className="pad">
        <List renderHeader={() => <i className="fa fa-remove text-delete" onClick={this.handleTaskDelete.bind(this,sku.id)}></i>} className='my-list basic'>
          <AntdItem wrap extra={sku.sku}>SKU</AntdItem>
          <AntdItem wrap extra={sku.producedIn}>Produced In</AntdItem>
          <AntdItem wrap extra={sku.specName}>SpecName</AntdItem>
          <AntdItem wrap extra={sku.amount}>Amount</AntdItem>
          <AntdItem wrap extra={sku.weight+sku.unit}>Total Weight</AntdItem>
        </List>
      </Accordion.Panel>
      </Accordion>
      </div>
      ):null;
  }

  render(){
   return (
      <div id="issue">{
        this.state.addItem?<Item 
        warrant = {this.state.warrant}
        refreshSku = {this.refreshSku}
        backIssue = {this.backIssue}
        newSku = {this.state.newSku}
         handleToggleComplete = {this.handleToggleComplete}
         >
         </Item>:
        <div className='issue'>
         <NavBar mode='dark'
         icon={<Icon type="left" />}
         leftContent='Issue'
         onLeftClick={() => { this.props.history.go(-1) }}
         rightContent={<i className="fa fa-plus"  onClick={this.onAddClick} ></i>}></NavBar>
          <form>
          <List renderHeader={() => 'Basic Info'} className="basic" >
          <div className="am-list-item am-input-item am-list-item-middle">
            <label className="am-list-line" htmlFor="borring">
                <div className="am-input-control">
                    <input id="borring" className="form-input" type="text" name="recipient"
                       value={this.state.warrant.recipient||''}
                       placeholder="Please fill in Recipient"  
                       onChange={this.handleChange}/>
                </div>
            </label>
          </div>
          <div className="am-list-item am-input-item am-list-item-middle">
              <label className="am-list-line" htmlFor="borring">

                  <div className="am-input-control">
                      <input id="borring" className="form-input" type="text" name="warrantCode"
                             value={this.state.warrant.warrantCode||''}
                             placeholder="Please fill in Warrant Code"
                             onChange={this.handleChange}/>
                  </div>
              </label>
          </div>
          <div className="am-list-item am-input-item am-list-item-middle">
            <label className="am-list-line" htmlFor="borring">
                <div className="am-input-control">
                    <input id="borring" className="form-input" type="text" name="productName"
                       value={this.state.warrant.productName ||''}
                       placeholder="Please fill in Product Name"
                       onChange={this.handleChange}/>
                </div>
            </label>
          </div>
          <div className="am-list-item am-input-item am-list-item-middle">
            <label className="am-list-line" htmlFor="borring">
                <div className="am-input-control">
                    <input id="borring" className="form-input" type="text" name="storageRoomCode"
                       value={this.state.warrant.storageRoomCode ||''}
                       placeholder="Please fill in StorageRoom code"
                       onChange={this.handleChange}/>
                </div>
            </label>
          </div>
          <div className="am-list-item am-input-item am-list-item-middle">
            <label className="am-list-line" htmlFor="borring">
                <div className="am-input-control">
                    <input id="borring" className="form-input" type="text" name="warehouseAddress"
                       value={this.state.warrant.warehouseAddress ||''}
                       placeholder="Please fill in Warehouse Address"
                       onChange={this.handleChange}/>
                </div>
            </label>
          </div>  
          </List> 
          <WhiteSpace/>
            <List renderHeader={() => 'Items'} className="basic"></List>
            {this.listProducts()}
          <WhiteSpace/>  
        </form>    
         <WhiteSpace size="lg" />
        <WingBlank>
              <Button type="primary" onClick={this.onSubmit}>Submit</Button>
        </WingBlank>     
        <Modal
          visible={this.state.modal}
          transparent
          maskClosable={false}
          onClose={this.onClose('modal')}
          title="error"
          footer={[{ text: 'Ok', onPress: () => { this.onClose('modal')(); } }]} >
          <div style={{ height: 100, overflow: 'scroll' }}>
            {this.state.errorMsg}
          </div>
        </Modal>
      </div>
       }</div>
    )
  }
}






export default Issue