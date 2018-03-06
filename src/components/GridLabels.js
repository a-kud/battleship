import React, { Component } from 'react'

import { generateQuickGuid } from '../utils/helpers'

export default class GridLabel extends Component {
  render () {
    const { row, column } = this.props
    const labels = Array.from({ length: 10 })
    const rowNames = 'ABCDEFGHIJ'
    if (row) {
      return (
        <div className='row-labels'>
          {labels.map((label, i) => (
            <div className='row-label' key={generateQuickGuid()}>
              <span>{rowNames.substr(i, 1)}</span>
            </div>
          ))}
        </div>
      )
    } else if (column) {
      return (
        <div className='column-labels'>
          {labels.map((label, i) => (
            <div className='column-label' key={generateQuickGuid()}>
              <span>{i}</span>
            </div>
          ))}
        </div>
      )
    }
  }
}
