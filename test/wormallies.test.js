describe('app', () => {
  let load

  beforeAll(() => {
    document.body.innerHTML = `
      <canvas id="wormallies"></canvas>
    `

    // Forcing the hand so we can test against those measurements
    window.innerWidth = 800
    window.innerHeight = 800

    load = require('wormallies').load
  })

  describe('load', () => {
    let canvas

    beforeAll(() => {
      load({
        width: 400,
        height: 400
      }) // since it is not called by the JSDOM

      canvas = document.getElementById('wormallies')
    })

    test('resizes canvas given the param configurations', () => {
      expect(canvas.width).toBe(400)
      expect(canvas.height).toBe(400)
    })

    test('centralizes the canvas in the window', () => {
      expect(canvas.style.margin).toBe('200px 0px 0px 200px')
    })
  })
})
