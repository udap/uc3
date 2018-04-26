import React from 'react'
import {Link} from 'react-router-dom'
import { WhiteSpace, Card} from 'antd-mobile'

const List = ({warrant, key}) => {
  let products=warrant.products;
  const mapPro = {corn: products.corn, garlic: products.garlic, walnut: products.walnut}
  return (
    <Link to={{pathname: '/warrant', state: warrant}} className={`cf last-no-border ${root}`}>
      <WhiteSpace size='lg' />
      <Card className='home-card'>
        <Card.Header
          title={'Warrant Code：' + warrant.warrantCode}
          thumb={mapPro[warrant.productName]}
          extra={<span className='warn-text'>{warrant.status}</span>}
        />
        <Card.Body>
          <ul>
            <li>Total:<strong>{warrant.totalWeight}</strong></li>
          </ul>
        </Card.Body>
        <Card.Footer content='' extra={<div>MORE</div>} />
      </Card>
      <WhiteSpace size='lg' />
    </Link>
  )
}

export default List
