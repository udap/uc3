import React, { Component } from 'react'
import Navs from './NavLink'
import { Flex } from 'antd-mobile'
import './index.css'

export default class Nav extends Component {
  render () {
    return (
      <div className='flex-container root'>
        <Flex justify='center' align='center'>
          <Navs
            pathUrl='/'
            icoName={'fa-home'}
            linkName='Home'
            index='true'
                />
          <Navs
            pathUrl='/issue'
            icoName='fa-sticky-note-o'
            linkName='ISSUE'
            badge
            index='false'
                />
          {/* <Navs
            pathUrl='/my'
            icoName='fa-user-o'
            active={'navThree'}
            linkName='MY'
          /> */}
        </Flex>
      </div>
    )
  }
}
