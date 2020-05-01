import Eventify from 'eventify'

describe('Eventify', () => {
  let eventified

  describe('that()', () => {
    describe('mixing EventTarget interface', () => {
      beforeEach(() => {
        eventified = Eventify.that({ original: 'Here' })
      })

      test('dispatchEvent', () => {
        expect('dispatchEvent' in eventified).toBe(true)
      })

      test('addEventListener', () => {
        expect('addEventListener' in eventified).toBe(true)
      })

      test('removeEventListener', () => {
        expect('removeEventListener' in eventified).toBe(true)
      })

      test('keeps the original object intact', () => {
        expect(eventified.original).toBe('Here')
      })
    })

    describe('on* functions', () => {
      let withOnFuns

      beforeEach(() => {
        withOnFuns = Eventify.that({}, { events: ['omg', 'lol'] })
      })

      test('creates on* functions given a "events" option', () => {
        expect('onomg' in withOnFuns).toBe(true)
        expect('onlol' in withOnFuns).toBe(true)
      })

      test('dispatches events registered by on* functions', () => {
        let bbq = false
        withOnFuns.onlol = (e) => { bbq = e.detail.bbq }
        withOnFuns.dispatchEvent(
          new window.CustomEvent('lol', { detail: { bbq: true } })
        )

        expect(bbq).toBe(true)
      })
    })
  })

  describe('on()', () => {
    beforeEach(() => {
      eventified = Eventify.that({})
    })

    test('registers an event handler (associated to the event name)', () => {
      let called
      eventified.on('lol', (e) => { called = e.detail.called })
      eventified.dispatchEvent(
        new window.CustomEvent('lol', { detail: { called: 42 } })
      )

      expect(called).toBe(42)
    })
  })
})
