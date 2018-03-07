import React, { Component } from 'react'
import './App.css'

import { Board } from './components/Board'

class App extends Component {
  state = {
    settings: {
      boardWidth: 10,
      boardHeight: 10
    },
    gameStarted: false,
    userBoard: [],
    aiBoard: []
  }

  /**
   * Generates game grid of width by height size
   * width, height - numbers
   * returns array
   */
  createSea = (width, height) => {
    const rows = Array.from({ length: height })
    const columns = Array.from({ length: width })
    return rows.map((row, y) =>
      columns.map((column, x) => ({
        x: x,
        y: y,
        type: 'sea'
      }))
    )
  }

  componentWillMount () {
    const height = this.state.settings.boardHeight
    const width = this.state.settings.boardWidth
    const sea = this.createSea(height, width)
    this.setState({
      userBoard: sea,
      aiBoard: sea
    })
  }

  render () {
    return (
      <div id='app'>
        <Board board={this.state.userBoard} />
        <Board board={this.state.aiBoard} />
      </div>
    )
  }
}

export default App
