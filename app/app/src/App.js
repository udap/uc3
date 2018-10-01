import { connect } from 'react-redux'
import { JsonForms } from '@jsonforms/react'
import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { getData } from '@jsonforms/core'
import Grid from '@material-ui/core/Grid'
import dsBridge from 'dsbridge'
import './App.css'

const styles = theme => ({
  root: {
    padding: '1em',
    margin: 0
  },
  cont: {
    width: '94%',
    padding: '3%'
  }
})
class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    dsBridge.registerAsyn('getParams', function (arg1, responseCallback) {
      var responseData = window.newString
      if (responseCallback) {
        responseCallback(responseData)
      }
    })
    this.setState({})
  }

  componentWillUnmount () {

  }

  componentWillReceiveProps (nextProps) {
    window.newString = nextProps.dataAsString
    this.setState({})
  }

  render () {
    const {classes} = this.props
    return (
      <div>
        <Grid container className={classes.root}>
          <Grid className={classes.cont} >
            <JsonForms />
          </Grid>
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    dataAsString: JSON.stringify(getData(state), null, 2),
    state: state
  }
}

export default connect(mapStateToProps, null)(withStyles(styles)(App))
