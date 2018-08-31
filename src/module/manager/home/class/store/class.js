import * as types from './mutation-types'

export default {
  namespaced: true,
  state: {
    classId: '',
    cStudentId: '',
    saveClass: {},
    classDetail: {},
    weekNameList: []
  },
  getters: {
    classId: state => state.classId,
    cStudentId: state => state.cStudentId,
    saveClass: state => state.saveClass,
    classDetail: state => state.saveClass,
    weekNameList: state => state.weekNameList
  },
  mutations: {
    [types.SET_CLASSID] (state, classId) {
      state.classId = classId
    },
    [types.SET_CSTUDENTID] (state, cStudentId) {
      state.cStudentId = cStudentId
    },
    [types.SET_SAVECLASS] (state, json) {
      state.saveClass = Object.assign(state.saveClass, json)
    },
    [types.CLEAR_SAVECLASS] (state) {
      state.saveClass = {}
    },
    [types.SET_WEEKNAMELIST] (state, weekNameList) {
      state.weekNameList = weekNameList
    }
  },
  actions: {
    getStudentDetails ({ state, commit }) {
    }
  }
}
