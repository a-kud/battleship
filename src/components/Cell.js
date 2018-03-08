import React, { Component } from 'react'
import { object, string } from 'prop-types'

class Cell extends Component {
  static propTypes = {
    coord: object.isRequired,
    className: string
  }

  static defaultProps = {
    className: 'sea'
  }

  handleClick = () => {
    const { coord } = this.props
    this.props.onClick(coord.y, coord.x)
  }

  render () {
    const { className } = this.props
    return <div className={className} onClick={this.handleClick} />
  }
}

export default Cell
