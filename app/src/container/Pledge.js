import React, { Component } from 'react'
import { NavBar,List, Button, ImagePicker, WingBlank,Modal,DatePicker,Toast} from 'antd-mobile';
import validate from 'validate.js';

const Item = List.Item
const data = [];
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
class Pledge extends Component {

    constructor (props) {
        super(props)
        this.state = {
            files: data,
            multiple: false,
            modal:false,
            errorMsg:null,
            date:now,
            pledge:{}
        }
    }


  componentWillMount(){
    window.scrollTo(0,0);
  }

     onReset = () => {
       this.setState({
         pledge:{}
       })
       Toast.success('Reset success !!!', 1);
     }


    onChange = (files, type, index) => {
      console.log(files, type, index);
      this.setState({
        files,
      });
    }

    viewBigImg=(files, type, index)=>{
      console.log(files, type, index);
    }

    handleChange = (e) => {
        this.state.pledge[e.target.name] = e.target.value;
        this.setState({
          modal:false
        });
    }

    formatDate=(date)=>{
      /* eslint no-confusing-arrow: 0 */
      const pad = n => n < 10 ? `0${n}` : n;
      const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
      const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
      return `${dateStr} ${timeStr}`;
    }

     _validate = () => {
        var constraints = {
            "borrowing":{ presence: {message:'^borrowing is required'}},
            "period":{ 
              presence: {message:'^period is required'}
            },
            "duration":{ presence: {message:'^duration is required'}},
            "lender":{ presence: {message:'^lender is required'}},
            "contract":{
               presence: {message:'^contract is required'},
               length: {
                minimum: 1,
                message:'^contract is required'
              }
             }
        };
        var pledge = this.state.pledge;
        var attributes = {
            "borrowing":pledge.borrowing,
            "period":this.state.date,
            "duration":pledge.duration,
            "lender":pledge.lender,
            "contract":this.state.files,
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
        var newPledge = {};
        newPledge.borrowing = pledge.borrowing;
        newPledge.period = this.formatDate(this.state.date);
        newPledge.duration = pledge.duration;
        newPledge.lender = pledge.lender;
        newPledge.contract = this.state.files;
        this.newPledge = newPledge;
        return false;
    };

    onClose = key => () => {
      this.setState({
        modal: false,
      });
    }

    onSubmit = (e) =>{
      e.preventDefault();
      var errorMsg = this._validate();
      if (errorMsg) {
          console.log(errorMsg);
          this.setState({
            modal:true,
            errorMsg:errorMsg
          })
      } else {
          console.log(this.newPledge);
      }
    }

    render() {
      const { files } = this.state;
      return (
        <div className="pledge">
        <NavBar
          mode='dark'
          leftContent={<i className='fa fa-chevron-left' />}
          onLeftClick={() => { this.props.history.go(-1) }}
        >Pledge</NavBar>
        <List renderHeader={() => 'Basic Infor'} className='my-list'>
          <Item extra={'W1803151'}>Warehouse receipt</Item>
        </List>

        <List renderHeader={() => 'Financial product'} className='my-list'>
          <Item extra={'Everbright Apple pledge'} wrap>Financial product</Item>
          <Item extra={'Line'}>Line or Offline</Item>
          <Item extra={'10.00%'}>Margin level</Item>
          <Item extra={'8.00%'}>Lending rate</Item>
          <Item extra={'4.00%'}>Service charge</Item>    
        </List>

        <form>
        <List renderHeader={() => 'Pledge'} className='my-list basic'>
        <div className="am-list-item am-input-item am-list-item-middle">
          <label className="am-list-line" htmlFor="borrowing">
              <span className="am-input-label am-input-label-5">Borrowing Balance</span>
              <div className="am-input-control">
                  <input id="borring" className="form-input" type="text" name="borrowing"
                     value={this.state.pledge.borrowing||''} 
                     placeholder="borrowing is required" 
                     onChange={this.handleChange}/>
              </div>
          </label>
        </div>
       <List className="date-picker-list" style={{ backgroundColor: 'white' }}>
        <DatePicker
           mode="date"
           title="Select Date"
           extra="Optional"
           value={this.state.date}
           onChange={date => this.setState({ date })}
         >
           <List.Item arrow="horizontal">Period of pledge</List.Item>
         </DatePicker>
       </List>
        <div className="am-list-item am-input-item am-list-item-middle">
          <label className="am-list-line" htmlFor="borring">
              <span className="am-input-label am-input-label-5">duration(Month)</span>
              <div className="am-input-control">
                  <input id="borring" className="form-input" type="text" name="duration"
                     value={this.state.pledge.duration||''} 
                     placeholder="duration is required" 
                     onChange={this.handleChange}/>
              </div>
          </label>
        </div>
        <div className="am-list-item am-input-item am-list-item-middle">
          <label className="am-list-line" htmlFor="borring">
              <span className="am-input-label am-input-label-5">Lender</span>
              <div className="am-input-control">
                  <input id="borring" className="form-input" type="text" name="lender"
                     value={this.state.pledge.lender||''} 
                     placeholder="lender is required" 
                     onChange={this.handleChange}/>
              </div>
          </label>
        </div>
        
        <div className="am-list-item am-input-item am-list-item-middle">
          <label className="am-list-line" htmlFor="borring">
              <span className="am-input-label am-input-label-5">Contract For Purchase</span>
          </label>
        </div>
          <WingBlank>
             <ImagePicker
               files={files}
               onChange={this.onChange}
               onImageClick={this.viewBigImg}
               selectable={files.length < 5}
               multiple={this.state.multiple}
             />
           </WingBlank>           
        <Item>
          <Button type="primary" inline onClick={this.onSubmit}>Submit</Button>
          <Button type='ghost' inline style={{ marginLeft: '2.5px' }} onClick={this.onReset}>Reset</Button>
        </Item>
        </List>
        </form>  
       <Modal
         visible={this.state.modal}
         transparent
         maskClosable={false}
         onClose={this.onClose('modal')}
         title="Title"
         footer={[{ text: 'Ok', onPress: () => { console.log('ok'); this.onClose('modal')(); } }]}
       >
         <div style={{ height: 100, overflow: 'scroll' }}>
           {
            this.state.errorMsg
           }
         </div>
       </Modal>
        </div>
      );
    }
}

export default Pledge