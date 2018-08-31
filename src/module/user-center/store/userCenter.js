let notice = JSON.parse(localStorage.getItem('notice'))
export default {
  namespaced: true,
  state: {
    hwMsg: notice ? notice.hwMsg : true,
    schMsg: notice ? notice.schMsg : true,
    version: ''
  },
  getters: {
    userId (state, getters, rootState) {
      return rootState.account.userInfo && rootState.account.userInfo.userid
    }
  },
  mutations: {
    sethwMsg (state, payload) {
      state.hwMsg = payload.val
    },
    setschMsg (state, payload) {
      state.schMsg = payload.val
    },
    setVersion (state, val) {
      state.version = val
    }
  },
  actions: {}
}
