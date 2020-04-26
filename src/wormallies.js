import { start } from './ticker'
import Grid from './grid'
import Render from './grid_render'

const defaultConfig = {
  width: 800,
  height: 600,
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
let head
let running = false
let timeSinceLastCandy

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
    birth: now
  }
  timeSinceLastCandy = now
  paintCell(cell, '#900')
  // candy should die from time to time
}

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

  drawHead(grid[row][col])
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

  if (shouldSpawnCandy()) spawnCandy()

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

const paintCell = (cell, style) => {
  context.fillStyle = style
  context.fillRect(cell.x + config.cellBorderSize, cell.y, cell.width, cell.height)
}

const drawHead = (newHead) => {
  if (newHead !== undefined) {
    Render.cell(grid, head, config, context)
    head = newHead
  }

  paintCell(head, '#009')
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

const randomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max))
}

export const load = (overrides) => {
  document.onkeydown = control

  config = { ...defaultConfig, ...overrides }
  const canvas = configureCanvas(config)
  context = canvas.getContext('2d')
  grid = Render.grid(Grid.empty(config), config, context)
  candies = grid.map((cols) => {
    return cols.map(_ => false)
  })

  head = Grid.center(grid)
  drawHead(head)

  start(draw, config)
}

document.onreadystatechange = load
