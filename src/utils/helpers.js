// https://stackoverflow.com/posts/13403498/revisions
export function generateQuickGuid () {
  return Math.random()
    .toString(18)
    .substring(2, 10)
}

/**
 *
 * @param {number} max Positive interger number
 * @returns {number} Random integer in range [0, max]
 */
export function generateRandomInteger (max) {
  return Math.floor(Math.random() * (max + 1))
}

/**
 * Generates game grid of width by height size
 * width, height - numbers
 * returns array
 */
export function createSea (sideLength) {
  const rowsAndColumns = Array.from({ length: sideLength })
  return rowsAndColumns.map((row, x) =>
    rowsAndColumns.map((column, y) => ({
      x: x,
      y: y,
      type: 'sea'
    }))
  )
}

export function isCellClearOfShips (grid, i, j, typesRequested = false) {
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
  return typesRequested ? types : !JSON.stringify(types).includes('ship')
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
        } else if (coord[1] + 1 === lengthLimit) {
          allShipCoordinates.push([
            checkNorth(coord[0], coord[1]),
            ...shipCoord
          ])
        } else {
          allShipCoordinates.push([
            checkNorth(coord[0], coord[1]),
            ...shipCoord
          ])
          allShipCoordinates.push([
            checkSouth(coord[0], coord[1]),
            ...shipCoord
          ])
        }
      } else if (coord[2] === 'vertical') {
        if (coord[0] === 0) {
          allShipCoordinates.push([checkEast(coord[0], coord[1]), ...shipCoord])
        } else if (coord[0] + 1 === lengthLimit) {
          allShipCoordinates.push([checkWest(coord[0], coord[1]), ...shipCoord])
        } else {
          allShipCoordinates.push([checkWest(coord[0], coord[1]), ...shipCoord])
          allShipCoordinates.push([checkEast(coord[0], coord[1]), ...shipCoord])
        }
      }
    }

    return allShipCoordinates
  }
}

/**
 * @param {number} length Ship length
 * @param {number} x Column coordinate
 * @param {number} y Row coordinate
 * @param {number} lengthLimit Grid length
 * @returns {array} Ship coordinates of length size can be placed clear of
 * obstacles
 */
export function generateLinearShipCoordinates (x, y, length, grid, lengthLimit) {
  const validCoordinates = []
  if (lengthLimit - y >= length) {
    const southCoordinates = []

    for (let i = 0; i < length; i += 1) {
      if (
        !grid[x][y + i].type.includes('ship') &&
        isCellClearOfShips(grid, x, y + i)
      ) {
        southCoordinates.push([x, y + i])
      }
    }
    if (southCoordinates.length === length) {
      validCoordinates.push(southCoordinates)
    }
  }

  if (lengthLimit - (lengthLimit - 1 - y) >= length) {
    let northCoordinates = []
    for (let i = 0; i < length; i++) {
      if (
        !grid[x][y - i].type.includes('ship') &&
        isCellClearOfShips(grid, x, y - i)
      ) {
        northCoordinates.push([x, y - i])
      }
    }
    if (northCoordinates.length === length) {
      validCoordinates.push(northCoordinates)
    }
  }

  if (lengthLimit - (lengthLimit - 1 - x) >= length) {
    const westCoordinates = []
    for (let i = 0; i < length; i += 1) {
      if (
        !grid[x - i][y].type.includes('ship') &&
        isCellClearOfShips(grid, x - i, y)
      ) {
        westCoordinates.push([x - i, y])
      }
    }
    if (westCoordinates.length === length) {
      validCoordinates.push(westCoordinates)
    }
  }

  if (lengthLimit - x >= length) {
    const eastCoordinates = []
    for (let i = 0; i < length; i += 1) {
      if (
        !grid[x + i][y].type.includes('ship') &&
        isCellClearOfShips(grid, x + i, y)
      ) {
        eastCoordinates.push([x + i, y])
      }
    }
    if (eastCoordinates.length === length) {
      validCoordinates.push(eastCoordinates)
    }
  }
  return validCoordinates
}

export function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function isArrayInArray (validCoord, coordinate) {
  return validCoord.some(coordinates =>
    coordinates.some(coord => {
      const coordinateAsString = JSON.stringify(coordinate)
      return JSON.stringify(coord) === coordinateAsString
    })
  )
}
