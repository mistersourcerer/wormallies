import './css/app.scss'
import { loadGame } from './wormallies'

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

  loadGame({ onScore: onScore })
}

document.onreadystatechange = load
