import React, { Component } from 'react'
import './App.css'

import { Board } from './components/Board'
import Button from 'material-ui/Button'

class App extends Component {
  state = {
    settings: {
      boardWidth: 10,
      boardHeight: 10
    },
    gameStarted: false,
    userBoard: [],
    aiBoard: [],
    userSetup: {
      isComplete: false,
      step: 0,
      text: [
        'Please start game',
        'Place first destroyer. It takes one cell.',
        'Place second destroyer. One cell.',
        'Place a cruiser. Four cell length.',
        'Place a battleship. Four cells. L-shaped.'
      ],
      destroyer1Coordinates: [],
      destroyer2Coordinates: [],
      cruiserCoordinates: [],
      battleshipCoordinates: []
    }
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

  handleGameStart = () => {
    const currentStep = this.state.userSetup.step
    this.setState({
      userSetup: { ...this.state.userSetup, step: currentStep + 1 }
    })
  }

  handleClick = (x, y) => {
    const setShipCoordinates = (shipClass, length = 1) => {
      const currentStep = this.state.userSetup.step
      const isCoordinatesNotReady =
        this.state.userSetup[shipClass].length < length - 1
      this.setState(prevState => {
        if (currentStep === 4 && isCoordinatesNotReady) {
          return {
            userSetup: {
              ...prevState.userSetup,
              [shipClass]: [...prevState.userSetup[shipClass], [x, y]],
              isComplete: true
            }
          }
        }
        if ((currentStep === 3 || currentStep === 4) && isCoordinatesNotReady) {
          return {
            userSetup: {
              ...prevState.userSetup,
              [shipClass]: [...prevState.userSetup[shipClass], [x, y]]
            }
          }
        }

        return {
          userSetup: {
            ...prevState.userSetup,
            step: prevState.userSetup.step + 1,
            [shipClass]: [...prevState.userSetup[shipClass], [x, y]]
          }
        }
      })
    }

    switch (this.state.userSetup.step) {
      case 1: {
        setShipCoordinates('destroyer1Coordinates')
        const userBoardCopy = [...this.state.userBoard]
        userBoardCopy[y][x].type = 'ship'
        this.setState({ userBoard: userBoardCopy })
        break
      }
      case 2: {
        setShipCoordinates('destroyer2Coordinates')
        const userBoardCopy = [...this.state.userBoard]
        userBoardCopy[y][x].type = 'ship'
        this.setState({ userBoard: userBoardCopy })
        break
      }
      case 3: {
        setShipCoordinates('cruiserCoordinates', 4)
        const userBoardCopy = [...this.state.userBoard]
        userBoardCopy[y][x].type = 'ship'
        this.setState({ userBoard: userBoardCopy })
        break
      }
      case 4: {
        setShipCoordinates('battleshipCoordinates', 4)
        const userBoardCopy = [...this.state.userBoard]
        userBoardCopy[y][x].type = 'ship'
        this.setState({ userBoard: userBoardCopy })
        break
      }
      default:
        break
    }
  }
  componentWillMount () {
    const height = this.state.settings.boardHeight
    const width = this.state.settings.boardWidth
    this.setState({
      userBoard: this.createSea(height, width),
      aiBoard: this.createSea(height, width)
    })
  }

  render () {
    return (
      <div id='app'>
        <Button variant='raised' onClick={this.handleGameStart} color='primary'>
          Start
        </Button>
        <div>
          <h2>Game status:</h2>
          <p>{this.state.userSetup.text[this.state.userSetup.step]}</p>
        </div>
        <Board
          board={this.state.userBoard}
          label={'Self'}
          onClick={this.handleClick}
        />
        <Board board={this.state.aiBoard} label={'Opponent'} />
      </div>
    )
  }
}

export default App
