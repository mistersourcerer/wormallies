const Styles = {
  inward: 'inward'
}

const defaultConfig = {
  width: 400,
  height: 400,
  cellSize: 20,
  borderSize: 1,
  borderStyle: Styles.inward,

  // rendering
  backgroundColor: '#fff',
  borderColor: '#f00',

  debug: {
    coords: false,
    fontSize: 10,
    backgroundColor: '#fff',
    color: '#f00'
  }
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

  for (let row = 0; row < rows; row++) {
    const column = []
    for (let col = 0; col < cols; col++) {
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

const renderCell = (cell, context, config) => {
  context.beginPath()
  // bottom
  let startX = cell.x
  let startY = cell.y + cell.height
  let bottomLineX = cell.x + cell.width
  let bottomLineY = cell.y + cell.height
  let leftLineX = cell.x + cell.width
  let leftLineY = cell.y

  if (config.borderSize % 2 !== 0) {
    startX += 0.5
    startY += 0.5
    bottomLineX += 0.5
    bottomLineY += 0.5
    leftLineX += 0.5
    leftLineY += 0.5
  }

  context.fillStyle = config.backgroundColor
  context.fillRect(cell.x, cell.y, config.cellSize, config.cellSize)

  // bottom
  context.moveTo(startX, startY)
  context.lineTo(bottomLineX, bottomLineY)

  // left
  context.lineTo(leftLineX, leftLineY)

  context.strokeStyle = config.borderColor
  context.lineWidth = config.borderSize
  context.lineCap = 'square'
  context.stroke()
}

const debugCell = (cell, text, context, config) => {
  const position = {
    x: cell.x + config.borderSize,
    y: cell.y + config.borderSize + config.debug.fontSize
  }
  context.font = `${config.debug.fontSize}px sans-serif`

  const size = context.measureText(text)
  context.fillStyle = config.debug.backgroundColor
  context.fillRect(
    position.x,
    position.y - config.debug.fontSize,
    Math.ceil(size.actualBoundingBoxLeft + size.actualBoundingBoxRight),
    Math.ceil(size.actualBoundingBoxAscent + size.actualBoundingBoxDescent + 2)
  )

  context.fillStyle = config.debug.color
  context.fillText(
    text,
    cell.x + config.borderSize,
    cell.y + config.debug.fontSize
  )
}

const render = (grid, context, overrides) => {
  const config = { ...defaultConfig, ...overrides }

  const borderSize = config.borderSize
  const odd = borderSize % 2 !== 0
  let start = 0
  if (odd) start += 0.5

  context.fillStyle = config.backgroundColor
  context.fillRect(start, start, config.width, config.height)

  context.strokeStyle = config.borderColor
  context.strokeRect(start, start, config.width, config.height)

  grid.forEach((cols, row) => {
    cols.forEach((cell, col) => {
      renderCell(cell, context, config)

      if (config.debug.coords) {
        debugCell(cell, `${cell.x}:${cell.y} ${row}:${col}`, context, config)
      }
    })
  })

  return grid
}

const Grid = {
  empty: empty,
  center: center,
  renderCell: renderCell,
  render: render
}

export default Grid
