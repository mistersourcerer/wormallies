let state = {
  __lastRenderTime__: undefined,
  __render__: undefined,
  config: {}
}

const shouldRender = (now) => {
  let timeSinceLast

  if (state.__lastRenderTime__ === undefined) {
    timeSinceLast = state.config.frameIntervalMs
  } else {
    timeSinceLast = now - state.__lastRenderTime__
  }

  return timeSinceLast >= state.config.frameIntervalMs
}

const loop = () => {
  const now = Date.now()

  if (shouldRender(now)) {
    state = state.config.render(state)
    state.__lastRenderTime__ = now
  }

  window.requestAnimationFrame(loop)
}

export const start = (render, config) => {
  state = {
    ...state,
    config: {
      ...state.config,
      render: render,
      frameIntervalMs: (config.frameIntervalMs === undefined) ? 16 : config.frameIntervalMs
    }
  }
  loop()
}
