import React, { Component } from 'react'
import { object, string } from 'prop-types'

class Cell extends Component {
  static propTypes = {
    coord: object.isRequired,
    type: string,
    className: string
  }

  static defaultProps = {
    className: 'sea'
  }

  handleClick = () => {
    const { coord } = this.props
    this.props.onClick(coord.x, coord.y)
  }

  render () {
    // const { className } = this.props
    const { type } = this.props
    return <div className={type} onClick={this.handleClick} />
  }
}

export default Cell
