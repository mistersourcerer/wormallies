import { start } from './ticker'
import Grid from './grid'
import Eventify from './eventify'

const defaultConfig = {
  width: 500,
  height: 500,
  cellSize: 16,
  borderSize: 1,
  backgroundColor: '#fff3cd',
  borderColor: '#4d3e3e',
  snakeColor: '#ff926b',
  candyColor: '#ff5733',
  poisonColor: '#4d3e3e',
  velocity: 130,
  candyFrequency: 5000, // milisecs
  candyChance: 60, // 70 %
  poisonFrequency: 7000, // milisecs
  poisonChance: 10, // 50 %
  maxScore: 30,
  scoreRounding: 5,
  scoreLost: 3
}

defaultConfig.foodTTL = defaultConfig.velocity * 40 // 40 ticks
defaultConfig.poisonTTL = defaultConfig.velocity * 110

const Direction = {
  north: 'north',
  east: 'east',
  south: 'south',
  west: 'west'
}

const keyDirections = {
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
let dead = false
let lastRun
let timeSinceLastCandy
let timeSinceLastPoison
let snake
let score = 0
let handler = Eventify.that({})
let touchStart

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
      Grid.renderCell(spot.cell, context, { ...config, backgroundColor: style })
    })
  })
}

const drawCandies = () => {
  drawSpots(candies, config.candyColor)
}

const drawPoisons = () => {
  drawSpots(poisons, config.poisonColor)
}

const expireSpots = (spots, ttl) => {
  const now = Date.now()
  if (ttl === undefined) ttl = config.velocity * 10 // ten ticks

  return spots.map((cols) => {
    return cols.map(spot => (now - spot.birth) > ttl ? false : spot)
  })
}

const expireCandies = () => {
  candies = expireSpots(candies, config.foodTTL)
}
const expirePoisons = () => {
  poisons = expireSpots(poisons, config.poisonTTL)
}

const drawSnake = () => {
  snake.forEach((cell) => {
    context.fillStyle = config.snakeColor
    context.fillRect(cell.x, cell.y, cell.width, cell.height)
  })
}

const draw = (state) => {
  if (!running) return state

  const now = Date.now()
  if (!shouldRun(now)) return state

  lastRun = now
  Grid.render(grid, context, config) // clean grid

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
  let counter = 0
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

  if (counter === 1) running = false

  counter++

  return grid[row][col]
}

const trigger = (type, detail) => {
  const eventType = `wormallies.${type}`
  const event = new window.CustomEvent(eventType, { detail: detail, bubbles: true })
  handler.dispatchEvent(event)
}

const die = () => {
  running = false
  dead = true

  trigger('die', {
    grid: grid,
    score: score
  })
}

const scoreFor = (candy) => {
  const units = config.foodTTL / config.maxScore
  const rawScore = config.maxScore - ((Date.now() - candy.birth) / units)

  return Math.ceil(rawScore / config.scoreRounding) * config.scoreRounding
}

const moveSnake = () => {
  const head = newHead()
  let body = []

  if (head === null) return die()

  if (isCandy(head)) {
    body = snake
    score = score + scoreFor(candies[head.row][head.col])
    trigger('score', { score: score })
    candies[head.row][head.col] = false // remove candy
    spawnCandy()
  } else if (isPoison(head)) {
    if (snake.length === 1) return die()
    score -= config.scoreLost
    trigger('score', { score: score })
    body = snake.slice(0, snake.length - 2)
    poisons[head.row][head.col] = false // remove poison
  } else if (isSnake(head)) {
    return die()
  } else {
    body = snake.slice(0, snake.length - 1)
  }

  snake = [head].concat(body)
}

const shouldRun = (now) => {
  if (lastRun === undefined) return true

  return now - lastRun >= config.velocity
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

const shouldChangeDirection = (direction) => {
  return Object.keys(Direction).includes(direction)
}

const move = (direction) => {
  if (shouldChangeDirection(direction)) {
    if (!running) { // starting a new game
      running = true
      trigger('start', { grid: grid })
    }

    if (dead) {
      dead = false
      running = true
      reset()
      trigger('start', { grid: grid })
    }

    directionsBuffer.push(Direction[direction])
  }
}

const randomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max))
}

const falsifyGrid = (grid) => {
  return grid.map(cols => cols.map(_ => false))
}

const reset = () => {
  snake = [Grid.center(grid)]
  score = 0

  candies = falsifyGrid(grid)
  poisons = falsifyGrid(grid)
}

const positionFrom = (event) => {
  return {
    x: event.changedTouches[0].clientX,
    y: event.changedTouches[0].clientY
  }
}

const directionFromTouch = (start, end) => {
  // First we check the direction of the touch (left, right, up, down?)
  const diffX = end.x - start.x
  const horizDirection = (diffX > 0) ? Direction.east : Direction.west
  const diffY = end.y - start.y
  const vertDirection = (diffY > 0) ? Direction.south : Direction.north

  // Then we check if what motion was more "firm/visible"
  // eg.: south west more south or more west?
  // And use this to decide the final direction to move.
  const horiz = (diffX < 0) ? diffX * -1 : diffX
  const vert = (diffY < 0) ? diffY * -1 : diffY

  return (horiz > vert) ? horizDirection : vertDirection
}

const handleTouch = (event) => {
  if (event.type === 'touchstart') {
    touchStart = positionFrom(event)
    return
  }
  // A safe in case touch is "weird"
  if (!touchStart) return move(Direction.north)

  const touchEnd = positionFrom(event)

  move(directionFromTouch(touchStart, touchEnd))
  touchStart = null
}

const handleKey = (event) => {
  move(keyDirections[event.code])
}

const addControlHandlers = (canvas) => {
  document.onkeydown = handleKey

  // touch events
  document.addEventListener('touchstart', handleTouch, false)
  document.addEventListener('touchend', handleTouch, false)
}

export const loadGame = (overrides, callback = (_) => {}) => {
  config = { ...defaultConfig, ...overrides }
  const canvas = config.canvas
  addControlHandlers(canvas)

  const emptyGrid = Grid.empty(config)
  grid = emptyGrid.cells

  handler = config.handler || canvas
  canvas.width = config.width
  canvas.height = config.height
  config.width = emptyGrid.config.width
  config.height = emptyGrid.config.height

  context = canvas.getContext('2d')
  Grid.render(grid, context, config)
  snake = [Grid.center(grid)]

  candies = falsifyGrid(grid)
  poisons = falsifyGrid(grid)

  spawnCandy()
  drawSnake()
  callback(grid, emptyGrid.config)
  start(draw, config)
}
