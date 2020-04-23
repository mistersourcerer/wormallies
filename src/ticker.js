const initialState = {
  counter: 0
}
let state = { ...initialState }

const loop = () => {
  state = state.render(state)
  window.requestAnimationFrame(loop)
}

export const start = (render) => {
  console.log('starting loop')
  if (state.render === undefined) state = { ...state, render: render }
  loop()
}
