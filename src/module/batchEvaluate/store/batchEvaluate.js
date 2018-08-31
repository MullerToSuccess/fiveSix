export const chooseBatchEvaluateStudentsArray = 'chooseBatchEvaluateStudentsArray';
export const batchEvaluateCommentsTemplateType = 'batchEvaluateCommentsTemplateType';

export default {
  state: {
    chooseBatchEvaluateStudentsArray: [],
    batchEvaluateCommentsTemplateType: 1
  },
  actions: {
    chooseBatchEvaluateStudentsArray: function ({ commit }, result) {
      commit(chooseBatchEvaluateStudentsArray, result);
    },
    batchEvaluateCommentsTemplateType: function ({ commit }, result) {
      commit(batchEvaluateCommentsTemplateType, result);
    }
  },
  mutations: {
    [chooseBatchEvaluateStudentsArray](state, result) {
      state.chooseBatchEvaluateStudentsArray = result;
    },
    [batchEvaluateCommentsTemplateType](state, result) {
      state.batchEvaluateCommentsTemplateType = result;
    }
  }
};
