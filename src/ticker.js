const initialState = {
  counter: 0,
  render: (state) => state
}
let state = { ...initialState }

const loop = () => {
  state = state.render(state)
  window.requestAnimationFrame(loop)
}

export const start = (render) => {
  console.log('starting loop')
  state.render = render
  loop()
}
