export default {
  namespaced: true,
  state: {
    resource: [],
    params: null,
    studentAnswerDetailData: {},
    studentOneDetail: {},
    icomDetail: [],
    tongjiResource: [],
    tongjiParams: null,
    studentAllInfoObj: {
      comment: '',
      comment_audio: {}
    }
  },
  getters: {
  },
  mutations: {
    setParams: (state, payload) => {
      state.params = payload
    },
    clearParams: state => {
      state.params = null
    },
    setTongjiParams: (state, payload) => {
      state.tongjiParams = payload
    },
    clearTongjiParams: state => {
      state.tongjiParams = null
    },
    setParamsIndex: (state, payload) => {
      state.params.index = payload
    },
    setParamsCurrentIndex: (state, index) => {
      state.params.currentIndex = index
    },
    setTongjiResource: (state, payload) => {
      state.tongjiResource = payload
    },
    clearTongjiResource: state => {
      state.tongjiResource = []
    },
    setResource: (state, payload) => {
      state.resource = [...payload]
    },
    modifyResource: (state, payload) => {
      state.resource.splice(payload.currentIndex, 1, ...payload.newResource)
    },
    clearResource: state => {
      state.resource = []
    },
    setStudentAnswerDetailData: (state, payload) => {
      state.studentAnswerDetailData = payload
    },
    setStudentOneDetail: (state, payload) => {
      state.studentOneDetail = payload
    },
    setCorrectStatus: (state) => {
      state.resource[state.params.index].status ? state.resource[state.params.index].status = 3 : state.resource[state.params.index].pigai_status = 3
    },
    setIcomDetail: (state, payload) => {
      state.icomDetail = payload
    },
    setSubjectIcomInfo: (state, payload) => {
      state.resource[payload.index]['info'] = payload.info
    },
    setStudentAllInfoObj: (state, result) => {
      state.studentAllInfoObj = result;
    }
  },
  actions: {
  }
}
