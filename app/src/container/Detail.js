import React from 'react'
import { NavBar, List, Accordion, WhiteSpace, Modal, Button, WingBlank, Toast,Flex,Icon } from 'antd-mobile'
import {
  Link
} from 'react-router-dom'
import PopoverItem from '../components/PopoverItem'
const Item = List.Item
const prompt = Modal.prompt
const alert = Modal.alert;

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

  render () {
    const data = this.state.data
    return (
      <div className='detail'>
        <NavBar
          mode='dark'
          icon={<Icon type="left" />}
          leftContent='Detail'
          onLeftClick={() => { this.props.history.go(-1) }}
        ></NavBar>
       
        <List renderHeader={() => 'Basic Infor'} className='my-list basic'>
          <Item wrap extra={<PopoverItem visible={this.state.visible} value='0xcD86431E62Bca1F4Fbef76669D3FB22B90fc83b1' handleVisibleChange={this.handleVisibleChange}/>}>Owner</Item>
          <Item wrap extra={<PopoverItem visible={this.state.visible} value='20xcD86431E62Bca1F4Fbef76669D3FB22B90fc83b1' handleVisibleChange={this.handleVisibleChange}/>}>Supervise</Item>
          <Item wrap extra={data.productName}>Product</Item>
          <Item wrap extra={''}>Number Of Pieces</Item>
          <Item wrap extra={data.totalWeight}>Total Weight</Item>
          <Item wrap extra={data.storageRoomCode}>StorageRoom Code</Item>
          <Item wrap extra={data.warehouseAddress}>Warehouse address Code</Item>
          <Item wrap extra={'-'}>Pledge</Item>
          <Item wrap extra={'2018-01-08'}>Creation date</Item>
        </List>
        <List renderHeader={() => 'Items'} className='my-list'>
        </List>
        <div style={{ marginTop: 10, marginBottom: 10 }}>
          <Accordion className='my-accordion' onChange={this.onChange}>
            {
                  this.state.data.products.map((detail, index) => <Accordion.Panel key={index} header={'Item#' + (index + 1)} className='pad'>
                    <Item wrap extra={detail.sku}>SKU</Item>
                    <Item wrap extra={detail.origin}>Produced in</Item>
                    <Item wrap extra={detail.specName}>Spec Name</Item>
                    <Item wrap extra={detail.numberOfPieces}>Number Of Pieces</Item>
                    <Item wrap extra={detail.weight + detail.unit}>Total Weight</Item>
                  </Accordion.Panel>)
                }
          </Accordion>
        </div>


          {/*<Link to={{pathname: '/pledge', state: data}}>
            <p className='btn'>PLEDGE</p>
          </Link>*/}
          {
            data.status=='issue'?
          <Button type='primary' type="ghost" inline onClick={() => prompt('Transfer', 'please input Recipient address',
            [
              {
                text: 'Close'
              },
              {
                text: 'Submit',
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
            ], 'default', null, ['input your Recipient address'])}
             >TRANSFER</Button>:
              <div className="flex-container"><Flex justify="center">
              <Flex.Item><Button  type='primary'  
                 onClick={() =>
                   alert('Accept', 'Are you sure???', [
                     { text: 'Cancel', onPress: () => console.log('cancel') },
                     { text: 'Ok', onPress: () => console.log('ok') },
                   ])
                 }
               >
                 accept
               </Button></Flex.Item>
              <Flex.Item><Button   type='primary' 
                   onClick={() =>
                     alert('Reject', 'Are you sure???', [
                       { text: 'Cancel', onPress: () => console.log('cancel') },
                       { text: 'Ok', onPress: () => console.log('ok') },
                     ])
                   }
                 >
                   reject
                 </Button></Flex.Item>
                 <Flex.Item><Button  type='warning' 
                     onClick={() =>
                       alert('Delete', 'Are you sure???', [
                         { text: 'Cancel', onPress: () => console.log('cancel') },
                         { text: 'Ok', onPress: () => console.log('ok') },
                       ])
                     }
                   >
                     delete
                   </Button></Flex.Item>
            </Flex></div>
        }

      </div>
    )
  }
}
