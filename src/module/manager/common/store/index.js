import * as types from './mutation-types'

export default {
  namespaced: true,
  state: {
    schoolId: '', // 学校
    editMsg: {}, // 某些修改信息
    editMsgKey: '', //  修改信息的键值
    isSave: false, // 是否能发送接口,
    filePath: '',
    fileUrl: '',
    imgShow: false,
    scrollY: ''
  },
  getters: {
    schoolId: state => state.schoolId,
    editMsg: state => state.editMsg,
    editMsgKey: state => state.editMsgKey,
    isSave: state => state.isSave,
    filePath: state => state.filePath,
    imgShow: state => state.imgShow,
    fileUrl: state => state.fileUrl,
    scrollY: state => state.scrollY
  },
  mutations: {
    [types.SET_SCHOOLID] (state, schoolId) {
      state.schoolId = schoolId
    },
    [types.SET_EDITMSG] (state, editMsg) {
      state.editMsg = editMsg
    },
    [types.SET_EDITMSGKEY] (state, editMsgKey) {
      state.editMsgKey = editMsgKey
    },
    [types.SET_ISSAVE] (state, isSave) {
      state.isSave = isSave
    },
    [types.SET_FILEPATH] (state, filePath) {
      state.filePath = filePath
    },
    [types.SET_IMGSHOW] (state, imgShow) {
      state.imgShow = imgShow
    },
    [types.SET_FILEURL] (state, fileUrl) {
      state.fileUrl = fileUrl
    },
    [types.SET_SCROLLY] (state, scrollY) {
      state.scrollY = scrollY
    }
  },
  actions: {
  }
}
