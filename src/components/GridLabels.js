import React, { Component } from 'react'

import { generateQuickGuid } from '../utils/helpers'

export default class GridLabel extends Component {
  render () {
    const { row, column } = this.props
    const labels = Array.from({ length: 10 })
    const rowContent = 'ABCDEFGHIJ'
    const classNameGroup = row ? 'row-labels' : 'column-labels'
    const className = row ? 'row-label' : 'column-label'

    return (
      <div className={classNameGroup}>
        {labels.map((label, i) => (
          <div className={className} key={generateQuickGuid()}>
            <span>{column ? i : rowContent.substr(i, 1)}</span>
          </div>
        ))}
      </div>
    )
  }
}
