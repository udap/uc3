import React, { Component } from 'react'
import Navs from './NavLink'
import { Flex } from 'antd-mobile'
import './index.css'

export default class Nav extends Component {
  render () {
    return (
      <div className='root'>
        <Flex justify='center' align='center'>
          <Navs
            exact
            pathUrl='/'
            icoName={'fa-home'}
            linkName='Home'
                />
          <Navs
            pathUrl='/issue'
            icoName='fa-sticky-note-o'
            linkName='ISSUE'
                />
        </Flex>
      </div>
    )
  }
}
