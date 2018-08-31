export const chooseSummerHomeworkArray = 'chooseSummerHomeworkArray';
export const chooseExamExerciseQtiIdsArray = 'chooseExamExerciseQtiIdsArray';
export const chooseTextBookObj = 'chooseTextBookObj';
export const summerHomeworkPackId = 'summerHomeworkPackId';
export const oneExamExercise = 'oneExamExercise';
export const summerHomeworkResouceId = 'summerHomeworkResouceId';
export const homeworkOneListInfoObj = 'homeworkOneListInfoObj';
export const hasChoosePagesArray = 'hasChoosePagesArray';
export const isOldPackId = "0";
export const chooseBackPage = "";
export const publishHWBackPage = "";
export const homeworkState = "0";

export default {
  state: {
    chooseSummerHomeworkArray: [],
    chooseExamExerciseQtiIdsArray: [],
    hasChoosePagesArray: [],
    chooseTextBookObj: {},
    summerHomeworkPackId: '',
    oneExamExercise: {},
    summerHomeworkResouceId: '',
    homeworkOneListInfoObj: {},
    chooseBackPage: "",
    isOldPackId: "0",
    homeworkState: "0",
    publishHWBackPage: ""
  },
  actions: {
    chooseSummerHomeworkArray: function ({ commit }, result) {
      commit(chooseSummerHomeworkArray, result);
    },
    chooseExamExerciseQtiIdsArray: function ({ commit }, result) {
      commit(chooseExamExerciseQtiIdsArray, result);
    },
    chooseTextBookObj: function ({ commit }, result) {
      commit(chooseTextBookObj, result);
    },
    summerHomeworkPackId: function ({ commit }, result) {
      commit(summerHomeworkPackId, result);
    },
    oneExamExercise: function ({ commit }, result) {
      commit(oneExamExercise, result);
    },
    summerHomeworkResouceId: function ({ commit }, result) {
      commit(summerHomeworkResouceId, result);
    },
    homeworkOneListInfoObj: function ({ commit }, result) {
      commit(homeworkOneListInfoObj, result);
    },
    hasChoosePagesArray: function ({ commit }, result) {
      commit(hasChoosePagesArray, result);
    },
    isOldPackId: function ({ commit }, result) {
      commit(isOldPackId, result);
    },
    publishHWBackPage: function ({ commit }, result) {
      commit(publishHWBackPage, result);
    }
  },
  mutations: {
    [chooseSummerHomeworkArray](state, result) {
      state.chooseSummerHomeworkArray = result;
    },
    [chooseExamExerciseQtiIdsArray](state, result) {
      state.chooseExamExerciseQtiIdsArray = result;
    },
    [chooseTextBookObj](state, result) {
      state.chooseTextBookObj = result;
    },
    [summerHomeworkResouceId](state, result) {
      state.summerHomeworkResouceId = result;
    },
    [oneExamExercise](state, result) {
      state.oneExamExercise = result;
    },
    [summerHomeworkPackId](state, result) {
      if (state.summerHomeworkPackId !== result) {
        state.hasChoosePagesArray = [];
        state.isOldPackId = "0";
      }
      state.summerHomeworkPackId = result;
    },
    [homeworkOneListInfoObj](state, result) {
      state.homeworkOneListInfoObj = result;
    },
    [publishHWBackPage](state, result) {
      state.publishHWBackPage = result;
    },
    [hasChoosePagesArray](state, result) {
      state.hasChoosePagesArray = result;
    },
    [isOldPackId](state, result) {
      state.isOldPackId = result;
    }
  }
};
