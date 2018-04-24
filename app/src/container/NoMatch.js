import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class NoMatch extends Component {
  render () {
    return (
      <div className='center-center-column' style={{height: '100vh'}}>
        <span className='font-26'>404!The page has not been found, please</span>
        <Link to='/' className='font-36 main-color'>Return to the home page</Link>
      </div>
    )
  }
}
