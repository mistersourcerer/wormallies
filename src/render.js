export const render = (state) => {
  const newState = { ...state, counter: state.counter + 1 }

  if (state.counter === 50) {
    console.log('tick')
    newState.counter = 0
  }

  return newState
}
