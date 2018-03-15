/* eslint no-fallthrough: "off" */
import React, { Component } from 'react'
import './App.css'

import { Board } from './components/Board'
import Button from 'material-ui/Button'
import {
  isCellClearOfShips,
  getElValidCoordinates,
  createSea,
  generateRandomInteger,
  generateLinearShipCoordinates,
  sleep,
  isArrayInArray
} from './utils/helpers'
class App extends Component {
  state = {
    settings: {
      boardWidth: 10,
      boardHeight: 10,
      cellsToSunk: 10
    },
    gameStarted: false,
    userBoard: [],
    aiBoard: [],
    userSetup: {
      isComplete: false,
      destroyer1Coordinates: [],
      destroyer2Coordinates: [],
      cruiserCoordinates: [],
      battleshipCoordinates: []
    },
    step: 0,
    text: [
      'Please start game',
      'Place a battleship. Four cells. L-shaped.',
      'Place a cruiser. Four cell length.',
      'Place first destroyer. It takes one cell.',
      'Place second destroyer. One cell.',
      'Shoot your enemy! Fire in the hole!',
      'We are under attack! Take cover'
    ],
    userHits: 0,
    computerHits: 0
  }

  handleGameStart = () => {
    const generateAiBoard = grid => {
      const lengthLimit = this.state.settings.boardWidth
      const generateDestroyer = grid => {
        const x = generateRandomInteger(lengthLimit - 1)
        const y = generateRandomInteger(lengthLimit - 1)

        if (grid[x][y].type === 'sea' && isCellClearOfShips(grid, x, y)) {
          grid[x][y].type = 'ship'
          return grid
        }
        return generateDestroyer(grid)
      }
      const generateCruiser = grid => {
        const x = generateRandomInteger(lengthLimit - 1)
        const y = generateRandomInteger(lengthLimit - 1)
        const validCoordinates = generateLinearShipCoordinates(
          x,
          y,
          4,
          grid,
          lengthLimit
        )

        if (validCoordinates.length > 0) {
          const finalCoordinates =
            validCoordinates[generateRandomInteger(validCoordinates.length - 1)]
          for (const coordinate of finalCoordinates) {
            grid[coordinate[0]][coordinate[1]].type = 'ship'
          }
          return grid
        }
        return generateCruiser(grid)
      }
      const generateBattleShip = grid => {
        const x = generateRandomInteger(lengthLimit - 1)
        const y = generateRandomInteger(lengthLimit - 1)
        const validCoordinates = generateLinearShipCoordinates(
          x,
          y,
          3,
          grid,
          lengthLimit
        )

        let finalValidCoordinates = []
        if (validCoordinates.length) {
          finalValidCoordinates = getElValidCoordinates(grid, validCoordinates)
        }
        if (finalValidCoordinates.length) {
          const randomIndex = generateRandomInteger(
            finalValidCoordinates.length - 1
          )
          const finalCoordinates = finalValidCoordinates[randomIndex]
          for (const coordinate of finalCoordinates) {
            grid[coordinate[0]][coordinate[1]].type = 'ship'
          }
          return grid
        }
        return generateBattleShip(grid)
      }

      return generateCruiser(
        generateDestroyer(generateDestroyer(generateBattleShip(grid)))
      )
    }
    this.setState(prevState => ({
      step: prevState.step + 1,
      gameStarted: true
    }))

    const aiGrid = generateAiBoard(this.state.aiBoard)
    this.setState({ aiBoard: aiGrid })
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
      return !types.includes('ship ship-userset')
    }

    let alreadyPlacedCellCountNorth = 0
    let alreadyPlacedCellCountSouth = 0
    let alreadyPlacedCellCountWest = 0
    let alreadyPlacedCellCountEast = 0

    if (
      grid[x][y].type === 'sea' &&
      (shipLength === 1 || this.state.userSetup[shipCoordinates].length === 0)
    ) {
      if (!elShapeRequested) {
        const name = shipCoordinates + 'Valid'

        const coordinates = generateLinearShipCoordinates(
          x,
          y,
          shipLength,
          grid,
          10
        )
        if (coordinates.length) {
          this.setState(prevState => ({
            userSetup: {
              ...prevState.userSetup,
              [name]: coordinates
            }
          }))
        } else {
          return false
        }
      }

      return findNeighbors(grid, x, y)
    }

    if (
      elShapeRequested &&
      this.state.userSetup[shipCoordinates].length === 3
    ) {
      const cellCountWithShipType = isCellClearOfShips(grid, x, y, true).filter(
        x => x === 'ship'
      ).length
      return grid[x][y].type === 'sea' && cellCountWithShipType === 2
    }

