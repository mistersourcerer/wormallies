import Grid from 'grid'

describe('Grid', () => {
  let config

  beforeEach(() => {
    config = {
      cellSize: 50,
      width: 200,
      height: 300,
      borderSize: 2
    }
  })

  describe('empty()', () => {
    test('calculates number of cols and rows that fit on a grid and generate it', () => {
      const grid = Grid.empty(config).cells

      expect(grid.length).toBe(5)
      expect(grid[0].length).toBe(3)
    })

    test('calulate cell dimensions correctly', () => {
      const grid = Grid.empty(config).cells
      const cell = grid[0][0]

      expect(cell).toEqual(
        expect.objectContaining({
          // border
          x: 2,
          y: 2,
          // actual size discounting borders
          width: 50,
          height: 50
        })
      )
    })

    describe('Uneven dimensions', () => {
      test('generates the correct amount of cells', () => {
        config.height = 360
        config.width = 260
        const grid = Grid.empty(config).cells

        expect(grid.length).toBe(6)
        expect(grid[0].length).toBe(5)
      })
    })

    describe('Adjusting dimensions for border', () => {
      test('odd sized', () => {
        const newConfig = { ...config, borderSize: 1 }

        expect(Grid.empty(newConfig).config).toEqual(
          expect.objectContaining({
            width: 153,
            height: 255
          })
        )
      })

      test('even sized', () => {
        expect(Grid.empty(config).config).toEqual(
          expect.objectContaining({
            width: 156,
            height: 260
          })
        )
      })
    })
  })

  describe('center()', () => {
    test('returns the most center cell in the grid', () => {
      config.height = 200
      const grid = Grid.empty(config).cells

      expect(Grid.center(grid)).toEqual(
        expect.objectContaining({
          x: 54,
          y: 54
        })
      )
    })

    describe('Uneven dimensions', () => {
      test('It knows how to find the middle when sizes are uneven', () => {
        config.height = 430
        const grid = Grid.empty(config).cells

        expect(Grid.center(grid)).toEqual(
          expect.objectContaining({
            x: 54,
            y: 210
          })
        )
      })
    })
  })
})
