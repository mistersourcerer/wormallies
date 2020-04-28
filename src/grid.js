const Styles = {
  inward: 'inward'
}

const defaultConfig = {
  width: 400,
  height: 400,
  cellSize: 20,
  borderSize: 1,
  borderStyle: Styles.inward
}

const createCell = (col, row, config) => {
  const x = (col * config.cellSize) + (col + 1) * config.borderSize
  const y = (row * config.cellSize) + (row + 1) * config.borderSize
  const width = config.cellSize
  const height = config.cellSize

  return {
    x: x,
    y: y,
    width: width,
    height: height,
    col: col,
    row: row
  }
}

const empty = (overrides) => {
  const config = { ...defaultConfig, ...overrides }
  const totalCellSize = config.cellSize + config.borderSize
  let width = config.width
  let height = config.height

  const cols = Math.floor(width / totalCellSize)
  width = cols * totalCellSize

  const rows = Math.floor(height / totalCellSize)
  height = rows * totalCellSize

  const cells = Array(rows).fill(null).map((_, row) => {
    return Array(cols).fill(null).map((_, col) => createCell(col, row, config))
  })

  return {
    cells: cells,
    config: {
      ...config,
      width: width,
      height: height
    }
  }
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
