export default {
  namespaced: true,
  state: {
  },
  getters: {
    getClass: (state, getters, rootState) => {
      let classes = rootState.account.userInfo ? rootState.account.userInfo.classes : []
      classes.sort((a, b) => {
        if (a.edu_grade_id !== b.edu_grade_id) {
          return a.edu_grade_id - b.edu_grade_id
        } else {
          return a.class_id - b.class_id
        }
      })
      return classes
    }
  },
  mutations: {
  },
  actions: {}
}
