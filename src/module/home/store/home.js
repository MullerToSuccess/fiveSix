export const YXB_HOMEWORK = 'YXB_HOMEWORK';

export default {
  state: {
    YXB_HOMEWORK: {}
  },
  actions: {
    YXB_HOMEWORK: function ({ commit }, result) {
      commit(YXB_HOMEWORK, result);
    }
  },
  mutations: {
    [YXB_HOMEWORK](state, result) {
      state.YXB_HOMEWORK = result;
    }
  }
};
