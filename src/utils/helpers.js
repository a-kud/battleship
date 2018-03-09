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
export function isValidPlacement (grid, x, y) {}
