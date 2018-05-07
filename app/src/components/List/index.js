import React from 'react'
import {Link} from 'react-router-dom'
import { WhiteSpace, Card} from 'antd-mobile'

const List = ({warrant, index, productsList}) => {
  const iconMap = {created: 'fa-calendar-o', accepted: 'fa-calendar-check-o', issued: 'fa-calendar-plus-o'}
  let products = warrant.products
  let iconStatu = <i style={{color: '#f30'}} className={`fa ${iconMap['issued']}`} />
  return (
    <div key={index}>
      <WhiteSpace size='lg' />
      <Card className='home-card'>
        <Card.Header
          title={'Code：' + warrant.warrantCode}
          extra={iconStatu}
        />
        <Card.Body>
          <ul>
            <li>issue:<strong>{warrant.issue}</strong></li>
            <li>owner:<strong>{warrant.owner}</strong></li>
            <li>product:<strong>{warrant.productName}</strong></li>
          </ul>
        </Card.Body>
        <Card.Footer content='' extra={<Link to={{pathname: '/warrant', state: warrant}} className={`cf last-no-border ${root}`}><div className='more'>MORE</div></Link>} />

      </Card>
      <WhiteSpace size='lg' />
    </div>
  )
}

export default List
