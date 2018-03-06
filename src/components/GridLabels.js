import React, { Component } from 'react'

export default class GridLabel extends Component {
  render () {
    const { row, column } = this.props
    const labels = Array.from({ length: 10 })
    const rowNames = 'ABCDEFGHIJ'
    if (row) {
      return (
        <div className='row-labels'>
          {labels.map((label, i) => (
            <div className='row-label'>{rowNames.substr(i, 1)}</div>
          ))}
        </div>
      )
    } else if (column) {
      return (
        <div className='column-labels'>
          {labels.map((label, i) => <div className='column-label'>{i}</div>)}
        </div>
      )
    }
  }
}
