import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import { NavBar,List, Button, WhiteSpace, WingBlank,Modal,Toast,Accordion,Icon} from 'antd-mobile';
import validate from 'validate.js';
import {Warrant,Product} from "../data/warrant";
import { default as contract } from 'truffle-contract';
import assetRegistry_artifacts from '../../../build/contracts/AssetRegistry.json'

export default class Item extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      arrSku: [],
      warrant:props.warrant,
      modal:false,
      skuMsg:null
    }
  }
  componentWillMount () {
    window.scrollTo(0, 0)
  }
  
  onBack = (warrant) => {
    this.props.back(warrant);
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
    this.state.warrant.arrSku = data;
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
        'producedIn': '',
        'specName': '',
        'amount': '',
        'weight': '',
        'unit': 'JIN'
      }

      let skus = this.state.arrSku.concat([newSku])
      this.setState({
        arrSku: skus
      })
  } 

  handleSkuChange = (id,e) => {
      this.setState({
        [e.target.name]:e.target.value,
        modal:false
      })
      this.handleToggleComplete(id,e.target.name,e.target.value)
  }

  _validateSKU = (id) => {
       let constraints = {
           "sku":{presence: {allowEmpty: false}},
           "producedIn":{presence: {allowEmpty: false}},
           "specName":{presence: {allowEmpty: false}},
           "amount":{presence: {allowEmpty: false}},
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
              sku.producedIn=item.producedIn;
              sku.specName=item.specName;
              sku.amount=item.amount;
              sku.unit=item.unit;
              sku.weight=item.weight;
         }
       }
       let attributes = {
           "sku":sku.sku,
           "producedIn":sku.producedIn,
           "specName":sku.specName,
           "amount":sku.amount,
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

  onSubmit = (e) => {
    let self = this;
    e.preventDefault();
    if(!validate.isEmpty(this.state.arrSku)){
      for (let item of this.state.arrSku) {
        var errorMsgsku = this._validateSKU(item.id);
        if (errorMsgsku) {
           this.setState({
             modal:true,
             errorMsg:errorMsgsku
           })
         return;
        }
      this.onBack(this.state.warrant);
      }
    }else{
      Toast.info('Please Add New Product!!!', 1);
      return;
    }
  };

  listProducts(){
     return this.state.arrSku.map((sku,index)=> <div key={index} style={{ marginTop: 10, marginBottom: 10 }}>
        {/* <List renderHeader={'Item'} className="my-list">
         <Icon className="delete" type="cross-circle" onClick={this.handleTaskDelete.bind(this,sku.id)}></Icon>
        </List>*/}
        <Accordion  defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
          <Accordion.Panel header={'Item'+(index+1)}>
              <div className="am-list-item am-input-item am-list-item-middle">
                <label className="am-list-line" htmlFor="borring">
                    <span className="am-input-label am-input-label-5">SKU</span>
                    <div className="am-input-control">
                        <input id="borring" className="form-input" type="text" name="sku"
                           value={sku.sku||''} 
                           placeholder="Please fill in sku " 
                           onChange={this.handleSkuChange.bind(this,sku.id)}/>
                    </div>
                </label>
              </div>
              <div className="am-list-item am-input-item am-list-item-middle">
                <label className="am-list-line" htmlFor="borring">
                    <span className="am-input-label am-input-label-5">Produced In</span>
                    <div className="am-input-control">
                        <input id="borring" className="form-input" type="text" name="producedIn"
                           value={sku.producedIn||''} 
                           placeholder="Please fill in produced in " 
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
                           placeholder="Please fill in specName " 
                           onChange={this.handleSkuChange.bind(this,sku.id)}/>
                    </div>
                </label>
              </div>
              <div className="am-list-item am-input-item am-list-item-middle">
                <label className="am-list-line" htmlFor="borring">
                    <span className="am-input-label am-input-label-5">Amount</span>
                    <div className="am-input-control">
                        <input id="borring" className="form-input" type="text" name="amount"
                           value={sku.amount||''} 
                           placeholder="Please fill in amount " 
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
                           placeholder="Please fill in weight " 
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
              {/*<WingBlank style={{textAlign:'right'}}>
                <Button type="warning" inline size="small"  onClick={this.handleTaskDelete.bind(this,sku.id)} >
                  <i className="fa fa-remove" ></i>&nbsp;&nbsp;delate sku
                </Button>
              </WingBlank>*/}
              </Accordion.Panel>              
        </Accordion>
      </div>
      );
  }

  render(){
   return (
      <div className='issue'>
         <NavBar mode='dark'          
          leftContent={<i className='fa fa-chevron-left' />}
            onLeftClick={this.onBack}
      >Item</NavBar>
          <form>
           <List renderHeader={() => 'Add New Item'} className='my-list' />        
           <WingBlank>
               <Button onClick={this.onAddClick} >
               <i className="fa fa-plus" ></i>&nbsp;&nbsp;Add New Item
               </Button>
           </WingBlank>
           <WhiteSpace/>
           <ul>
              {this.listProducts()}
           </ul>
           <WhiteSpace/>
           <div>
           <WingBlank>
                 <Button type="primary" inline onClick={this.onSubmit}>Submit</Button>
                 <Button type="ghost" inline onClick={this.onBack}>Back</Button>
           </WingBlank>
           </div>
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
    )
  }
}