import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { Badge } from 'antd-mobile'
export default class Navs extends Component {
  render () {
    const { pathUrl, active, icoName, linkName, badge, ...rest } = this.props
    return (
      <NavLink
        {...rest}
        to={pathUrl}
        className={'rootLink'}
        activeClassName='nav-active'
      >

        {
          badge ? <Badge text={'new'} style={{ marginTop: 7 }}><i className={'ico fa fa-2x ' + icoName} /></Badge>
                : <i className={'ico fa fa-2x ' + icoName} />
        }
        <p className='text'>{linkName}</p>
      </NavLink >
    )
  }
}
