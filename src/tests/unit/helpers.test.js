import { isCellClearOfShips, generateRandomInteger } from '../../utils/helpers'

describe('Test of isCellClearOfShips', () => {
  test('returns false on a row with ships', () => {
    const gridArray = Array.from({ length: 10 }).map(arr =>
      Array.from(
        { length: 10 },
        (v, i) => (i === 0 ? { type: 'ship' } : { type: 'sea' })
      )
    )
    expect(isCellClearOfShips(gridArray, 1, 1)).toEqual(false)
  })
  test('returns true on a cell with no ship neighbors', () => {
    const gridArray = Array.from({ length: 10 }).map(arr =>
      Array.from(
        { length: 10 },
        (v, i) => (i === 0 ? { type: 'ship' } : { type: 'sea' })
      )
    )
    expect(isCellClearOfShips(gridArray, 9, 9)).toEqual(true)
  })
})

describe('Test generateRandomInteger method', () => {
  test('Returns less than ten or  ten', () => {
    Array.from({ length: 100 }, v =>
      expect(generateRandomInteger(10)).toBeLessThanOrEqual(10)
    )
    // expect(randomIntegers).toContain(-1 && 11)
  })
})
