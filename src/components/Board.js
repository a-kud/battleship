import React from 'react'
import { object, arrayOf } from 'prop-types'

import Grid from './Grid'
import GridLabels from './GridLabels'

Board.propTypes = {
  board: arrayOf(arrayOf(object))
}

export function Board ({ board }) {
  return (
    <div className='game-board'>
      <GridLabels row />
      <div className='game-columns'>
        <GridLabels column />
        <Grid sea={board} />
      </div>
    </div>
  )
}
