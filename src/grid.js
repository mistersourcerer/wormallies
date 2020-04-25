const empty = (config) => {
  const totalCellSize = config.cellSize + (config.cellBorderSize * 1.5)
  const cols = Math.floor(config.width / totalCellSize)
  const rows = Math.floor(config.height / totalCellSize)

  return Array(rows).fill(null).map((_) => {
    return Array(cols).fill(null).map(_ => {
      return {
        x: null,
        y: null,
        width: null,
        height: null,
        row: null,
        col: null
      }
    })
  })
}

const drawCell = (cell, grid, context, config) => {
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

const draw = (grid, context, config) => {
  grid.forEach((cols, row) => {
    const y = (row * config.cellBorderSize) + (row * config.cellSize)

    cols.forEach((cell, col) => {
      const x = (col * config.cellBorderSize) + (col * config.cellSize)
      cell.x = x + config.cellBorderSize
      cell.y = y + (config.cellBorderSize / 2)
      cell.width = config.cellSize
      cell.height = config.cellSize
      cell.row = row
      cell.col = col

      drawCell(cell, grid, context, config)
    })
  })
}

const center = (grid) => {
  const row = Math.floor(grid.length / 2)
  const col = Math.floor(grid[0].length / 2)

  return grid[row][col]
}

const Grid = {
  draw: draw,
  empty: empty,
  center: center,
  drawCell: drawCell
}

export default Grid
