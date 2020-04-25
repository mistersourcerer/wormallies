import './css/app.scss'
import { start } from './ticker'
import Grid from './grid'

const defaultConfig = {
  width: 800,
  height: 600,
  cellSize: 16,
  cellBorderSize: 2,
  backgroundColor: '#fff',
  velocity: 200
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
let context
let movingTo
let head
let loaded = false
let running = false

const moveHead = () => {
  let row = head.row
  let col = head.col

  switch (movingTo) {
    case Direction.north:
      if (row === 0) return
      row = head.row - 1
      break
    case Direction.east:
      if (col >= grid[0].length - 1) return
      col = head.col + 1
      break
    case Direction.south:
      if (row >= grid.length - 1) return
      row = head.row + 1
      break
    case Direction.west:
      if (col === 0) return
      col = head.col - 1
      break
  }

  drawHead(context, grid[row][col])
}

let lastRun

const shouldRun = (now) => {
  if (lastRun === undefined) return true

  return now - lastRun >= config.velocity
}

const draw = (state) => {
  if (!running) return state

  const now = Date.now()
  if (!shouldRun(now)) return state

  lastRun = now
  moveHead()

  return state
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

const drawHead = (context, newHead) => {
  if (newHead !== undefined) {
    Grid.drawCell(head, grid, context, config)
    head = newHead
  }

  context.fillStyle = '#009'
  context.fillRect(head.x + config.cellBorderSize, head.y, head.width, head.height)
}

const shouldChangeDirection = (keyCode) => {
  return Object.keys(directions).includes(keyCode)
}

const changeDirection = (direction) => {
  movingTo = direction
}

const control = (event) => {
  if (shouldChangeDirection(event.code)) {
    running = true
    changeDirection(directions[event.code])
  }
}

const load = (overrides) => {
  loaded = true
  config = { ...defaultConfig, ...overrides }
  const canvas = configureCanvas(config)
  context = canvas.getContext('2d')
  grid = Grid.empty(config)

  document.onkeydown = control

  Grid.draw(grid, context, config)
  head = Grid.center(grid)
  drawHead(context)

  start(draw, config)
}

document.onreadystatechange = load

// this is exclusively for test
// since readystatechange seem to not be called by JSDOM (jest...)
// TODO: find where am I wrong here and fix this UGLY ASS mess
if (!loaded) load()
