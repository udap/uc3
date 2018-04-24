import React from 'react'
import { NavBar, WhiteSpace, Carousel, WingBlank, NoticeBar} from 'antd-mobile'
import List from '../components/List'
import corn from '../img/corn.jpg'
import walnut from '../img/walnut.jpg'
import garlic from '../img/garlic.jpg'

const products = {
  walnut,
  corn,
  garlic
}
const data = [
  {
    id: '1',
    title: 'Warehouse Receipt：W1803152',
    product: 'corn',
    status: 'pledge',
    total: '69kg'
  },
  {
    id: '2',
    title: 'Warehouse Receipt：W1803151',
    product: 'garlic',
    status: '',
    total: '144kg'
  },
  {
    id: '3',
    title: 'Warehouse Receipt：W1803153',
    product: 'walnut',
    status: 'pledge',
    total: '144kg'
  },
  {
    id: '4',
    title: 'Warehouse Receipt：W1803152',
    product: '',
    status: '',
    total: '144kg'
  },
  {
    id: '5',
    title: 'Warehouse Receipt：W1803151',
    product: 'walnut',
    status: 'pledge',
    total: '144kg'
  },
  {
    id: '6',
    title: 'Warehouse Receipt：W1803153',
    product: 'corn',
    status: 'pledge',
    total: '144kg'
  }
]
const Home = ({ match }) => (
  <div>
    <NavBar mode='light'>WARRANT</NavBar>
    <WhiteSpace size='lg' />
    <WingBlank>
      <Carousel className='my-carousel'
        vertical
        dots={false}
        dragging={false}
        swiping={false}
        autoplay
        infinite
      >
        {
        data.map((data, index) => <NoticeBar key={index} marqueeProps={{ loop: false, style: { padding: '0 7.5px' } }}>{data.title}</NoticeBar>)
      }
      </Carousel>
      {
        data.map((data, index) => <List key={data.id} data={data} products={products} />)
      }
    </WingBlank>
    <WhiteSpace size='lg' />
  </div>
)

export default Home
