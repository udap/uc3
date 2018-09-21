import { connect } from 'react-redux'
import { JsonForms } from '@jsonforms/react'
import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { getData } from '@jsonforms/core'
import './App.css'

const styles = theme => ({
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
    this.state = {
      date: new Date()
    }
  }

  componentDidMount () {
    this.setState({})
  }

  componentWillUnmount () {

  }

  componentWillReceiveProps (nextProps) {
    this.setState({})
  }

  getParams (e) {
    const data = this.props.dataAsString
    return data
  }

  render () {
    return (
      <div>
        <JsonForms />
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
