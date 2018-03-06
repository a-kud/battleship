import React, { Component } from 'react'

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
    return sea.map(row => {
      const seaRow = row.map(cell => (
        <div className='sea' key={generateQuickGuid()} />
      ))
      return (
        <div className='row' key={generateQuickGuid()}>
          {seaRow}
        </div>
      )
    })
  }
}

export default Grid
