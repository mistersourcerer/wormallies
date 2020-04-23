const emptyGrid = (config) => {
  const totalCellSize = config.cellSize + config.cellBorderSize
  const cols = Math.floor(config.width / totalCellSize)
  const rows = Math.floor(config.height / totalCellSize)
  return Array(rows).fill(Array(cols).fill(null))
}

const drawGrid = (grid, context, config) => {
  grid.forEach((cols, row) => {
    const y = (row * config.cellBorderSize) + (row * config.cellSize)

    cols.forEach((cell, col) => {
      const x = (col * config.cellBorderSize) + (col * config.cellSize)
      context.beginPath()

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
    })
  })
}

const GridRender = {
  with: (context, config) => {
    const grid = emptyGrid(config)

    return (state) => {
      const newState = { ...state, counter: state.counter + 1 }

      if (state.counter === 50) {
        console.log('tick')
        newState.counter = 0

        drawGrid(grid, context, config)
      }

      return newState
    }
  }
}

export default GridRender
