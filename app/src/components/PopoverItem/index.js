import React, { Component } from 'react'
import { Popover } from 'antd-mobile'
import './index.css'
export default class PopoverItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: this.props.visible?this.props.visible:false
    }
  }

  handleVisibleChange = (visible) => {
    this.setState({
      visible,
    });
    this.props.handleVisibleChange(this.state.visible);
  }

  render () {
    return (
      <Popover 
        overlayClassName='fortest'
        visible={this.state.visible}
        overlay={[(<Popover.Item key='4' value={this.props.value} data-seed='logId'>{this.props.value}</Popover.Item>)]}
        onVisibleChange={this.handleVisibleChange}
        >
        <div style={{
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
        }}>
        {this.props.value}
        </div>
      </Popover>
    )
  }
}
