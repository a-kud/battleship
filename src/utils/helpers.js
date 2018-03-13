// https://stackoverflow.com/posts/13403498/revisions
export function generateQuickGuid () {
  return Math.random()
    .toString(18)
    .substring(2, 10)
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

  return typesRequested ? types : !types.includes('ship')
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
          console.log('error', coord[0], coord[1])
          allShipCoordinates.push([checkWest(coord[0], coord[1]), ...shipCoord])
          allShipCoordinates.push([checkEast(coord[0], coord[1]), ...shipCoord])
        }
      }
    }

    return allShipCoordinates
  }
}
