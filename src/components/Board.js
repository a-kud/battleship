import React from 'react'
import { object, arrayOf, string, func, bool } from 'prop-types'

import Grid from './Grid'
import GridLabels from './GridLabels'

Board.propTypes = {
  board: arrayOf(arrayOf(object)).isRequired,
  label: string,
  onClick: func,
  isUserSetupDone: bool
}

export function Board ({ board, label, onClick, isUserSetupDone }) {
  return (
    <div className={`game-board-${label.toLowerCase()}`}>
      <h3 className={`header-${label.toLowerCase()}`}>{label}</h3>
      <div className='game-board '>
        <GridLabels row />
        <div className='game-columns'>
          <GridLabels column />
          <Grid
            onClick={onClick}
            sea={board}
            label={label}
            isUserSetupDone={isUserSetupDone}
          />
        </div>
      </div>
    </div>
  )
}
