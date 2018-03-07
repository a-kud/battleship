import React, { Component } from 'react'
import { object } from 'prop-types'

class Cell extends Component {
  static propTypes = {
    coord: object.isRequired
  }
  handleClick = () => {
    console.log(this.props.coord)
  }
  render () {
    return <div className='sea' onClick={this.handleClick} />
  }
}

export default Cell
