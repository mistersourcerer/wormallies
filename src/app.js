import './css/app.scss'
import { loadGame } from './wormallies'
import Eventify from './eventify'

const loadOverlay = (config, overlay) => {
  document.querySelector('.game .overlay .dead').style.display = 'none'

  overlay.width = config.width
  overlay.height = config.height

  overlay.style = `
    ${overlay.style};
    width: ${config.width}px;
    height: ${config.height}px;
  `
}

const onStart = (_) => {
  console.log('calling me!!!')

  document.querySelector('.game .score .value').style.visibility = 'visible'
  document.querySelector('.game .overlay').style.display = 'none'
  document.querySelector('.game .overlay .start').style.display = 'none'
  document.querySelector('.game .overlay .dead').style.display = 'none'
  document.querySelector('.game .overlay .dead .score').innerText = ''
  document.querySelector('.game .overlay .dead .score').style.display = 'none'
}

const onDie = (e) => {
  const score = e.detail.score

  document.querySelector('.game .score .value').style.visibility = 'hidden'
  document.querySelector('.game .overlay').style.display = 'block'
  document.querySelector('.game .overlay .start').style.display = 'block'
  document.querySelector('.game .overlay .dead').style.display = 'block'
  document.querySelector('.game .overlay .dead .score').style.display = 'block'
  document.querySelector('.game .overlay .dead .score').innerText = `MUCH POINTS: ${score}`
}

const onScore = (e) => {
  const score = e.detail.score
  const value = document.querySelector('.game .score .value')

  if (score > 0) {
    value.innerText = score
    value.style.visibility = 'visible'
  } else {
    value.innerText = '0'
    value.style.visibility = 'hidden'
  }
}

const addHandlers = (target) => {
  Eventify.that(target)

  target.on('wormallies.start', onStart)
  target.on('wormallies.score', onScore)
  target.on('wormallies.die', onDie)

  return target
}

const load = function () {
  const value = document.querySelector('.game .score .value')
  value.innerText = '0'
  value.style.visibility = 'hidden'

  const canvas = document.getElementById('wormallies')
  const gameOverlay = document.querySelector('.game .overlay')
  const afterLoad = (_, c) => {
    config = c

    gameOverlay.width = config.width
    gameOverlay.height = config.height
  }

  let config

  loadGame({
    canvas: canvas,
    handler: addHandlers({}),
    width: (window.innerWidth <= 800) ? window.innerWidth - 50 : 800
  }, afterLoad)

  loadOverlay(config, document.querySelector('.game .overlay'))
}

document.onreadystatechange = load
