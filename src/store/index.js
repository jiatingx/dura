import { defineStore } from 'pinia'

export const store = defineStore('main', {
  // a function that returns a fresh state
  state: () => ({
    counter: 0,
  }),
  // optional getters
  getters: {
    // getters receive the state as first parameter
    doubleCount: (state) => state.counter * 2,
  },
  // optional actions
  actions: {
    reset() {
      // `this` is the store instance
      this.counter = 0
    },
  },
})