describe('app', () => {
  let load

  beforeAll(() => {
    document.body.innerHTML = `
      <canvas id="wormallies"></canvas>
    `

    // Forcing the hand so we can test against those measurements
    window.innerWidth = 800
    window.innerHeight = 800

    load = require('wormallies').loadGame
  })

  describe('loadGame', () => {
    let canvas

    beforeAll(() => {
      canvas = document.getElementById('wormallies')

      load({
        width: 400,
        height: 400,
        canvas: canvas
      }) // since it is not called by the JSDOM
    })

    test('resizes canvas given the param configurations', () => {
      expect(canvas.width).toBe(400)
      expect(canvas.height).toBe(400)
    })
  })
})
