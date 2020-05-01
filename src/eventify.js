// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget

const addEventRegisters = (target, events) => {
  events.forEach(type => {
    const handler = `on${type}`
    Object.defineProperty(target, handler, {
      set: (callback) => target.addEventListener(type, callback),
      get: () => target[handler]
    })
  })

  return target
}

const target = {
  listeners: {},

  dispatchEvent: function (event) {
    if (!(event.type in this.listeners)) {
      return true
    }
    var stack = this.listeners[event.type].slice()

    for (var i = 0, l = stack.length; i < l; i++) {
      stack[i].call(this, event)
    }
    return !event.defaultPrevented
  },

  addEventListener: function (type, callback) {
    if (!(type in this.listeners)) {
      this.listeners[type] = []
    }
    this.listeners[type].push(callback)
  },

  removeEventListener: function (type, callback) {
    if (!(type in this.listeners)) return

    var stack = this.listeners[type]
    for (var i = 0, l = stack.length; i < l; i++) {
      if (stack[i] === callback) {
        stack.splice(i, 1)
        return
      }
    }
  },

  on: function (name, callback) {
    this.addEventListener(name, callback)
  }
}

const that = (objectToMix, options = { events: [] }) => {
  const mixed = Object.assign(objectToMix, target)

  return addEventRegisters(mixed, options.events)
}

const Eventify = {
  that: that
}

export default Eventify
