import React, { Component } from 'react'
import './App.css'

import Grid from './components/Grid'
import GridLabels from './components/GridLabels'

class App extends Component {
  render () {
    return (
      <div id='app'>
        <div className='game-board'>
          <GridLabels row />
          <div className='game-columns'>
            <GridLabels column />
            <Grid />
          </div>
        </div>
      </div>
    )
  }
}

export default App
