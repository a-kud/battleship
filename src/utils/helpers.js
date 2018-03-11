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
    // for(let i = 1;  i < shipLength-alreadyPlacedCellCount ; i+=1) {
    //   if (grid[x][y-i].type === 'sea') {
    //     [
    //         grid[x-1][y-i].type,
    //         grid[x+1][y-i].type,
    //         grid[x-1][y-i-1].type,
    //         grid[x][y-i-1].type,
    //         grid[x+1][y-i-1].type
    //     ].includes('ship')
    //   }
    // }
    return true
  }
  return false
}
