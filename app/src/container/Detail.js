import React from 'react'
import { NavBar, List, Accordion, WhiteSpace, Modal, Button, WingBlank, Toast } from 'antd-mobile'
import {
  Link
} from 'react-router-dom'

const Item = List.Item
const prompt = Modal.prompt

const data = {
  'id': 'ErMrD1j',
  'code': 'W1703021',
  'revision': 2,
  'status': 0,
  'locationTag': 'TZQ1001-A1',
  'warehouse': {
    'id': '8o0oPnY',
    'code': 'TZQ1001',
    'name': 'test单位',
    'type': '干库',
    'owner': '测试仓储机构',
    'address': '艺苑西街',
    'city': '通州区',
    'province': '北京市',
    'capacity': 11.00,
    'uom': '吨',
    'ranking': 2,
    'roomCount': 1,
    'products': [],
    'rooms': [],
    'monitored': false
  },
  'issuer': {
    'id': 'lrVrNq6',
    'type': 'WAREHOUSE',
    'name': '测试仓储机构',
    'fullName': '测试仓储机构',
    'primaryPhone': '13811548666',
    'address': '北京市北京市朝阳区五里桥'
  },
  'owner': {
    'id': 'ZNnNBYd',
    'name': '测试存货机构',
    'address': '北京市北京市朝阳区五里桥',
    'primaryPhone': '1111111111111',
    'identityNo': '123123123123123',
    'employerId': 'VP0PwDg',
    'ownerOrgName': '测试仓储机构',
    'ownerOrgId': 'lrVrNq6'
  },
  'product': {
    'id': 'Qz0zmJ1',
    'name': '玉米',
    'categories': [],
    'code': '1004',
    'productSpecs': []
  },
  'totalAmount': 499,
  'totalWeight': {
    'value': 499.00,
    'uom': '吨'
  },
  'totalValue': 0,
  'details': [{
    'sku': '171004100000000',
    'origin': '通辽',
    'shortSpec': 'A级一等粮(霉变<=2%)',
    'amount': 500,
    'unitWeight': {
      'value': 1.00,
      'uom': '吨'
    },
    'checkin': 500,
    'checkout': 0,
    'checkinWeight': 500.00,
    'checkoutWeight': 0,
    'weight': 500.00,
    'uom': '吨'
  }, {
    'sku': '171004101000000',
    'origin': '通辽',
    'shortSpec': 'B级一等粮(霉变>2%)',
    'amount': -1,
    'unitWeight': {
      'value': 1.00,
      'uom': '吨'
    },
    'checkin': 0,
    'checkout': 1,
    'checkinWeight': 0,
    'checkoutWeight': -1.00,
    'weight': -1.00,
    'uom': '吨'
  }],
  'serviceProviders': []
}

export default class Detail extends React.Component {
  componentWillMount () {
    window.scrollTo(0, 0)
  }

  render () {
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
          <Item wrap extra={'cone'}>Product</Item>
          <Item wrap extra={'12'}>Number Of Pieces</Item>
          <Item wrap extra={'144Kg'}>Total Weight</Item>
          <Item wrap extra={'TZQ1002-B1'}>StorageRoom Code</Item>
          <Item wrap extra={'New source storage in bijie area, guizhou province.'}>Warehouse address Code</Item>
          <Item wrap extra={'-'}>Pledge</Item>
          <Item wrap extra={'2018-01-08'}>Creation date</Item>
        </List>
        <List renderHeader={() => 'SKU Infor'} className='my-list' />
        <div style={{ marginTop: 10, marginBottom: 10 }}>
          <Accordion className='my-accordion' onChange={this.onChange}>
            {
                  data.details.map((detail, index) => <Accordion.Panel key={index} header={'SKU' + (index + 1)} className='pad'>
                    <Item wrap extra={detail.sku}>SKU</Item>
                    <Item wrap extra={detail.origin}>Origin</Item>
                    <Item wrap extra={detail.shortSpec}>Spec Name</Item>
                    <Item wrap extra={detail.amount}>Number Of Pieces</Item>
                    <Item wrap extra={detail.unitWeight.value + detail.unitWeight.uom}>Unit weight</Item>
                    <Item wrap extra={detail.weight + detail.uom}>Total Weight</Item>
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
