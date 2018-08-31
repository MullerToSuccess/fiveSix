import * as types from './mutation-types'
import my from '../api/my'
import stroage from '@/store/stroage.js'
export default {
  namespaced: true,
  state: {
    details: {},
    baseInfo: {},
    classLists: [],
    userName: '',
    version: ''
  },
  getters: {
    details: state => state.details,
    baseInfo: state => state.baseInfo,
    classLists: state => state.classLists,
    userName: state => state.userName,
    version: state => state.version
  },
  mutations: {
    [types.SET_VERSION] (state, version) {
      state.version = version
    },
    [types.SET_DETAILS] (state, baseInfo) {
      state.baseInfo = baseInfo
    },
    [types.SET_BASEINFO] (state, baseInfo) {
      state.baseInfo = baseInfo
    },
    [types.SET_CLASSLISTS] (state, classLists) {
      state.classLists = classLists
    },
    [types.SET_VERSION] (state, val) {
      state.version = val
    },
    [types.SET_USERNAME] (state, val) {
      state.userName = val
    }
  },
  actions: {
    getUserInfo ({ state, commit }) {
      return my.getUserInfo({
        schoolId: window.bus.$store.getters['account/schoolId']
      }).then(r => {
        if (stroage['persistent'].get('userIdentity').indexOf(r.baseInfo.role) < 0) { // 此情况发生于后台修改身份
          let env = stroage['persistent'].get('runEnv.env') || ''
          stroage['persistent'].clear()
          stroage['persistent'].set('runEnv.env', env)
        }
        commit('SET_DETAILS', r.data)
        commit('SET_BASEINFO', r.baseInfo)
        commit('SET_USERNAME', r.baseInfo.name)
        if (r.classList) commit('SET_CLASSLISTS', r.classList)
        return r
      })
    }
  }
}
