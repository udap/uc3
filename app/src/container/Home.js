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
    warrantCode: 'W1803152',
    productName: 'corn',
    status: 'pledge',
    totalWeight: '69kg'
  },
  {
    id: '2',
    warrantCode: 'W1803151',
    productName: 'garlic',
    status: '',
    totalWeight: '144kg'
  },
  {
    id: '3',
    warrantCode: 'W1803153',
    productName: 'walnut',
    status: 'pledge',
    totalWeight: '144kg'
  },
  {
    id: '4',
    warrantCode: 'W1803152',
    productName: '',
    status: '',
    totalWeight: '144kg'
  },
  {
    id: '5',
    warrantCode: 'W1803151',
    productName: 'walnut',
    status: 'pledge',
    totalWeight: '144kg'
  },
  {
    id: '6',
    warrantCode: 'W1803153',
    productName: 'corn',
    status: 'pledge',
    totalWeight: '144kg'
  }
]

export default class extends React.Component {
  componentWillMount () {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

   /* getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    }) */
  }

  render () {
    return (
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
              data.map((data, index) => <NoticeBar key={index} marqueeProps={{ loop: false, style: { padding: '0 7.5px' } }}>{data.warrantCode}</NoticeBar>)
            }
          </Carousel>
          {
              data.map((data, index) => <List key={data.id} data={data} products={products} />)
            }
        </WingBlank>
        <WhiteSpace size='lg' />
      </div>
    )
  }
}
