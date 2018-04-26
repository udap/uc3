import React, { Component } from 'react'
import { NavBar,List, Button, WhiteSpace, WingBlank,Modal,Toast} from 'antd-mobile';
import IssueSKU from './IssueSKU';
import validate from 'validate.js';
import {Warrant} from "../data/warrant";

class Issue extends Component {
  constructor (props) {
    super(props)
    this.state = {
      arrSku: [],
      warrant:{},
      errorMsg:null,
      modal:false,
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
  handleToggleComplete=(taskId,sku)=>{
    let data = this.state.arrSku
    console.log(typeof data,sku)
    for (let item of data) {
      if (item.id === taskId) {
        item.sku=sku.sku;
        item.origin=sku.origin;
        item.specName=sku.specName;
        item.number=sku.number;
        item.unit=sku.unit;
        item.weight=sku.weight;
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
    var d = new Date().getTime()
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
    function (c) {
      var r = (d + Math.random() * 16) % 16 | 0
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
        'number': '',
        'unit': '',
        'weight': ''
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

   _validate = () => {
      var constraints = {
          "owner":{ presence: {message:'^owner is required'}},
          "supervise":{ presence: {message:'^supervise is required'}},
          "product":{ presence: {message:'^product is required'}},
          "total":{ presence: {message:'^total is required'}},
          "code":{presence: {message:'^code is required'}},
          "address":{presence: {message:'^address is required'}}
        }
      var  warrant  = this.state.warrant;
      var attributes = {
          "owner":warrant.owner,
          "supervise":warrant.supervise,
          "product":warrant.product,
          "total":warrant.total,
          "code":warrant.code,
          "address":warrant.address
      };
      var errors = validate(attributes,constraints);
      
      if (errors) {
          var result = "",attr;
          for(attr in errors) {
              result = result + "<li><span>"+errors[attr]+"</span></li>";
          }
          result = result + "";
          return (<div style={{textAlign:'left'}} dangerouslySetInnerHTML={{__html:result}}></div>)
      }
      this.handleToggleComplete();
      var newWarrant = {};
      newWarrant.owner = warrant.owner;
      newWarrant.supervise = warrant.supervise;
      newWarrant.product = warrant.product;
      newWarrant.total = warrant.total;
      newWarrant.code = warrant.code;
      newWarrant.address = warrant.address;
      if(!validate.isEmpty(this.state.arrSku)){
        newWarrant.arrSku = this.state.arrSku;
      }
      this.newWarrant = newWarrant;
      return false;
  }


  onSubmit = (e) => {
    e.preventDefault();
    var errorMsg = this._validate();
    if (errorMsg) {
        this.setState({
          modal:true,
          errorMsg:errorMsg
        })
    }
  }
  listProducts(){
     return this.state.arrSku.map(
         sku => <IssueSKU id={sku.id} key={sku.id} task={sku.sku} toggleComplete={this.handleToggleComplete}
            deleteTask={this.handleTaskDelete} />
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
            {this.state.errorMsg }
          </div>
        </Modal>
      </div>
    )
  }
}






export default Issue