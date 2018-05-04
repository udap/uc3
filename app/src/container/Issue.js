import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import { NavBar,List, Button, WhiteSpace, WingBlank,Modal,Toast,Accordion} from 'antd-mobile';
import validate from 'validate.js';
import {Warrant,Product} from "../data/warrant";
import { default as contract } from 'truffle-contract';
import assetRegistry_artifacts from '../../../build/contracts/AssetRegistry.json'
import Item from './Item'

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
          "recipient":{ presence: {message:'^recipient is required'}},
          "warrantCode":{presence: {message:'^warrantCode is required'}},
          "productName":{ presence: {message:'^productName is required'}},
          "totalWeight":{ 
            presence: {message:'^totalWeight is required'},
            numericality: {greaterThan: 0}
          },
          "storageRoomCode":{ presence: {message:'^storageRoomCode is required'}},
          "warehouseAddress":{presence: {message:'^warehouseAddress is required'}}
        }
      let  warrant  = this.state.warrant;
      let attributes = {
          "recipient":warrant.recipient,
          "warrantCode":warrant.warrantCode,
          "productName":warrant.productName,
          "totalWeight":warrant.totalWeight,
          "storageRoomCode":warrant.storageRoomCode,
          "warehouseAddress":warrant.warehouseAddress
      };
       let errors = validate(attributes,constraints);
      if (errors) {
          let result = "",attr;
          for(attr in errors) {
              result = result + "<li><span>"+errors[attr]+"</span></li>";
          }
          result = result + "";
          return (<div style={{textAlign:'left'}} dangerouslySetInnerHTML={{__html:result}}></div>)
      }
      return false;
  };
  getData =  () => {
        let amount = 0;
        for(let i = 0; i< this.state.warrant.arrSku.length-1 ; i++){
            // let product  = new Product(arrSku[i].sku,arrSku[i].producedIn,arrSku[i].specName,arrSku[i].amount,arrSku[i].weight,arrSku[i].unit);
            let amount = arrSku[i].value;
            let weight = arrSku[i].weight;
            if(unit == "KG")
                amount += weight*amount*2;
            else if (unit == "TON")
                amount +=  weight*amount*2000;
            else
                amount +=  weight*amount;
        }
        let totalWeight = amount+"JIN";
        if(amount > 2000){
            totalWeight = amount / 2000.0 +"TON";
        }
        let  warrant  = this.state.warrant;
        let result = new Warrant(warrant.warrantCode,warrant.productName,totalWeight,warrant.storageRoomCode,warrant.warehouseAddress,this.state.warrant.arrSku);
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
    let AssetRegistry = contract(assetRegistry_artifacts);
    AssetRegistry.setProvider(window.web3.currentProvider);
    AssetRegistry.deployed().then(function (instance) {
        Toast.loading('Loading...',0);
        return instance.createAsset("",true,false,JSON.stringify(self.getData()),"",{from:window.account});
    }).then(function (result) {
        Toast.hide()
        self.props.history.push( '/',null)
    }).catch(function (e) {
        Toast.offline('There was an error fetching your accounts!!!', 3)
    });

  };

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
      <div>{
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
         rightContent={<i className="fa fa-plus"  onClick={this.onAddClick} ></i>}>ISSUE</NavBar>
          <form>
          <List renderHeader={() => 'Basic Info'} className="basic" >
          <div className="am-list-item am-input-item am-list-item-middle">
            <label className="am-list-line" htmlFor="borring">
                <span className="am-input-label am-input-label-5">Recipient</span>
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
                  <span className="am-input-label am-input-label-5">Warrant Code</span>
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
                <span className="am-input-label am-input-label-5">Product Name</span>
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
                <span className="am-input-label am-input-label-5">Total Weight</span>
                <div className="am-input-control">
                    <input id="borring" className="form-input" type="text" name="totalWeight"
                       value={this.state.warrant.totalWeight ||''}
                       placeholder="Please fill in Total Weight"
                       onChange={this.handleChange}/>
                </div>
            </label>
          </div>
          <div className="am-list-item am-input-item am-list-item-middle">
            <label className="am-list-line" htmlFor="borring">
                <span className="am-input-label am-input-label-5">StorageRoom Code</span>
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
                <span className="am-input-label am-input-label-5">Warehouse address</span>
                <div className="am-input-control">
                    <input id="borring" className="form-input" type="text" name="warehouseAddress"
                       value={this.state.warrant.warehouseAddress ||''}
                       placeholder="Please fill in Warehouse Address"
                       onChange={this.handleChange}/>
                </div>
            </label>
          </div>  
          <WhiteSpace/>
            <List renderHeader={() => 'Items'} className="basic">
              {this.listProducts()}
            </List>
          <WhiteSpace/>
          <WingBlank>
                <Button type="primary" inline onClick={this.onSubmit}>Submit</Button>
          </WingBlank>    
          </List>
        </form>        
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