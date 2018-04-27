import React, { Component } from 'react'
import { NavBar,List, Button, WhiteSpace, WingBlank,Modal,Toast,Accordion} from 'antd-mobile';
import validate from 'validate.js';
import {Warrant,Product} from "../data/warrant";
import { default as contract } from 'truffle-contract';
import assetRegistry_artifacts from '../../../build/contracts/AssetRegistry.json'

class Issue extends Component {
  constructor (props) {
    super(props)
    this.state = {
      arrSku: [],
      warrant:{},
      errorMsg:null,
      modal:false,
      skuMsg:null
    }
  }
  componentWillMount () {
    window.scrollTo(0, 0)
  }
  
  onReset = () => {
    this.setState({
      warrant:{}
    })
   Toast.success('Reset success !!!', 1);
 }

  onClose = key => () => {
      this.setState({
        modal: false,
      });
  }
  handleToggleComplete=(taskId,name,value)=>{
    let data = this.state.arrSku
    for (let item of data) {
      if (item.id === taskId) {
        item[name]=value;
      }
    }
    this.setState({
      arrSku: data
    })
}

  handleTaskDelete=(taskId)=>{
    let skus = this.state.arrSku
    this.setState({
      arrSku: skus.filter(sku => sku.id !== taskId)
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
        'origin': '',
        'specName': '',
        'numberOfPieces': '',
        'weight': '',
        'unit': 'JIN'
      }

      let skus = this.state.arrSku.concat([newSku])
      this.setState({
        arrSku: skus
      })
  } 

  handleChange = (e) => {
      this.state.warrant[e.target.name] = e.target.value;
      this.setState({
        modal:false
      })
  }
  handleSkuChange = (id,e) => {
      this.setState({
        [e.target.name]:e.target.value,
        modal:false
      })
      this.handleToggleComplete(id,e.target.name,e.target.value)
  }

  skuErrorMsg=(msg)=>{
    this.setState({
      modal:true,
      skuMsg:msg
    })
  }

  _validateSKU = (id) => {
       let constraints = {
           "sku":{presence: {allowEmpty: false}},
           "origin":{presence: {allowEmpty: false}},
           "specName":{presence: {allowEmpty: false}},
           "numberOfPieces":{presence: {allowEmpty: false}},
           "weight":{
              presence: {allowEmpty: false},
              numericality: {greaterThan: 0}
            }
         }
       let arrSku = this.state.arrSku;
       let sku = {};
       for (let item of arrSku) {
         if (item.id === id) {
              sku.sku=item.sku;
              sku.origin=item.origin;
              sku.specName=item.specName;
              sku.numberOfPieces=item.numberOfPieces;
              sku.unit=item.unit;
              sku.weight=item.weight;
         }
       }
       let attributes = {
           "sku":sku.sku,
           "origin":sku.origin,
           "specName":sku.specName,
           "numberOfPieces":sku.numberOfPieces,
           "weight":sku.weight,
       };
       let errors = validate(attributes,constraints);
       if (errors) {
           var result = "",attr;
           for(attr in errors) {
               result = result + "<li><span>"+errors[attr]+"</span></li>";
           }
           result = result + "";
           return (<div style={{textAlign:'left'}} dangerouslySetInnerHTML={{__html:result}}></div>)
       }
       return false;
   }


   _validate = () => {
      let constraints = {
          "owner":{ presence: {message:'^owner is required'}},
          "supervise":{ presence: {message:'^supervise is required'}},
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
          "owner":warrant.owner,
          "supervise":warrant.supervise,
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
      let newWarrant = {};
      newWarrant.owner = warrant.owner;
      newWarrant.supervise = warrant.supervise;
      newWarrant.warrantCode = warrant.warrantCode;
      newWarrant.productName = warrant.productName;
      newWarrant.totalWeight = warrant.totalWeight;
      newWarrant.storageRoomCode = warrant.storageRoomCode;
      newWarrant.warehouseAddress = warrant.warehouseAddress;
      if(!validate.isEmpty(this.state.arrSku)){
        newWarrant.arrSku = this.state.arrSku;
      }
      this.newWarrant = newWarrant;
      return false;
  };
  getData =  () => {
        let amount = 0;
        for(let i = 0; i< arrSku.length-1 ; i++){
            // let product  = new Product(arrSku[i].sku,arrSku[i].origin,arrSku[i].specName,arrSku[i].numberOfPieces,arrSku[i].weight,arrSku[i].unit);
            let numberOfPieces = arrSku[i].value;
            let weight = arrSku[i].weight;
            if(unit == "KG")
                amount += weight*numberOfPieces*2;
            else if (unit == "TON")
                amount +=  weight*numberOfPieces*2000;
            else
                amount +=  weight*numberOfPieces;
        }
        let totalWeight = amount+"JIN";
        if(amount > 2000){
            totalWeight = amount / 2000.0 +"TON";
        }
        let  warrant  = this.state.warrant;
        let result = new Warrant(warrant.warrantCode,warrant.productName,warrant.totalWeight,warrant.storageRoomCode,warrant.warehouseAddress,this.state.arrSku);
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
    if(!validate.isEmpty(this.state.arrSku)){
      for (let item of this.state.arrSku) {
        var errorMsgsku = this._validateSKU(item.id);
        if (errorMsgsku) {
           this.setState({
             modal:true,
             errorMsg:errorMsgsku
           })
        }
      }
    console.log("this.newWarrant",this.newWarrant)
      return;
    }
    let AssetRegistry = contract(assetRegistry_artifacts);
    AssetRegistry.setProvider(window.web3.currentProvider);
    AssetRegistry.deployed().then(function (instance) {
        return instance.createAsset("",true,false,JSON.stringify(self.getData()),"",{from:window.account});
    }).then(function (result) {
        window.location.href="/";
    }).catch(function (e) {
        console.log(e)
    });

  };

  listProducts(){
     return this.state.arrSku.map((sku,index)=> <div key={index} style={{ marginTop: 10, marginBottom: 10 }}>
        <Accordion  defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
          <Accordion.Panel header={`SKU`}>
             
              <div className="am-list-item am-input-item am-list-item-middle">
                <label className="am-list-line" htmlFor="borring">
                    <span className="am-input-label am-input-label-5">SKU</span>
                    <div className="am-input-control">
                        <input id="borring" className="form-input" type="text" name="sku"
                           value={sku.sku||''} 
                           placeholder="sku is required" 
                           onChange={this.handleSkuChange.bind(this,sku.id)}/>
                    </div>
                </label>
              </div>
              <div className="am-list-item am-input-item am-list-item-middle">
                <label className="am-list-line" htmlFor="borring">
                    <span className="am-input-label am-input-label-5">Origin</span>
                    <div className="am-input-control">
                        <input id="borring" className="form-input" type="text" name="origin"
                           value={sku.origin||''} 
                           placeholder="origin is required" 
                           onChange={this.handleSkuChange.bind(this,sku.id)}/>
                    </div>
                </label>
              </div>
              <div className="am-list-item am-input-item am-list-item-middle">
                <label className="am-list-line" htmlFor="borring">
                    <span className="am-input-label am-input-label-5">SpecName</span>
                    <div className="am-input-control">
                        <input id="borring" className="form-input" type="text" name="specName"
                           value={sku.specName||''} 
                           placeholder="specName is required" 
                           onChange={this.handleSkuChange.bind(this,sku.id)}/>
                    </div>
                </label>
              </div>
              <div className="am-list-item am-input-item am-list-item-middle">
                <label className="am-list-line" htmlFor="borring">
                    <span className="am-input-label am-input-label-5">Number Of Pieces</span>
                    <div className="am-input-control">
                        <input id="borring" className="form-input" type="text" name="numberOfPieces"
                           value={sku.numberOfPieces||''} 
                           placeholder="numberOfPieces is required" 
                           onChange={this.handleSkuChange.bind(this,sku.id)}/>
                    </div>
                </label>
              </div>
              <div className="am-list-item am-input-item am-list-item-middle">
                <label className="am-list-line" htmlFor="borring">
                    <span className="am-input-label am-input-label-5">Unit Weight</span>
                    <div className="am-input-control">
                        <input id="borring" className="form-input" type="text" name="weight"
                           value={sku.weight||''} 
                           placeholder="weight is required" 
                           onChange={this.handleSkuChange.bind(this,sku.id)}/>
                    </div>
                    <div className="am-input-control">
                        <select className="forss" name="unit" style={{textAlign:'center'}} value={sku.unit||''} 
                            onChange={this.handleSkuChange.bind(this,sku.id)}>
                        <option value='JIN'>&nbsp;&nbsp;JIN</option>
                        <option value='KG'>&nbsp;&nbsp;KG</option>
                        <option value='TON'>&nbsp;&nbsp;Ton</option>
                    </select>
                    </div>
                </label>
              </div>
              <WingBlank style={{textAlign:'right'}}>
                <Button type="warning" inline size="small"  onClick={this.handleTaskDelete.bind(this,sku.id)} >
                  <i className="fa fa-remove" ></i>&nbsp;&nbsp;delate sku
                </Button>
              </WingBlank>
              </Accordion.Panel>              
        </Accordion>
      </div>
      );
  }

  render(){
   return (
      <div className='issue'>
         <NavBar mode='light'>ISSUE</NavBar>
          <form>
          <List renderHeader={() => 'Basic Infor'} className="basic" >
          <div className="am-list-item am-input-item am-list-item-middle">
            <label className="am-list-line" htmlFor="borring">
                <span className="am-input-label am-input-label-5">Owner</span>
                <div className="am-input-control">
                    <input id="borring" className="form-input" type="text" name="owner"
                       value={this.state.warrant.owner||''}
                       placeholder="owner is required" 
                       onChange={this.handleChange}/>
                </div>
            </label>
          </div>
          <div className="am-list-item am-input-item am-list-item-middle">
            <label className="am-list-line" htmlFor="borring">
                <span className="am-input-label am-input-label-5">Supervise</span>
                <div className="am-input-control">
                    <input id="borring" className="form-input" type="text" name="supervise"
                       value={this.state.warrant.supervise||''}
                       placeholder="supervise is required" 
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
                             placeholder="Warrant Code is required"
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
                       placeholder="Product Name is required"
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
                       placeholder="Total Weight is required"
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
                       placeholder="StorageRoom code is required"
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
                       placeholder="Warehouse Address is required"
                       onChange={this.handleChange}/>
                </div>
            </label>
          </div>         
          </List>

           <List renderHeader={() => 'Add New Product'} className='my-list' />        
           <WingBlank>
               <Button onClick={this.onAddClick} >
               <i className="fa fa-plus" ></i>&nbsp;&nbsp;Add New Product
               </Button>
           </WingBlank>
           <WhiteSpace/>
           <ul>
              {this.listProducts()}
           </ul>
           <WhiteSpace/>
           <WingBlank>
               <WhiteSpace/>
                 <Button type="primary" onClick={this.onSubmit}>Submit</Button>
               <WhiteSpace/>
                 <Button type="ghost" onClick={this.onReset}>Reset</Button>
           </WingBlank>
        </form>
        
        <Modal
          visible={this.state.modal}
          transparent
          maskClosable={false}
          onClose={this.onClose('modal')}
          title="error"
          footer={[{ text: 'Ok', onPress: () => { this.onClose('modal')(); } }]} >
          <div style={{ height: 100, overflow: 'scroll' }}>
            {this.state.errorMsg||this.state.skuMsg}
          </div>
        </Modal>
      </div>
    )
  }
}






export default Issue