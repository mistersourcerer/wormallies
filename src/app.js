import './css/app.scss'
import { loadGame } from './wormallies'

const loadOverlay = (config, overlay) => {
  document.querySelector('.game .overlay-dead').style.display = 'none'

  overlay.width = config.width
  overlay.height = config.height

  overlay.style = `
    ${overlay.style};
    width: ${config.width}px;
    height: ${config.height}px;
  `
}

const onStart = (_) => {
  document.querySelector('.game .score .value').style.visibility = 'visible'
  document.querySelector('.game .overlay').style.display = 'none'
  document.querySelector('.game .overlay-start').style.display = 'none'
  document.querySelector('.game .overlay-dead').style.display = 'none'
  document.querySelector('.game .overlay-dead .score').innerText = ''
  document.querySelector('.game .overlay-dead .score').style.display = 'none'
}

const onDie = (_, points) => {
  document.querySelector('.game .score .value').style.visibility = 'hidden'
  document.querySelector('.game .overlay').style.display = 'block'
  document.querySelector('.game .overlay-start').style.display = 'block'
  document.querySelector('.game .overlay-dead').style.display = 'block'
  document.querySelector('.game .overlay-dead .score').style.display = 'block'
  document.querySelector('.game .overlay-dead .score').innerText = `MUCH POINTS: ${points}`
}

const load = () => {
  const value = document.querySelector('.game .score .value')
  value.innerText = '0'
  value.style.visibility = 'hidden'

  const onScore = (score) => {
    if (score > 0) {
      value.innerText = score
      value.style.visibility = 'visible'
    } else {
      value.innerText = '0'
      value.style.visibility = 'hidden'
    }
  }

  const canvas = document.getElementById('wormallies')
  let config

  loadGame({
    onStart: onStart,
    onScore: onScore,
    onDie: onDie,
    canvas: canvas
  }, (_, c) => { config = c })

  loadOverlay(config, document.querySelector('.game .overlay'))
}

document.onreadystatechange = load
