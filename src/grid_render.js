const defaultConfig = {
  width: 800,
  height: 600,
  cellSize: 16,
  cellBorderSize: 2,
  backgroundColor: '#fff'
}

const renderCell = (grid, cell, overrides, context) => {
  const config = { ...defaultConfig, ...overrides }
  const x = cell.x
  const y = cell.y
  const row = cell.row
  const col = cell.col
  const cols = grid[cell.row]
  const size = config.cellSize + config.cellBorderSize

  context.beginPath()

  // background
  context.fillStyle = config.backgroundColor
  context.fillRect(x, y, size, size)

  if (row === 0) {
    // draw tops
    context.moveTo(x + config.cellBorderSize, y + config.cellBorderSize)
    context.lineTo(x + config.cellSize, y + config.cellBorderSize)
    context.stroke()
  }

  if (col === cols.length - 1) {
    context.moveTo(x + config.cellSize + (config.cellBorderSize / 2), y + config.cellBorderSize)
    context.lineTo(x + config.cellSize + (config.cellBorderSize / 2), y + config.cellSize)
    context.stroke()
  }

  context.moveTo(x + config.cellBorderSize, y + config.cellBorderSize)
  context.lineTo(x + config.cellBorderSize, y + config.cellSize)
  context.stroke()

  context.moveTo(x + config.cellBorderSize, y + config.cellSize)
  context.lineTo(x + config.cellBorderSize + config.cellSize, y + config.cellSize)
  context.stroke()
}

const renderGrid = (grid, overrides, context) => {
  const config = { ...defaultConfig, ...overrides }

  grid.forEach((cols, row) => {
    cols.forEach((cell, col) => {
      renderCell(grid, cell, config, context)
    })
  })

  return grid
}

const Render = {
  grid: renderGrid,
  cell: renderCell
}

export default Render
