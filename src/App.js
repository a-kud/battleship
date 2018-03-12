import React, { Component } from 'react'
import './App.css'

import { Board } from './components/Board'
import Button from 'material-ui/Button'
// import { isValidPlacement } from './utils/helpers'

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
    const generateAiBoard = grid => {
      const lengthLimit = this.state.settings.boardWidth
      const generateCoordinate = limit => Math.floor(Math.random() * limit)
      const isCellClearOfShips = (myArray, i, j) => {
        let rowLimit = 9
        let columnLimit = 9
        let types = []
        for (let x = Math.max(0, i - 1); x <= Math.min(i + 1, rowLimit); x++) {
          for (
            let y = Math.max(0, j - 1);
            y <= Math.min(j + 1, columnLimit);
            y++
          ) {
            if (x !== i || y !== j) {
              types.push(myArray[x][y].type)
            }
          }
        }
        return !types.includes('ship')
      }
      const generateDestroyer = () => {
        // let gridCopy = [...grid]
        const x = generateCoordinate(lengthLimit - 1)
        const y = generateCoordinate(lengthLimit - 1)
        if (
          gridCopy[x][y].type === 'sea' &&
          isCellClearOfShips(gridCopy, x, y)
        ) {
          gridCopy[x][y].type = 'ship'
        } else {
          generateDestroyer()
        }
      }

      /**
       * @param {number} length Ship length
       * @param {number} x Column coordinate
       * @param {number} y Row coordinate
       * @returns {array} Coordinates ship of length size can be placed clear of
       * obstacles
       */
      const generateLinearShipCoordinates = (x, y, length) => {
        const validCoordinates = []
        if (lengthLimit - y >= length) {
          const southCoordinates = []
          for (let i = 0; i < length; i += 1) {
            if (
              gridCopy[x][y + i].type !== 'ship' &&
              isCellClearOfShips(gridCopy, x, y)
            ) {
              southCoordinates.push([x, y + i])
            }
          }
          if (southCoordinates.length === length) {
            validCoordinates.push(southCoordinates)
          }
        }
        if (y + 1 >= length) {
          let northCoordinates = []
          for (let i = 0; i < length; i++) {
            if (
              gridCopy[x][y - i].type !== 'ship' &&
              isCellClearOfShips(gridCopy, x, y)
            ) {
              northCoordinates.push([x, y - i])
            }
          }
          if (northCoordinates.length === length) {
            validCoordinates.push(northCoordinates)
          }
        }
        if (lengthLimit - x >= length) {
          const westCoordinates = []
          for (let i = 0; i < length; i += 1) {
            if (
              gridCopy[x + i][y].type !== 'ship' &&
              isCellClearOfShips(gridCopy, x, y)
            ) {
              westCoordinates.push([x + i, y])
            }
          }
          if (westCoordinates.length === length) {
            validCoordinates.push(westCoordinates)
          }
        }
        if (x + 1 >= length) {
          const eastCoordinates = []
          for (let i = 0; i < length; i += 1) {
            if (
              gridCopy[x - i][y].type !== 'ship' &&
              isCellClearOfShips(gridCopy, x, y)
            ) {
              eastCoordinates.push([x - i, y])
            }
          }
          if (eastCoordinates.length === length) {
            validCoordinates.push(eastCoordinates)
          }
        }
        console.log(validCoordinates)
        return validCoordinates
      }

      const generateCruiser = () => {
        const x = generateCoordinate(lengthLimit - 1)
        const y = generateCoordinate(lengthLimit - 1)
        const validCoordinates = generateLinearShipCoordinates(x, y, 4)
        if (validCoordinates.length > 0) {
          const finalCoordinates =
            validCoordinates[generateCoordinate(validCoordinates.length - 1)]
          for (const coordinate of finalCoordinates) {
            gridCopy[coordinate[0]][coordinate[1]].type = 'ship'
          }
        } else {
          generateCruiser()
        }
      }

      const generateBattleShip = () => {
        const x = generateCoordinate(lengthLimit - 1)
        const y = generateCoordinate(lengthLimit - 1)
        const validCoordinates = generateLinearShipCoordinates(x, y, 3)
        if (validCoordinates.length > 0) {
          const finalCoordinates =
            validCoordinates[generateCoordinate(validCoordinates.length - 1)]
          for (const coordinate of finalCoordinates) {
            gridCopy[coordinate[0]][coordinate[1]].type = 'ship'
          }
        } else {
          generateBattleShip()
        }
      }

      let gridCopy = [...grid]
      // const gridCopy = grid.map(row => row.map(cell => ({...cell})))

      generateDestroyer()
      generateDestroyer()
      generateCruiser()
      generateBattleShip()
      return gridCopy
    }
    const currentStep = this.state.userSetup.step
    this.setState({
      userSetup: { ...this.state.userSetup, step: currentStep + 1 },
      gameStarted: true
    })

    generateAiBoard(this.state.aiBoard)
  }

  isValidPlacement = (
    grid,
    x,
    y,
    shipLength,
    shipCoordinates,
    elShapeRequested = false
  ) => {
    const findNeighbors = (myArray, i, j) => {
      let rowLimit = 9
      let columnLimit = 9
      let types = []
      for (let x = Math.max(0, i - 1); x <= Math.min(i + 1, rowLimit); x++) {
        for (
          let y = Math.max(0, j - 1);
          y <= Math.min(j + 1, columnLimit);
          y++
        ) {
          if (x !== i || y !== j) {
            types.push(myArray[x][y].type)
          }
        }
      }
      return !types.includes('ship shiplastcell')
    }

    let alreadyPlacedCellCountNorth = 0
    let alreadyPlacedCellCountSouth = 0
    let alreadyPlacedCellCountWest = 0
    let alreadyPlacedCellCountEast = 0

    if (grid[x][y].type === 'sea' && shipLength === 1) {
      return findNeighbors(grid, x, y)
    }

    if (this.state.userSetup[shipCoordinates].length === 0) {
      return findNeighbors(grid, x, y)
    }

    if (grid[x][y].type === 'sea' && shipLength > 1) {
      if (!findNeighbors(grid, x, y)) {
        return false
      }
      for (let i = 1; i < shipLength; i += 1) {
        if (y - i >= 0) {
          alreadyPlacedCellCountNorth =
            grid[x][y - i].type === 'ship'
              ? alreadyPlacedCellCountNorth + 1
              : alreadyPlacedCellCountNorth
        }
        if (y + i < 10) {
          alreadyPlacedCellCountSouth =
            grid[x][y + i].type === 'ship'
              ? alreadyPlacedCellCountSouth + 1
              : alreadyPlacedCellCountSouth
        }
        if (x - i >= 0) {
          alreadyPlacedCellCountWest =
            grid[x - i][y].type === 'ship'
              ? alreadyPlacedCellCountWest + 1
              : alreadyPlacedCellCountWest
        }
        if (x + i < 10) {
          alreadyPlacedCellCountEast =
            grid[x + i][y].type === 'ship'
              ? alreadyPlacedCellCountEast + 1
              : alreadyPlacedCellCountEast
        }
      }

      // const validCoord = generateLinearShipCoordinates(x,y, 4, 9, [...grid])
      // console.log(validCoord)
      // console.log(this.state.userSetup[shipCoordinates].length)
      if (
        [
          alreadyPlacedCellCountNorth,
          alreadyPlacedCellCountSouth,
          alreadyPlacedCellCountWest,
          alreadyPlacedCellCountEast
        ].includes(this.state.userSetup[shipCoordinates].length)
      ) {
        return true
      }

      return false
    }
    return false
  }

  handleClick = (x, y) => {
    const setShipCoordinates = (shipClass, length = 1, userBoard = true) => {
      const board = this.state.userSetup
      const currentStep = board.step
      const isCoordinatesNotReady = board[shipClass].length < length - 1

      this.setState(prevState => {
        const userBoardCopy = userBoard
          ? [...prevState.userBoard]
          : [...prevState.aiBoard]

        if ((currentStep === 3 || currentStep === 4) && isCoordinatesNotReady) {
          return {
            userSetup: {
              ...prevState.userSetup,
              [shipClass]: [...prevState.userSetup[shipClass], [x, y]]
            }
          }
        }
        if (!isCoordinatesNotReady) {
          userBoardCopy[x][y].type = 'ship shiplastcell'
        }

        // if (!userBoard) {
        //   console.log(userBoardCopy)
        //   return {
        //     aiBoard: userBoardCopy
        //   }
        // }
        return {
          userSetup: {
            ...prevState.userSetup,
            step: prevState.userSetup.step + 1,
            [shipClass]: [...prevState.userSetup[shipClass], [x, y]]
          },
          userBoard: userBoardCopy
        }
      })
    }

    const updateBoard = () => {
      const userBoardCopy = [...this.state.userBoard]
      userBoardCopy[x][y].type = 'ship'
      this.setState({ userBoard: userBoardCopy })
    }

    switch (this.state.userSetup.step) {
      case 1: {
        if (this.isValidPlacement(this.state.userBoard, x, y, 1)) {
          updateBoard()
          setShipCoordinates('destroyer1Coordinates')
        } else {
          alert('invalid coordinates')
        }

        break
      }
      case 2: {
        if (this.isValidPlacement(this.state.userBoard, x, y, 1)) {
          setShipCoordinates('destroyer2Coordinates')
          updateBoard()
        } else {
          alert('invalid coordinates')
        }

        break
      }
      case 3: {
        if (
          this.isValidPlacement(
            this.state.userBoard,
            x,
            y,
            4,
            'cruiserCoordinates'
          )
        ) {
          setShipCoordinates('cruiserCoordinates', 4)
          updateBoard()
        } else {
          alert('invalid coordinates')
        }
        break
      }
      case 4: {
        setShipCoordinates('battleshipCoordinates', 4)
        updateBoard()
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
        <div className='controls'>
          <Button
            variant='raised'
            onClick={this.handleGameStart}
            color='primary'
            disabled={this.state.gameStarted}
            id='start-btn'
          >
            Start
          </Button>
          <div className='game-status'>
            <h2>Game status:</h2>
            <p>{this.state.userSetup.text[this.state.userSetup.step]}</p>
          </div>
        </div>

        <Board
          board={this.state.userBoard}
          label={'Self'}
          onClick={this.handleClick}
        />
        <Board
          board={this.state.aiBoard}
          onClick={this.handleClick}
          label={'Opponent'}
        />
      </div>
    )
  }
}

export default App
