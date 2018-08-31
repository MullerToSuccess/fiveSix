export default {
  namespaced: true,
  state: {
    aliveCom: []
  },
  getters: {
    getAliveCom(state) {
      return state.aliveCom
    }
  },
  mutations: {
    setAlive(state, payload) {
      if (state.aliveCom.indexOf(payload) === -1) {
        state.aliveCom.push(payload)
      }
    },
    removeAlive(state, payload) {
      if (state.aliveCom.indexOf(payload) > -1) {
        state.aliveCom.splice(state.aliveCom.indexOf(payload), 1)
      }
    },
    clearAlive(state) {
      state.aliveCom = []
    }
  },
  actions: {
    setAlive({commit}, payload) {
      commit('setAlive', payload)
    },
    removeAlive({commit}, payload) {
      commit('removeAlive', payload)
    },
    clearAlive({commit}) {
      commit('clearAlive')
    }
  }
}
