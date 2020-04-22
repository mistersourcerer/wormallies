let counter = 0
const loop = () => {
  counter += 1

  if (counter === 50) {
    console.log('tick')
    counter = 0
  }

  window.requestAnimationFrame(loop)
}

export const start = () => {
  console.log('will loop')
  loop()
}
