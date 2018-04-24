import React from 'react'
import {Link} from 'react-router-dom'
import { WhiteSpace, Card} from 'antd-mobile'

const List = ({data, products}) => {
  const mapPro = {corn: products.corn, garlic: products.garlic, walnut: products.walnut}
  return (
    <Link to={{pathname: '/warrant', state: data}} className={`cf last-no-border ${root}`}>
      <WhiteSpace size='lg' />
      <Card className='home-card'>
        <Card.Header
          title={'Warehouse Receipt：' + data.warrantCode}
          thumb={mapPro[data.productName]}
          extra={<span className='warn-text'>{data.status}</span>}
        />
        <Card.Body>
          <ul>
            <li>Total:<strong>{data.totalWeight}</strong></li>
          </ul>
        </Card.Body>
        <Card.Footer content='' extra={<div>MORE</div>} />
      </Card>
      <WhiteSpace size='lg' />
    </Link>
  )
}

export default List
