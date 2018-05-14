import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import { NavBar,List,Picker, Button, WhiteSpace, WingBlank,Modal,Toast,Accordion,Icon} from 'antd-mobile';
import validate from 'validate.js';
import {Warrant,Product} from "../data/warrant";
import { default as contract } from 'truffle-contract';
import assetRegistry_artifacts from '../../../build/contracts/AssetRegistry.json'

const units = [
  [
    {
      label: 'JIN',
      value: 'JIN',
    },
    {
      label: 'KG',
      value: 'KG',
    },
    {
      label: 'TON',
      value: 'TON',
    }
  ]
];

export default class Item extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      newSku: props.newSku,
      warrant:props.warrant,
      modal:false,
      skuMsg:null,
      uValue: ['JIN'],
    }
  }
  componentWillMount () {
    window.scrollTo(0, 0)
  }
  
  onBack = (newSku) => {
    this.props.refreshSku(newSku);
 }

  onClose = key => () => {
      this.setState({
        modal: false,
      });
  }

  handleSkuChange = (id,e) => {
    this.state.newSku[e.target.name]=(e.target.name=="amount"||e.target.name=="weight")?parseFloat(e.target.value):e.target.value
      this.setState({
        modal:false
      })
  }
  unitChange=(val)=>{
    this.state.newSku.unit = val[0];
    this.setState({
       uValue: val
     })
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
       let sku = this.state.newSku;
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
    var errorMsgsku = this._validateSKU();
    if (errorMsgsku) {
       this.setState({
         modal:true,
         errorMsg:errorMsgsku
       })
     return;
    }else{
      this.onBack(this.state.newSku);
    }
  };

  listProducts(){
     return <div style={{ marginTop: 10, marginBottom: 10 }}>
 
              <div className="am-list-item am-input-item am-list-item-middle">
                <label className="am-list-line" htmlFor="borring">
                    <div className="am-input-control">
                        <input id="borring" className="form-input" type="text" name="sku"
                           value={this.state.newSku.sku||''} 
                           placeholder="Please fill in sku " 
                           onChange={this.handleSkuChange.bind(this,this.state.newSku.id)}/>
                    </div>
                </label>
              </div>
              <div className="am-list-item am-input-item am-list-item-middle">
                <label className="am-list-line" htmlFor="borring">
                    <div className="am-input-control">
                        <input id="borring" className="form-input" type="text" name="producedIn"
                           value={this.state.newSku.producedIn||''} 
                           placeholder="Please fill in produced in " 
                           onChange={this.handleSkuChange.bind(this,this.state.newSku.id)}/>
                    </div>
                </label>
              </div>
              <div className="am-list-item am-input-item am-list-item-middle">
                <label className="am-list-line" htmlFor="borring">
                    <div className="am-input-control">
                        <input id="borring" className="form-input" type="text" name="specName"
                           value={this.state.newSku.specName||''} 
                           placeholder="Please fill in specName " 
                           onChange={this.handleSkuChange.bind(this,this.state.newSku.id)}/>
                    </div>
                </label>
              </div>
              <div className="am-list-item am-input-item am-list-item-middle">
                <label className="am-list-line" htmlFor="borring">
                    <div className="am-input-control">
                        <input id="borring" className="form-input" type="text" name="amount"
                           value={this.state.newSku.amount||''} 
                           placeholder="Please fill in amount " 
                           onChange={this.handleSkuChange.bind(this,this.state.newSku.id)}/>
                    </div>
                </label>
              </div>
              <div className="am-list-item am-input-item am-list-item-middle">
                <label className="am-list-line" htmlFor="borring">
                    <div className="am-input-control">
                        <input id="borring" className="form-input" type="text" name="weight"
                           value={this.state.newSku.weight||''} 
                           placeholder="Please fill in weight " 
                           onChange={this.handleSkuChange.bind(this,this.state.newSku.id)}/>
                    </div>                    
                </label>
              </div>
              <Picker
                data={units}
                title="select unit"
                cascade={false}
                value={this.state.uValue}
                onChange={this.unitChange}
              >
                <List.Item arrow="horizontal">&nbsp;</List.Item>
              </Picker>
               <WhiteSpace size="lg" />
              <WingBlank>
                    <Button type="primary" onClick={this.onSubmit}>Add Item</Button>
              </WingBlank>   
      </div>
  }

  render(){
   return (
      <div className='issue'>
         <NavBar mode='dark'          
          icon={<Icon type="left" />}
          leftContent='Item'
            onLeftClick={this.props.backIssue}
      ></NavBar>
          <form>
           <WhiteSpace/>
           <ul>
              {this.listProducts()}
           </ul>
           <WhiteSpace/>
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