import React from 'react'
import {Link} from 'react-router-dom'
import { WhiteSpace, Card} from 'antd-mobile'

const List = ({warrant, index}) => {
  let products = warrant.products
  const mapPro = {corn: products.corn, garlic: products.garlic, walnut: products.walnut}
  return (
    <Link key={index} to={{pathname: '/warrant', state: warrant}} className={`cf last-no-border ${root}`}>
      <WhiteSpace size='lg' />
      <Card className='home-card'>
        <Card.Header
          title={'Warrant Code：' + warrant.warrantCode}
          thumb={mapPro[warrant.productName]}
          extra={<span className='warn-text'>{warrant.status}</span>}
        />
        <Card.Body>
          <ul>
            <li>Total Weight:<strong>{warrant.totalWeight}</strong></li>
            <li>Warehouse address:<strong>{warrant.warehouseAddress}</strong></li>
          </ul>
        </Card.Body>
        <Card.Footer content='' extra={<div>MORE</div>} />
      </Card>
      <WhiteSpace size='lg' />
    </Link>
  )
}

export default List
