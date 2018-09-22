import { connect } from 'react-redux'
import { JsonForms } from '@jsonforms/react'
import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { getData } from '@jsonforms/core'
import Grid from '@material-ui/core/Grid'
import './App.css'

const styles = theme => ({
  root: {
    backgroundColor: '#243C9C',
    padding: '1em',
    margin: 0
  },
  cont: {
    backgroundColor: 'white',
    width: '94%',
    padding: '3%'
  },
  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  }
})
class App extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.setState({})
    window.WebViewJavascriptBridge.registerHandler('getParams', function () {
      const dataAsString = this.props.dataAsString
      return dataAsString
    })
    console.log('window', window.WebViewJavascriptBridge)
  }

  componentWillUnmount () {

  }

  componentWillReceiveProps (nextProps) {
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
