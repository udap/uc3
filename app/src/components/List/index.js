import React from 'react'
import {Link} from 'react-router-dom'
import { WhiteSpace, Card,List} from 'antd-mobile'
import PopoverItem from '../PopoverItem'


const iconMap = {created: 'fa-calendar-o', accepted: 'fa-calendar-check-o', issued: 'fa-calendar-plus-o'}
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
    let iconStatu = <i style={{color: '#f30'}} className={`fa ${iconMap['issued']}`} />
    let warrant = this.state.warrant;
    return (
      <div key={this.state.index}>
        <WhiteSpace size='lg' />
        <Card className='home-card'>
          <Card.Header
            title={`Code:${warrant.warrantCode ? warrant.warrantCode : '-'}`}
            extra={iconStatu}
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

