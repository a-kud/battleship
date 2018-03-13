/**
 * 
 * @param {array} grid 2D game grid
 * @param {array} validLineCoordinates Contains arrays of arrays of coordinates composing of a line ship
 */
function getElValidCoordinates(grid, validLineCoordinates) {

  const lengthLimit = [...grid[0]].length
  const gridCopy = grid.map(row => row.map(col => [...col]))
  const validLineCoordinatesCopy = grid.map(row => row.map(col => [...col]))
  const shipLength = [...validLineCoordinates[0]].length
  const markShipsLayout = validLineCoordinatesCopy.map(coordinates => coordinates.filter((coord, i) => {
      if (i === 0) {
        return (coordinates[i+1][0] === coordinates[i][0]) ?
          [coordinates[i].push('vertical')] :
          [coordinates[i].push('horizontal')]
      } else {
        return coordinates[i]
      }
     }
  ))
  // const final = markShipsLayout.map(coordinates=>{
  //   if (coordinates[0][2] === 'horizontal') {
  //     return coordinates.map((coord, i) => {
  //       if (i === 0 || (i === shipLength - 1)) {
  //         findNorthAndSouthCoordinates(coord[0], coord[1]).map(validNorthOrSouthCoord => {
  //           return (validNorthOrSouthCoord) ? 
  //             coordinates[i].push(validNorthOrSouthCoord) :
  //             coord
  //         })
  //       } else { return coord}
  //       // if (i === shipLength - 1) {
  //       //   findNorthAndSouthCoordinates(coord[0], coord[1]).map(validNorthOrSouthCoord => {
  //       //     return (validNorthOrSouthCoord) ? 
  //       //       coordinates[i].push(validNorthOrSouthCoord) :
  //       //       coordinates[i]
  //       //   })
  //       // }
  //     })
  //   } else if (coordinates[0][2] === 'vertical') {
  //     return coordinates.map(coord => {/*find west and east*/})
  //   }
  // })
  for (shipCoord of markShipsLayout) {
    if (markShipsLayout[0][2] === 'horizontal') {
      console.log(shipCoord)
    }
  }

  function findNorthAndSouthCoordinates (x,y){
    const cordinatesFound = []
    const checkSouth =  () => {
      if ( gridCopy[x][y + 1].type !== 'ship' && 
        isCellClearOfShips(gridCopy, x, y + 1)) {
          cordinatesFound.push([x, y + 1])
      }
    }
    const checkNorth = () => {
      if ( gridCopy[x][y - 1].type !== 'ship' &&
        isCellClearOfShips(gridCopy, x, y - 1)) {
          cordinatesFound.push([x, y - 1])
      }
    }
    if (y - 1 < 0) {//check south only
      checkSouth()
    }
    if (y + 1 === lengthLimit) { // check north only
      checkNorth()
    } else {
      checkNorth()
      checkSouth()
    }
    return cordinatesFound
  }
  
            
}

            
const test = [
  [[6, 1], [6, 2], [6, 3]],
  [[6, 1], [7, 1], [8, 1]],
  [[6, 1], [5, 1], [4, 1]]
]
