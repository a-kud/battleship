import React, { Component } from 'react'

import Cell from './Cell'
import { generateQuickGuid } from '../utils/helpers'
import { object, arrayOf } from 'prop-types'

class Grid extends Component {
  static propTypes = {
    sea: arrayOf(arrayOf(object))
  }

  handleClick = (x, y) => {
    this.props.onClick(x, y)
  }

  render () {
    const { sea } = this.props
    const filledSea = sea.map((row, y) => {
      const seaRow = row.map((cell, x) => (
        <Cell
          onClick={this.handleClick}
          coord={{ x: sea[y][x].x, y: sea[y][y].y }}
          key={generateQuickGuid()}
        />
      ))
      return (
        <div className='row' key={generateQuickGuid()}>
          {seaRow}
        </div>
      )
    })
    return <div className='grid'>{filledSea}</div>
  }
}

export default Grid
