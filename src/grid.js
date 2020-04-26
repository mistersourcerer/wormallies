const defaultConfig = {
  width: 400,
  height: 400,
  cellSize: 20,
  cellBorderSize: 0
}

const empty = (overrides) => {
  const config = { ...defaultConfig, ...overrides }
  const totalCellSize = config.cellSize + (config.cellBorderSize * 1.5)
  const cols = Math.floor(config.width / totalCellSize)
  const rows = Math.floor(config.height / totalCellSize)

  return Array(rows).fill(null).map((_, row) => {
    const y = (row * config.cellBorderSize) + (row * config.cellSize)

    return Array(cols).fill(null).map((_, col) => {
      const x = (col * config.cellBorderSize) + (col * config.cellSize)

      return {
        x: x + config.cellBorderSize,
        y: y + (config.cellBorderSize / 2),
        width: config.cellSize,
        height: config.cellSize,
        row: row,
        col: col
      }
    })
  })
}

const center = (grid) => {
  const row = Math.floor(grid.length / 2)
  const col = Math.floor(grid[0].length / 2)

  return grid[row][col]
}

const Grid = {
  empty: empty,
  center: center
}

export default Grid
