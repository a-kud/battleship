// https://stackoverflow.com/posts/13403498/revisions
export function generateQuickGuid () {
  return Math.random()
    .toString(18)
    .substring(2, 10)
}

/**
 *
 * @param {number} x
 * @param {number} y
 * @param {array} grid
 */
export function isValidPlacement (grid, x, y, shipLength = 4) {
  function findingNeighbors (myArray, i, j) {
    let rowLimit = myArray.length - 1
    let columnLimit = myArray[0].length - 1
    let types = []
    for (let x = Math.max(0, i - 1); x <= Math.min(i + 1, rowLimit); x++) {
      for (let y = Math.max(0, j - 1); y <= Math.min(j + 1, columnLimit); y++) {
        if (x !== i || y !== j) {
          types.push(myArray[x][y].type)
        }
      }
    }
    return !types.includes('ship')
  }

  let alreadyPlacedCellCountNorth = 0
  let alreadyPlacedCellCountSouth = 0
  let alreadyPlacedCellCountWest = 0
  let alreadyPlacedCellCountEast = 0

  if (grid[x][y].type === 'sea' && shipLength === 1) {
    return findingNeighbors(grid, x, y)
  }

  if (grid[x][y].type === 'sea' && shipLength > 1) {
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
    console.log(`alreadyPlacedCellCountNorth ${alreadyPlacedCellCountNorth}`)
    console.log(`alreadyPlacedCellCountSouth ${alreadyPlacedCellCountSouth}`)
    console.log(`alreadyPlacedCellCountWest ${alreadyPlacedCellCountWest}`)
    console.log(`alreadyPlacedCellCountEast ${alreadyPlacedCellCountEast}`)
    if (
      y < shipLength - alreadyPlacedCellCountNorth &&
      y < shipLength - alreadyPlacedCellCountSouth &&
      x < shipLength - alreadyPlacedCellCountWest &&
      x < shipLength - alreadyPlacedCellCountEast
    ) {
      return false
    }
    return true
  }
  return false
}

export function isCellClearOfShips (grid, i, j) {
  let rowLimit = 9
  let columnLimit = 9
  let types = []
  for (let x = Math.max(0, i - 1); x <= Math.min(i + 1, rowLimit); x++) {
    for (let y = Math.max(0, j - 1); y <= Math.min(j + 1, columnLimit); y++) {
      if (x !== i || y !== j) {
        types.push(grid[x][y].type)
      }
    }
  }

  // console.log("x",i,"y",j,"types",types)
  return !types.includes('ship')
}

/**
 *
 * @param {array} grid 2D game grid
 * @param {array} validLineCoordinates Contains arrays of arrays of coordinates composing of a line ship
 * @returns {array} Posible L-shaped ships coordinates
 */
export function getElValidCoordinates (grid, validLineCoordinates) {
  const lengthLimit = /* grid[0].length */ 10
  const validLineCoordinatesCopy = validLineCoordinates.map(row =>
    row.map(col => [...col])
  )
  const checkSouth = (x, y) => {
    if (grid[x][y + 1].type !== 'ship' && isCellClearOfShips(grid, x, y + 1)) {
      return [x, y + 1]
    }
  }
  const checkNorth = (x, y) => {
    if (grid[x][y - 1].type !== 'ship' && isCellClearOfShips(grid, x, y - 1)) {
      return [x, y - 1]
    }
  }
  const checkEast = (x, y) => {
    if (grid[x + 1][y].type !== 'ship' && isCellClearOfShips(grid, x + 1, y)) {
      return [x + 1, y]
    }
  }
  const checkWest = (x, y) => {
    if (grid[x - 1][y].type !== 'ship' && isCellClearOfShips(grid, x - 1, y)) {
      return [x - 1, y]
    }
  }
  const markShipsLayout = validLineCoordinatesCopy.map(coordinates =>
    coordinates.filter((coord, i) => {
      if (i === 0) {
        return coordinates[i + 1][0] === coordinates[i][0]
          ? [coordinates[i].push('vertical')]
          : [coordinates[i].push('horizontal')]
      } else {
        return coordinates[i]
      }
    })
  )

  const allShipCoordinates = []
  for (const shipCoord of markShipsLayout) {
    for (const coord of shipCoord) {
      if (coord[2] === 'horizontal') {
        if (coord[1] === 0) {
          allShipCoordinates.push([
            checkSouth(coord[0], coord[1]),
            ...shipCoord
          ])
        }
        if (coord[1] + 1 === lengthLimit) {
          allShipCoordinates.push([
            checkNorth(coord[0], coord[1]),
            ...shipCoord
          ])
        }
        allShipCoordinates.push([checkNorth(coord[0], coord[1]), ...shipCoord])
        allShipCoordinates.push([checkSouth(coord[0], coord[1]), ...shipCoord])
      } else if (coord[2] === 'vertical') {
        if (coord[0] === 0) {
          allShipCoordinates.push([checkEast(coord[0], coord[1]), ...shipCoord])
        }
        if (coord[0] + 1 === lengthLimit) {
          allShipCoordinates.push([checkWest(coord[0], coord[1]), ...shipCoord])
        }
        console.log('error', coord[0], coord[1])
        allShipCoordinates.push([checkWest(coord[0], coord[1]), ...shipCoord])
        allShipCoordinates.push([checkEast(coord[0], coord[1]), ...shipCoord])
      }
    }

    return allShipCoordinates
  }
}
