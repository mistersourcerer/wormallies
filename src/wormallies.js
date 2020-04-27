import { start } from './ticker'
import Grid from './grid'
import Render from './grid_render'

const defaultConfig = {
  width: 300,
  height: 300,
  cellSize: 16,
  cellBorderSize: 2,
  backgroundColor: '#fff',
  velocity: 200,
  candyFrequency: 5000, // milisecs
  candyChance: 70 // 70 %
}

const Direction = {
  north: 'north',
  east: 'east',
  south: 'south',
  west: 'west'
}

const directions = {
  ArrowUp: Direction.north,
  ArrowRight: Direction.east,
  ArrowDown: Direction.south,
  ArrowLeft: Direction.west
}

let config
let grid
let candies
let context
let movingTo
let running = false
let lastRun
let timeSinceLastCandy
let snake

const randomPosition = () => {
  return {
    col: randomInt(grid[0].length),
    row: randomInt(grid.length)
  }
}

const shouldSpawnCandy = (chance) => {
  const now = Date.now()
  if (timeSinceLastCandy === undefined) timeSinceLastCandy = now
  if (chance === undefined) chance = config.candyChance
  const positive = Math.floor(Math.random() * 100)

  return positive && now - timeSinceLastCandy >= config.candyFrequency
}

const spawnCandy = () => {
  const now = Date.now()
  const position = randomPosition()
  const cell = grid[position.row][position.col]
  candies[position.row][position.col] = {
    birth: now,
    cell: cell
  }
  timeSinceLastCandy = now
  // candy should die from time to time
}

const drawCandies = () => {
  candies.forEach((cols) => {
    cols.filter(candy => candy !== false).forEach(candy => {
      paintCell(candy.cell, '#900')
    })
  })
}

const paintCell = (cell, style) => {
  // means 'cleanup'
  if (style === undefined) {
    style = config.backgroundColor
    Render.cell(grid, cell, config, context)
  } else {
    context.fillStyle = style
    context.fillRect(cell.x + config.cellBorderSize, cell.y, cell.width, cell.height)
  }
}

const drawSnake = () => {
  snake.forEach((cell) => {
    paintCell(cell, '#009')
  })
}

const draw = (state) => {
  if (!running) return state

  const now = Date.now()
  if (!shouldRun(now)) return state

  lastRun = now
  Render.grid(grid, config, context) // clean grid

  if (shouldSpawnCandy()) spawnCandy()

  moveSnake()
  drawCandies()
  drawSnake()

  return state
}

const isCandy = (position) => {
  return candies[position.row][position.col]
}

const newHead = () => {
  const head = snake[0]

  let row = head.row
  let col = head.col

  switch (movingTo) {
    case Direction.north:
      if (row === 0) return null
      row = head.row - 1
      break
    case Direction.east:
      if (col >= grid[0].length - 1) return null
      col = head.col + 1
      break
    case Direction.south:
      if (row >= grid.length - 1) return null
      row = head.row + 1
      break
    case Direction.west:
      if (col === 0) return null
      col = head.col - 1
      break
  }

  return grid[row][col]
}

const moveSnake = () => {
  const head = newHead()
  let body

  if (head === null) { // is dead?
    // for now, return to center
    snake = [Grid.center(grid)]
    running = false
    return
  }

  if (isCandy(head)) {
    body = snake
    candies[head.row][head.col] = false // remove candy
  } else {
    body = snake.slice(0, snake.length - 1)
  }

  snake = [head].concat(body)
}

const shouldRun = (now) => {
  if (lastRun === undefined) return true

  return now - lastRun >= config.velocity
}

const canvasPosition = (width, height) => {
  let y = (window.innerWidth / 2) - (width / 2)
  if (y < 0) y = 0
  let x = (window.innerHeight / 2) - (height / 2)
  if (x < 0) x = 0

  return { x: x, y: y }
}

const configureCanvas = (config) => {
  const canvas = document.getElementById('wormallies')

  const position = canvasPosition(config.width, config.height)
  canvas.width = config.width
  canvas.height = config.height
  canvas.style.margin = `${position.x}px 0px 0px ${position.y}px`

  return canvas
}

const shouldChangeDirection = (keyCode) => {
  return Object.keys(directions).includes(keyCode)
}

const allowedNewDirections = (direction) => {
  let forbidden
  switch (direction) {
    case Direction.north:
      forbidden = Direction.south
      break
    case Direction.east:
      forbidden = Direction.west
      break
    case Direction.south:
      forbidden = Direction.north
      break
    case Direction.west:
      forbidden = Direction.east
      break
  }

  return [
    Direction.north,
    Direction.east,
    Direction.south,
    Direction.west
  ].filter(direction => direction !== forbidden)
}

const canChangeTo = (direction) => {
  return allowedNewDirections(movingTo).includes(direction)
}

const changeDirection = (direction) => {
  // TODO: accumulate keystrokes to turn real fast if necessary

  if (canChangeTo(direction)) {
    movingTo = direction
  }
}

const control = (event) => {
  // TODO: add a buffer of movements to allow those nice SHARP turns
  // probably should be implemented inside changeDirection
  if (shouldChangeDirection(event.code)) {
    running = true
    changeDirection(directions[event.code])
  }
}

const randomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max))
}

export const load = (overrides) => {
  document.onkeydown = control

  config = { ...defaultConfig, ...overrides }
  context = configureCanvas(config).getContext('2d')
  grid = Render.grid(Grid.empty(config), config, context)
  candies = grid.map((cols) => {
    return cols.map(_ => false)
  })

  snake = [Grid.center(grid)]
  console.log(snake)

  drawSnake()
  start(draw, config)
}

document.onreadystatechange = load