    if (grid[x][y].type === 'sea' && shipLength > 1) {
      if (
        shipCoordinates === 'cruiserCoordinates' &&
        (this.state.userSetup[shipCoordinates].length === 0 ||
          this.state.userSetup[shipCoordinates].length === 1)
      ) {
        return !!isArrayInArray(
          this.state.userSetup['cruiserCoordinatesValid'],
          [x, y]
        )
      }

      if (!findNeighbors(grid, x, y)) {
        return false
      }

      for (
        let i = 1;
        i <= this.state.userSetup[shipCoordinates].length;
        i += 1
      ) {
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
    const setShipCoordinates = (shipClass, length = 1) => {
      const board = this.state.userSetup
      const currentStep = this.state.step
      const isCoordinatesNotReady = board[shipClass].length < length - 1

      const completeSetup = () => {
        if (currentStep === 4 && !isCoordinatesNotReady) {
          this.setState(prevState => ({
            userSetup: {
              ...prevState.userSetup,
              isComplete: !prevState.userSetup.isComplete
            }
          }))
        }
      }

      this.setState(prevState => {
        const userBoardCopy = [...prevState.userBoard]

        if (!isCoordinatesNotReady) {
          userBoardCopy[x][y].type = 'ship ship-userset'
          for (const coordinates of board[shipClass]) {
            userBoardCopy[coordinates[0]][coordinates[1]].type =
              'ship ship-userset'
          }
        }

        if ((currentStep === 1 || currentStep === 2) && isCoordinatesNotReady) {
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
            [shipClass]: [...prevState.userSetup[shipClass], [x, y]]
          },
          userBoard: userBoardCopy,
          step: prevState.step + 1
        }
      }, completeSetup)
    }

    const updateBoard = (
      boardName = 'userBoard',
      type = 'ship',
      xCoord = x,
      yCoord = y
    ) => {
      const userBoardCopy = [...this.state[boardName]]
      userBoardCopy[xCoord][yCoord].type = type
      this.setState({ [boardName]: userBoardCopy })
    }
    const updateHitsCount = (counterName = 'userHits') => {
      this.setState(prevState => ({
        [counterName]: prevState[counterName] + 1
      }))
    }

    const cellsToSunk = this.state.settings.cellsToSunk
    switch (this.state.step) {
      case 1: {
        if (
          this.isValidPlacement(
            this.state.userBoard,
            x,
            y,
            4,
            'battleshipCoordinates',
            true
          )
        ) {
          setShipCoordinates('battleshipCoordinates', 4)
          updateBoard()
        } else {
          alert('invalid coordinates')
        }
        break
      }
      case 2: {
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
      case 3: {
        if (this.isValidPlacement(this.state.userBoard, x, y, 1)) {
          setShipCoordinates('destroyer2Coordinates')
          updateBoard()
        } else {
          alert('invalid coordinates')
        }
        break
      }
      case 4: {
        if (this.isValidPlacement(this.state.userBoard, x, y, 1)) {
          updateBoard()
          setShipCoordinates('destroyer1Coordinates')
        } else {
          alert('invalid coordinates')
        }
        break
      }
      case 5: {
        const cellType = this.state.aiBoard[x][y].type
        const userHitsCount = this.state.userHits

        if (userHitsCount === cellsToSunk) {
          alert('Congratulations, captain. You beat the enemy.')
          break
        }
        if (cellType.includes('shot-missed') || cellType.includes('shiphit')) {
          alert('You have shot at this cell before.')
          break
        }
        if (this.state.aiBoard[x][y].type.includes('ship')) {
          updateBoard('aiBoard', 'ship shiphit')
          updateHitsCount()
          break
        } else {
          updateBoard('aiBoard', 'shot-missed')
          this.setState({ step: 6 })
        }
      }
      case 6: {
        let x = generateRandomInteger(9)
        let y = generateRandomInteger(9)

        const fire = async (randomX, randomY) => {
          await sleep(1000)
          const computerHitsCount = this.state.computerHits
          const cellType = this.state.userBoard[randomX][randomY].type
          if (computerHitsCount === cellsToSunk) {
            alert('You have lost. Your fleet was destroyed.')
            return
          }
          if (
            cellType.includes('shot-missed') ||
            cellType.includes('shiphit')
          ) {
            return fire(generateRandomInteger(9), generateRandomInteger(9))
          }
          if (cellType.includes('ship')) {
            updateBoard(
              'userBoard',
              'ship ship-userset shiphit',
              randomX,
              randomY
            )
            updateHitsCount('computerHits')
            return fire(generateRandomInteger(9), generateRandomInteger(9))
          } else {
            updateBoard('userBoard', 'shot-missed', randomX, randomY)
            this.setState({ step: 5 })
          }
        }
        fire(x, y)
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
      userBoard: createSea(height, width),
      aiBoard: createSea(height, width)
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
            <p>{this.state.text[this.state.step]}</p>
          </div>
        </div>

        <Board
          board={this.state.userBoard}
          label={'Self'}
          isUserSetupDone={this.state.userSetup.isComplete}
          onClick={this.handleClick}
        />
        <Board
          board={this.state.aiBoard}
          onClick={this.handleClick}
          isUserSetupDone={this.state.userSetup.isComplete}
          label={'Opponent'}
        />
      </div>
    )
  }
}

export default App
