import { start } from './ticker'
import Grid from './grid'
import Render from './grid_render'

const defaultConfig = {
  width: 500,
  height: 500,
  cellSize: 16,
  cellBorderSize: 1,
  backgroundColor: '#fcf8f3',
  snakeColor: '#e7d39f',
  candyColor: '#d7385e',
  poisonColor: '#100303',
  velocity: 130,
  candyFrequency: 5000, // milisecs
  candyChance: 60, // 70 %
  poisonFrequency: 7000, // milisecs
  poisonChance: 10, // 50 %
  maxPoints: 30,
  pointRounding: 5,
  pointsLost: 3,
  onScore: (_) => {}
}

defaultConfig.candyTTL = defaultConfig.velocity * 40 // 40 ticks
defaultConfig.poisonTTL = defaultConfig.velocity * 110

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

let directionsBuffer = []

let config
let grid
let candies
let poisons
let context
let movingTo
let running = false
let lastRun
let timeSinceLastCandy
let timeSinceLastPoison
let snake
let points = 0

const randomPosition = () => {
  return {
    col: randomInt(grid[0].length),
    row: randomInt(grid.length)
  }
}

const shouldSpawn = (chance, frequency, lastSpawn) => {
  const now = Date.now()
  if (lastSpawn === undefined) lastSpawn = now
  if ((now - lastSpawn) <= frequency) return false

  return chance > Math.floor(Math.random() * 100)
}

const shouldSpawnCandy = () => {
  if (timeSinceLastCandy === undefined) timeSinceLastCandy = Date.now()
  return shouldSpawn(config.candyChance, config.candyFrequency, timeSinceLastCandy)
}

const shouldSpawnPoison = () => {
  if (timeSinceLastPoison === undefined) timeSinceLastPoison = Date.now()
  return shouldSpawn(config.poisonChance, config.poisonFrequency, timeSinceLastPoison)
}

const spawnCell = () => {
  const position = randomPosition()

  return {
    birth: Date.now(),
    position: { col: position.col, row: position.row },
    cell: grid[position.row][position.col]
  }
}

const spawnCandy = () => {
  const cell = spawnCell()
  timeSinceLastCandy = cell.birth
  candies[cell.position.row][cell.position.col] = cell
}

const spawnPoison = () => {
  const cell = spawnCell()
  timeSinceLastPoison = cell.birth
  poisons[cell.position.row][cell.position.col] = cell
}

const drawSpots = (spotGrid, style) => {
  spotGrid.forEach((cols) => {
    cols.filter(spot => spot !== false).forEach(spot => {
      paintCell(spot.cell, style)
    })
  })
}

const drawCandies = () => {
  drawSpots(candies, config.candyColor)
}

const drawPoisons = () => {
  drawSpots(poisons, config.poisonColor)
}

const expireSpots = (grid, ttl) => {
  const now = Date.now()
  if (ttl === undefined) ttl = config.velocity * 10 // ten ticks

  return grid.map((cols) => {
    return cols.map(spot => (now - spot.birth) > ttl ? false : spot)
  })
}

const expireCandies = () => {
  candies = expireSpots(candies, config.candyTTL)
}
const expirePoisons = () => {
  poisons = expireSpots(poisons, config.poisonTTL)
}

const paintCell = (cell, style) => {
  // means 'cleanup'
  if (style === undefined) {
    style = config.backgroundColor
    Render.cell(grid, cell, config, context)
  } else {
    context.fillStyle = style
    context.fillRect(
      cell.x + config.cellBorderSize * 1.5,
      cell.y - config.cellBorderSize / 2,
      cell.width,
      cell.height
    )
  }
}

const drawSnake = () => {
  snake.forEach((cell) => {
    paintCell(cell, config.snakeColor)
  })
}

const draw = (state) => {
  if (!running) return state

  const now = Date.now()
  if (!shouldRun(now)) return state

  lastRun = now
  Render.grid(grid, config, context) // clean grid

  if (shouldSpawnCandy()) spawnCandy()
  if (shouldSpawnPoison()) spawnPoison()

  expireCandies()
  expirePoisons()

  changeDirection()
  moveSnake()
  drawCandies()
  drawPoisons()
  drawSnake()

  return state
}

const isCandy = (position) => {
  return candies[position.row][position.col]
}

const isPoison = (position) => {
  return poisons[position.row][position.col]
}

const isSnake = (position) => {
  return snake.some(part => {
    return part.col === position.col && part.row === position.row
  })
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

const die = () => {
  snake = [Grid.center(grid)]
  running = false
  points = 0
  configureSpots()
}

const pointsFor = (candy) => {
  const units = config.candyTTL / config.maxPoints
  const rawPoints = config.maxPoints - ((Date.now() - candy.birth) / units)

  return Math.ceil(rawPoints / config.pointRounding) * config.pointRounding
}

const moveSnake = () => {
  const head = newHead()
  let body

  if (head === null) return die()

  if (isCandy(head)) {
    body = snake
    points = points + pointsFor(candies[head.row][head.col])
    candies[head.row][head.col] = false // remove candy
    spawnCandy()
  } else if (isPoison(head)) {
    if (snake.length === 1) return die()
    points -= config.pointsLost
    body = snake.slice(0, snake.length - 2)
    poisons[head.row][head.col] = false // remove poison
  } else if (isSnake(head)) {
    return die()
  } else {
    body = snake.slice(0, snake.length - 1)
  }

  config.onScore(points)

  snake = [head].concat(body)
}

const shouldRun = (now) => {
  if (lastRun === undefined) return true

  return now - lastRun >= config.velocity
}

const configureCanvas = (config) => {
  const canvas = document.getElementById('wormallies')

  canvas.width = config.width
  canvas.height = config.height

  return canvas
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

const changeDirection = () => {
  const direction = directionsBuffer.slice(0, 1)[0]

  directionsBuffer = directionsBuffer.slice(1, directionsBuffer.length)
  if (canChangeTo(direction)) {
    movingTo = direction
  }
}

const shouldChangeDirection = (keyCode) => {
  return Object.keys(directions).includes(keyCode)
}

const control = (event) => {
  if (shouldChangeDirection(event.code)) {
    running = true
    directionsBuffer.push(directions[event.code])
  }
}

const randomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max))
}

const configureSpots = () => {
  candies = grid.map((cols) => {
    return cols.map(_ => false)
  })

  poisons = grid.map((cols) => {
    return cols.map(_ => false)
  })
}

export const loadGame = (overrides) => {
  document.onkeydown = control

  config = { ...defaultConfig, ...overrides }
  context = configureCanvas(config).getContext('2d')
  grid = Render.grid(Grid.empty(config), config, context)

  snake = [Grid.center(grid)]

  configureSpots()
  spawnCandy()
  drawSnake()
  start(draw, config)
}
