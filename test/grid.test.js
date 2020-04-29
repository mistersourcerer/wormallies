import Grid from 'grid'

describe('Grid', () => {
  let config

  beforeEach(() => {
    config = {
      cellSize: 3,
      width: 10,
      height: 10,
      borderSize: 2
    }
  })

  describe('generation', () => {
    describe('empty()', () => {
      test('calculates number of cols and rows that fit on a grid and generate it', () => {
        const grid = Grid.empty(config).cells

        expect(grid.length).toBe(2)
        expect(grid[0].length).toBe(2)
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
            width: 3,
            height: 3
          })
        )
      })

      test('form the right quadrant (goes down to the origin)', () => {
        const grid = Grid.empty(config).cells

        expect(grid[0][0]).toEqual(
          expect.objectContaining({
            x: 2,
            y: 2
          })
        )

        expect(grid[1][1]).toEqual(
          expect.objectContaining({
            x: 7,
            y: 7
          })
        )
      })

      describe('Uneven dimensions', () => {
        test('generates the correct amount of cells', () => {
          const newConfig = { ...config, width: 10, height: 16 }
          const grid = Grid.empty(newConfig).cells

          expect(grid.length).toBe(3)
          expect(grid[0].length).toBe(2)
        })
      })

      describe('Adjusting dimensions for border', () => {
        test('odd sized', () => {
          const newConfig = { ...config, borderSize: 1 }

          expect(Grid.empty(newConfig).config).toEqual(
            expect.objectContaining({
              width: 8,
              height: 8
            })
          )
        })

        test('even sized', () => {
          const newConfig = { ...config, width: 11, height: 11 }

          expect(Grid.empty(newConfig).config).toEqual(
            expect.objectContaining({
              width: 10,
              height: 10
            })
          )
        })
      })
    })

    describe('center()', () => {
      test('returns the most center cell in the grid', () => {
        const newConfig = { ...config, width: 15, height: 15 }
        const grid = Grid.empty(newConfig).cells

        expect(Grid.center(grid)).toEqual(
          expect.objectContaining({
            x: 7,
            y: 7
          })
        )
      })

      describe('Uneven dimensions', () => {
        test('knows how to find the middle when sizes are uneven', () => {
          const newConfig = { ...config, width: 15, height: 21 }
          const grid = Grid.empty(newConfig).cells

          expect(Grid.center(grid)).toEqual(
            expect.objectContaining({
              x: 7,
              y: 12
            })
          )
        })
      })
    })
  })

  describe.skip('rendering', () => {
  })
})
