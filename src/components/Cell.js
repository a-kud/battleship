import React, { Component } from 'react'
import { object, string } from 'prop-types'

class Cell extends Component {
  static propTypes = {
    coord: object.isRequired,
    type: string,
    label: string
  }

  static defaultProps = {
    className: 'sea'
  }

  handleClick = () => {
    const { coord, label, isUserSetupDone } = this.props
    if (isUserSetupDone && label === 'Opponent') {
      this.props.onClick(coord.x, coord.y)
    }
    if (label === 'Self' && !isUserSetupDone) {
      this.props.onClick(coord.x, coord.y)
    }
  }

  render () {
    const { type, label } = this.props
    const className = label === 'Self' ? type : /* 'fog ' + */ type
    return <div className={className} onClick={this.handleClick} />
  }
}

export default Cell
