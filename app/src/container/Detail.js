import React from 'react'
import { NavBar, List, Accordion, WhiteSpace, Modal, Button, WingBlank, Toast } from 'antd-mobile'
import {
  Link
} from 'react-router-dom'

const Item = List.Item
const prompt = Modal.prompt
export default class Detail extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: props.location.state ? props.location.state : {}
    }
  }

  componentWillMount () {
    window.scrollTo(0, 0)
  }

  render () {
    const data = this.state.data
    return (
      <div className='detail'>
        <NavBar
          mode='dark'
          leftContent={<i className='fa fa-chevron-left' />}
          onLeftClick={() => { this.props.history.go(-1) }}
        >Detail</NavBar>
        <List renderHeader={() => 'Basic Infor'} className='my-list basic'>
          <Item wrap extra={'0xcD86431E62Bca1F4Fbef76669D3FB22B90fc83b1'}>Owner</Item>
          <Item wrap extra={'0xcD86431E62Bca1F4Fbef76669D3FB22B90fc83b1'}>Supervise</Item>
          <Item wrap extra={data.productName}>Product</Item>
          <Item wrap extra={''}>Number Of Pieces</Item>
          <Item wrap extra={data.totalWeight}>Total Weight</Item>
          <Item wrap extra={data.storageRoomCode}>StorageRoom Code</Item>
          <Item wrap extra={data.warehouseAddress}>Warehouse address Code</Item>
          <Item wrap extra={'-'}>Pledge</Item>
          <Item wrap extra={'2018-01-08'}>Creation date</Item>
        </List>
        <List renderHeader={() => 'SKU Infor'} className='my-list' />
        <div style={{ marginTop: 10, marginBottom: 10 }}>
          <Accordion className='my-accordion' onChange={this.onChange}>
            {
                  this.state.data.products.map((detail, index) => <Accordion.Panel key={index} header={'SKU' + (index + 1)} className='pad'>
                    <Item wrap extra={detail.sku}>SKU</Item>
                    <Item wrap extra={detail.origin}>Origin</Item>
                    <Item wrap extra={detail.specName}>Spec Name</Item>
                    <Item wrap extra={detail.numberOfPieces}>Number Of Pieces</Item>
                    <Item wrap extra={detail.weight + detail.unit}>Total Weight</Item>
                  </Accordion.Panel>)
                }
          </Accordion>
        </div>

        <WhiteSpace size='lg' />

        <WingBlank>
          <Link to={{pathname: '/pledge', state: data}}>
            <p className='btn'>PLEDGE</p>
          </Link>
          <WhiteSpace size='lg' />
          <Button type='primary' onClick={() => prompt('Transfer', 'please input Recipient address',
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
             >TRANSFER</Button>

        </WingBlank>

        <WhiteSpace size='lg' />
      </div>
    )
  }
}
