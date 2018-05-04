import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
export default class Navs extends Component {
  render () {
    const { pathUrl, active, icoName, linkName, ...rest } = this.props
    return (
      <NavLink
        {...rest}
        to={pathUrl}
        className={'rootLink'}
        activeClassName={active}
      >
        <i className={'ico fa fa-2x ' + icoName} />
        <p className='text'>{linkName}</p>
      </NavLink >
    )
  }
}
