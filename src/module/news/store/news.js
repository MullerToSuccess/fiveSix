import storage from "@/store/stroage";

export default {
  namespaced: true,
  state: {
    newMsg: false,
    msg: {
      newDepositMsg: 0,
      newGuardianMsg: 0,
      newSystemMsg: 0
    },
    mqtt: {
      newDepositMsg: [],
      newGuardianMsg: [],
      newSystemMsg: []
    },
    nextParams: {}
  },
  getters: {
    newMsg: state => state.newMsg,
    msg: state => state.msg,
    mqtt: state => state.mqtt,
    newDepositMsg: state => state.newDepositMsg,
    newGuardianMsg: state => state.newGuardianMsg,
    newSystemMsg: state => state.newSystemMsg,
    nextParams: state => state.nextParams
  },
  mutations: {
    setMsg(state, val) {
      state.newMsg = val
    },
    setDepositMsg(state, val) {
      state.msg.newDepositMsg = val ? ++state.msg.newDepositMsg : 0
    },
    setGuardianMsg(state, val) {
      state.msg.newGuardianMsg = val ? ++state.msg.newGuardianMsg : 0
    },
    setSystemMsg(state, val) {
      state.msg.newSystemMsg = val ? ++state.msg.newSystemMsg : 0
    },
    setMqtt(state, val) {
      for (let key in val) {
        if (state.mqtt[key].indexOf(val) < 0) state.mqtt[key].push(val[key])
      }
    },
    clearMsg (state) {
      state.msg = {
        newDepositMsg: 0,
        newGuardianMsg: 0,
        newSystemMsg: 0
      }
    },
    clearMqtt(state, val) {
      if (typeof val === 'string') {
        state.mqtt[val] = []
      } else if (typeof val === 'object') {
        state.mqtt = {
          newDepositMsg: [],
          newGuardianMsg: [],
          newSystemMsg: []
        }
      }
    },
    setNextParams(state, val) {
      state.nextParams = val
    }
  },
  actions: {
    connectMqtt(state) {
      setTimeout(() => {
        if (!window.bus.mqtt.client || !window.bus.mqtt.client.isConnected()) {
          window.bus.mqtt.connect();
        }
      }, 1000)
    }
  }

}
