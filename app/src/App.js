import { connect } from 'react-redux'
import { JsonForms } from '@jsonforms/react'
import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { getData,getSchema } from '@jsonforms/core'
import Grid from '@material-ui/core/Grid'
import dsBridge from 'dsbridge'
import './App.css'

const styles = theme => ({
  root: {
    padding: '1em',
    margin: 0
  },
  cont: {
    padding: '0px 2%',
    width: '93%'
  }
})
class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      newString:{},
      required:this.props.schema.required
    }
  }

  componentDidMount () {
    dsBridge.registerAsyn('getParams', function (arg1, responseCallback) {
      var responseData = window.newString
      if (responseCallback) {
        console.log('componentDidMountresponseData', responseData)
        responseCallback(responseData)
      }
    })
    this.setState({})
  }

  componentWillUnmount () {
    dsBridge.registerAsyn('getParams', function (arg1, responseCallback) {
      var responseData = window.newString
      if (responseCallback) {
        console.log('componentWillUnmountresponseData', responseData)
        responseCallback(responseData)
      }
    })
    this.setState({})
  }

  componentWillReceiveProps (nextProps) {
    window.newString = nextProps.dataAsString
    this.setState({
      newString:nextProps.dataAsString
    })
  }

  handleSubmit=(e)=>{
 /*   console.log('this.state.newString', this.state.newString,this.state.required)
    let required = this.state.required;
    
    if (JSON.stringify(this.state.newString) === '{}') {
        alert("请输入必填项！")
        return false // 如果为空,返回false
    }
    console.log(e.target.innerHTML)
  */}


  render () {
    const {classes,dataAsString,state} = this.props
    return (
      <div>
        <Grid container className={classes.root}>
          <Grid className={classes.cont} >
            {/*<button onClick={this.handleSubmit.bind(this)} >保存</button>*/}
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
    schema: getSchema(state)
  }
}

export default connect(mapStateToProps, null)(withStyles(styles)(App))
