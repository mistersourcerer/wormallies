const defaultConfig = {
  backgroundColor: '#fff',
  borderColor: '#f00',
  debug: {
    coords: true
  }
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

const renderGrid = (grid, context, overrides) => {
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
    })
  })

  return grid
}

const Render = {
  grid: renderGrid,
  cell: renderCell
}

export default Render
