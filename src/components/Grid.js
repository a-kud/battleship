import React, { Component } from 'react'

import Cell from './Cell'
import { generateQuickGuid } from '../utils/helpers'
import { object, arrayOf, string, bool } from 'prop-types'

class Grid extends Component {
  static propTypes = {
    sea: arrayOf(arrayOf(object)),
    label: string,
    isUserSetupDone: bool
  }

  handleClick = (x, y) => {
    this.props.onClick(x, y)
  }

  render () {
    const { sea, label, isUserSetupDone } = this.props
    const filledSea = sea.map((row, x) => {
      const seaRow = row.map((cell, y) => (
        <Cell
          onClick={this.handleClick}
          coord={{ x: sea[x][y].x, y: sea[x][y].y }}
          type={sea[x][y].type}
          label={label}
          key={generateQuickGuid()}
          isUserSetupDone={isUserSetupDone}
        />
      ))
      return (
        <div className='column' key={generateQuickGuid()}>
          {seaRow}
        </div>
      )
    })
    return <div className='grid'>{filledSea}</div>
  }
}

export default Grid
