import Grid from 'grid'

describe('Grid', () => {
  let config

  beforeEach(() => {
    config = {
      cellSize: 50,
      width: 200,
      height: 300
    }
  })

  describe('empty()', () => {
    test('calculates number of cols and rows that fit on a grid and generate it', () => {
      const grid = Grid.empty(config)

      expect(grid.length).toBe(6)
      expect(grid[0].length).toBe(4)
    })

    test('calulate cell dimensions correctly', () => {
      const grid = Grid.empty(config)
      const cell = grid[0][0]

      expect(cell).toEqual(
        expect.objectContaining({
          x: 0,
          y: 0,
          width: 50,
          height: 50
        })
      )
    })

    describe('Uneven dimensions', () => {
      test('generates the correct amount of cells', () => {
        config.height = 360
        config.width = 260
        const grid = Grid.empty(config)

        expect(grid.length).toBe(7)
        expect(grid[0].length).toBe(5)
      })
    })
  })

  describe('center()', () => {
    test('returns the most center cell in the grid', () => {
      config.height = 200
      const grid = Grid.empty(config)

      expect(Grid.center(grid)).toEqual(
        expect.objectContaining({
          x: 100,
          y: 100
        })
      )
    })

    describe('Uneven dimensions', () => {
      test('It knows how to find the middle when sizes are uneven', () => {
        config.height = 430
        const grid = Grid.empty(config)

        expect(Grid.center(grid)).toEqual(
          expect.objectContaining({
            x: 100,
            y: 200
          })
        )
      })
    })
  })
})
