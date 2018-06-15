import React from 'react'
import {Link} from 'react-router-dom'
import { WhiteSpace, Card,List} from 'antd-mobile'
import PopoverItem from '../PopoverItem'

const iconMap = {'0': 'fa-calendar-minus-o', '1': 'fa-calendar-check-o', '2': 'fa-calendar-times-o'}
export default class Lists extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      warrant: props.warrant,
      index:props.index,
      visible:false
    }
  }
    componentWillReceiveProps(nextProps) {
      this.setState({
        warrant:nextProps.warrant
      })
    }

  handleVisibleChange = (visible) => {
    this.setState({
      visible
    })
  }

  render(){

    let warrant = this.state.warrant;
    //let state = warrant.state.toString();
    //let iconStatu = <i style={{color: '#f30'}} className={`fa ${iconMap[state]}`} />
    return (
      <div key={this.state.index}>
        <WhiteSpace size='lg' />
        <Card className='home-card'>
          <Card.Header
            title={`Code:${warrant.metaData.warrantCode ? warrant.metaData.warrantCode : '-'}`}
          />
          <Card.Body>
              <List.Item wrap extra={<PopoverItem visible={this.state.visible} value={`${warrant.issuer ? warrant.issuer : '-'}`} handleVisibleChange={this.handleVisibleChange} />}>owner</List.Item>
              <List.Item wrap extra={<PopoverItem visible={this.state.visible} value={`${warrant.owner ? warrant.owner : '-'}`} handleVisibleChange={this.handleVisibleChange} />}>issuer</List.Item>
              <List.Item wrap extra={warrant.productName ? warrant.productName : '-'}>product</List.Item>
          </Card.Body>
          <Card.Footer content='' extra={<Link to={{pathname: '/warrant', state: warrant}} className={`cf last-no-border ${root}`}><div className='more'>MORE</div></Link>} />

        </Card>
        <WhiteSpace size='lg' />
      </div>
    )
  }  
}

