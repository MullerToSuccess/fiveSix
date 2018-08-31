import * as types from './mutation-types'

export default {
  namespaced: true,
  state: {
    studentDetails: {},
    studentHostingArray: [],
    classInfo: {},
    currentTrusteeship: {},
    currentImage: {},
    feedbackId: ''
  },
  getters: {
    studentDetails: state => state.studentDetails,
    studentHostingArray: state => state.studentHostingArray,
    classInfo: state => state.classInfo,
    currentTrusteeship: state => state.currentTrusteeship,
    currentImage: state => state.currentImage,
    feedbackId: state => state.feedbackId
  },
  mutations: {
    [types.SET_STUDENTDETAILS] (state, studentDetails) {
      state.studentDetails = studentDetails
    },
    [types.SET_STUDENTHOSTINGARRAY] (state, studentHostingArray) {
      state.studentHostingArray = studentHostingArray
    },
    [types.SET_CLASSINFO] (state, classInfo) {
      state.classInfo = classInfo
    },
    [types.SET_CURRENTTRUSTEESHIP] (state, currentTrusteeship) {
      state.currentTrusteeship = currentTrusteeship
    },
    [types.SET_CURRENTIMAGEARRAY] (state, currentImage) {
      state.currentImage = currentImage
    },
    [types.SET_FEEDBACKID] (state, feedbackId) {
      state.feedbackId = feedbackId
    }
  },
  actions: {
    studentInfoAction ({commit}, data) {
      commit('SET_STUDENTDETAILS', data)
    },
    studentHostingArrayAction ({commit}, data) {
      commit('SET_STUDENTHOSTINGARRAY', data)
    },
    classInfoAction ({commit}, data) {
      commit('SET_CLASSINFO', data)
    },
    currentTrusteeshipAction ({commit}, data) {
      commit('SET_CURRENTTRUSTEESHIP', data)
    },
    currentImageArrayAction ({commit}, data) {
      commit('SET_CURRENTIMAGEARRAY', data)
    }
  }
}
