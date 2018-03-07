import React, { Component } from 'react'

import Cell from './Cell'
import { generateQuickGuid } from '../utils/helpers'

class Grid extends Component {
  /**
   * Creates 2d array 10x10
   */
  createSea = () =>
    Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => ({
        type: 'sea'
      }))
    )

  render () {
    const sea = this.createSea()
    const filledSea = sea.map((row, y) => {
      const seaRow = row.map((cell, x) => (
        <Cell coord={{ x: x, y: y }} key={generateQuickGuid()} />
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
