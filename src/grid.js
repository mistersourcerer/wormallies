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

const generateCells = (cols, rows, config) => {
  const cells = []

  // walks the Y axis from higher to lower
  for (let row = rows - 1; row >= 0; row--) {
    const column = []
    for (let col = 0; col < cols; col++) {
      // and then the X axis from lower to higher,
      //
      // so the "render" can "think":
      //  from top to down,
      //  from left to right
      column.push(createCell(col, row, config))
    }
    cells.push(column)
  }

  return cells
}

const empty = (overrides) => {
  const config = { ...defaultConfig, ...overrides }
  const totalCellSize = config.cellSize + config.borderSize
  const rows = Math.floor(config.height / totalCellSize)
  const height = rows * totalCellSize
  const cols = Math.floor(config.width / totalCellSize)
  const width = cols * totalCellSize

  return {
    cells: generateCells(cols, rows, config),
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
