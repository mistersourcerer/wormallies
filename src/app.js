import './css/app.scss'
import { start } from './ticker'
import Grid from './grid_render'

const defaultConfig = {
  width: 600,
  height: 600,
  cellSize: 20,
  cellBorderSize: 2
}

let grid
let context
let loaded = false

const configureCanvas = (config) => {
  const canvas = document.getElementById('wormallies')

  const position = canvasPosition(config.width, config.height)
  canvas.width = config.width
  canvas.height = config.height
  canvas.style.margin = `${position.x}px 0px 0px ${position.y}px`

  return canvas
}

const canvasPosition = (width, height) => {
  let y = (window.innerWidth / 2) - (width / 2)
  if (y < 0) y = 0
  let x = (window.innerHeight / 2) - (height / 2)
  if (x < 0) x = 0

  return { x: x, y: y }
}

const load = (overrides) => {
  loaded = true

  const config = { ...defaultConfig, ...overrides }
  const canvas = configureCanvas(config)

  context = canvas.getContext('2d')

  grid = Grid.empty(config)
  Grid.draw(grid, context, config)
  start(draw, config)
}

const draw = (state) => {
  // TODO: check if we should draw, and if so, draw it

  console.log('drawing...')

  return state
}

document.onreadystatechange = load

// this is exclusively for test
// since readystatechange seem to not be called by JSDOM (jest...)
// TODO: find where am I wrong here and fix this UGLY ASS mess
if (!loaded) load()
