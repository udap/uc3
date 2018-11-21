/* ArrayTable */
import * as React from 'react'
import './App.css'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import TextField from '@material-ui/core/TextField';


export class ArrayTable extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: props.value ? props.value : [],
      items: props.items,
      title:props.title
    }

    this.handleTaskDelete = this.handleTaskDelete.bind(this)
    this.handleAddItem = this.handleAddItem.bind(this)
    this.handleTaskModify = this.handleTaskModify.bind(this)
  }

  componentDidMount () {
    //console.log("items",this.state.items)
    if (this.state.data) {
      for (var i = 0; i < this.state.data.length; i++) {
        this.state.data[i].id = this.generateUUID()
      }
      this.setState({})
    }
  }

  handleTaskDelete (taskId) {
    let data = this.state.data
    let newData = data.filter(item => item.id !== taskId)
    this.setState({
      data: newData
    })
    this.props.onClick({value: newData })
  }

  handleTaskModify (taskId, name, value) {
    let data = this.state.data
    for (let item of data) {
      if (item.id === taskId) {
        item[name] = value
      }
    }
    this.setState({
      data: data
    })
    this.props.onClick({value: data })
  }

  generateUUID () { // 生成全局唯一标识符【固定算法】
    var d = new Date().getTime()
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
    function (c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    }
    )
    return uuid
  };

  handleAddItem () {
    let newItem = {
      'id': this.generateUUID()
    }
    let data = this.state.data
    data = data.concat([newItem])
    this.setState({
      data: data
    })
    //console.log('data', data)
    this.props.onClick({value: data })
  }

  render () {
    var taskList = this.state.data ? this.state.data.map((listItem, index) =>
      <TodoItem key={index}
        taskId={listItem.id}
        listItem={listItem}
        items={this.state.items}
        title={this.state.title}
        deleteTask={this.handleTaskDelete}
        modifyTask={this.handleTaskModify} />
       ) : <span>No data</span>

    return <div className='todoList'>
      <div className='cont'>
        <h2>
        {this.state.title}
        </h2>
        {this.state.data.length>=1?taskList:<h3>No data</h3>}
      </div>
      <AddItem handleAddItem={this.handleAddItem} />
    </div>
  }
}
/* TodoItem */
class TodoItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false,
      listItem: this.props.listItem,
      properties: this.props.items.properties[this.props.title].items.properties,
      required: this.props.items.properties[this.props.title].items.required
    }
    this.deleteTask = this.deleteTask.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount () {
    for (var key in this.state.properties) {
      this.state[key] = this.state.listItem[key] ? this.state.listItem[key] : ''
      this.setState({})
    }
  }

  deleteTask () {
    this.setState({ open: true });
    
  }

  handleClose = (e) => {
    if(e.target.innerHTML=='Yes'){
      this.props.deleteTask(this.props.taskId)
    }
    this.setState({ open: false });
  };

  handleChange = name => event => {
    let name = event.target.name
    let value = event.target.value
    this.setState({
      [name]: event.target.value,
    });
    this.props.modifyTask(this.props.taskId, name, value)
  };

  render () {
    let listItem = this.state.listItem
    let properties = this.state.properties
    let required = this.state.required
    let newList = []
    return <div className="card">
        <Card>
          <CardContent>
            <div className="text-right">
              <Button variant='fab' aria-label='Delete' onClick={this.deleteTask}>
                <DeleteIcon />
              </Button>
            </div> 
            
            <Dialog
              open={this.state.open}
              onClose={this.handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete the selected objects?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                  No
                </Button>
                <Button onClick={this.handleClose} color="primary" autoFocus>
                  Yes
                </Button>
              </DialogActions>
            </Dialog>
            {
              Object.keys(properties).map((data, index) => <div key={index}>
              {
                properties[data].type=='string'?
                <TextField
                   id="standard-full-width"
                   label={data}
                   required={required?(data==required[index]?true:false):false}
                   className='capitalization'
                   placeholder="Placeholder"
                   fullWidth
                   value={this.state[data] || ''} 
                   name={data} 
                   onChange={this.handleChange([data])}
                 />:
                 <TextField
                    id="standard-number"
                    label={data}
                    required={required?(data==required[index]?true:false):false}
                    fullWidth
                    className='capitalization'
                    value={this.state[data] || ''} 
                    name={data} 
                    onChange={this.handleChange([data])}
                    type="number"
                  />
               }
              </div>)
            }

          </CardContent>
        </Card>
    </div>
  }
}

/* AddItem*/
class AddItem extends React.Component {
  constructor (props) {
    super(props)
    this.addItem = this.addItem.bind(this)
  }

  addItem () {
    this.props.handleAddItem()
  }

  render () {
    return (
      <label htmlFor='add'>
        <Button variant='fab' color='primary' aria-label='Add' onClick={this.addItem}>
          <AddIcon />
        </Button>
      </label>
    )
  }
}
