import * as types from './mutation-types'
import student from '../api/student'
import commonAPI from 'common/api/api'
export default {
  namespaced: true,
  state: {
    userId: '', //  学生
    details: {},
    baseInfo: {},
    classInfo: {},
    courseInfo: {},
    familyInfo: {},
    studyInfo: {},
    classLists: [], // 提交补课班级时的数组 cEditClass
    grade: '', //  行政的年级 sEditGrade
    className: '', //  行政的班级 为用户自行输入 sEditGrade
    score: {}, //  语数外成绩 sEditScore
    saveGuardian: { //  监护人 sEditGuardian
      guardian: '',
      mobile: '',
      id: ''
    },
    gradeName: '',
    gradeConfig: [],
    guardianConfig: [],
    isCache: false
  },
  getters: {
    userId: state => state.userId,
    details: state => state.details,
    baseInfo: state => state.baseInfo,
    classInfo: state => state.classInfo,
    courseInfo: state => state.courseInfo,
    familyInfo: state => state.familyInfo,
    studyInfo: state => state.studyInfo,
    classLists: state => state.classLists,
    grade: state => state.grade,
    className: state => state.className,
    score: state => state.score,
    saveGuardian: state => state.saveGuardian,
    isSave: state => state.isSave,
    gradeName: state => state.gradeName,
    gradeConfig: state => state.gradeConfig,
    guardianConfig: state => state.guardianConfig,
    isCache: state => state.isCache
  },
  mutations: {
    [types.SET_USERID] (state, userId) {
      state.userId = userId
    },
    [types.SET_DETAILS] (state, baseInfo) {
      state.baseInfo = baseInfo
    },
    [types.SET_BASEINFO] (state, baseInfo) {
      state.baseInfo = baseInfo
    },
    [types.SET_CLASSINFO] (state, classInfo) {
      state.classInfo = classInfo
    },
    [types.SET_COURSEINFO] (state, courseInfo) {
      state.courseInfo = courseInfo
    },
    [types.SET_FAMILYTNFO] (state, familyInfo) {
      state.familyInfo = familyInfo
    },
    [types.SET_STUDYINFO] (state, studyInfo) {
      state.studyInfo = studyInfo
    },
    [types.SET_CLASSLISTS] (state, classLists) {
      state.classLists = classLists
    },
    [types.SET_GRADE] (state, grade) {
      state.grade = grade
    },
    [types.SET_CLASSNAME] (state, className) {
      state.className = className
    },
    [types.SET_SCORE] (state, score) {
      state.score[score.subject] = score.data
    },
    [types.SET_GUARDIAN] (state, guardian) {
      state.saveGuardian.guardian = guardian
    },
    [types.SET_GUARDIANPHONE] (state, mobile) {
      state.saveGuardian.mobile = mobile
    },
    [types.SET_GUARDIANID] (state, id) {
      state.saveGuardian.id = id
    },
    [types.SET_GRADENAME] (state, gradeName) {
      state.gradeName = gradeName
    },
    [types.SET_GRADECONFIG] (state, gradeConfig) {
      state.gradeConfig = gradeConfig
    },
    [types.SET_GUARDIANCONFIG] (state, guardianConfig) {
      state.guardianConfig = guardianConfig
    },
    [types.SET_ISCACHE] (state, isCache) {
      state.isCache = isCache
    }
  },
  actions: {
    getStudentDetails ({ state, commit }) {
      return student.info({
        userId: state.userId,
        schoolId: window.bus.$store.getters['managerCommon/schoolId']
      }).then(r => {
        if (state.gradeConfig.length === 0) {
          commonAPI.clientConfigList({
            category: 'grade_of_class'
          }).then(item => {
            commit('SET_GRADECONFIG', item.page)
            item.page.forEach((v, i) => {
              if (r.extendInfo.studyInfo.grade === v.codeValue) {
                commit('SET_GRADENAME', v.codeName)
              }
            })
          })
        } else {
          state.gradeConfig.forEach((v, i) => {
            if (r.extendInfo.studyInfo.grade === v.codeValue) {
              commit('SET_GRADENAME', v.codeName)
            }
          })
        }
        if (state.guardianConfig.length === 0) {
          commonAPI.clientConfigList({
            category: 'parent_relationship_of_child'
          }).then(item => {
            commit('SET_GUARDIANCONFIG', item.page)
          })
        }
        commit('SET_DETAILS', r)
        commit('SET_BASEINFO', r.baseInfo)
        commit('SET_CLASSINFO', r.extendInfo.classInfo)
        commit('SET_COURSEINFO', r.extendInfo.courseInfo)
        commit('SET_FAMILYTNFO', r.extendInfo.familyInfo)
        commit('SET_STUDYINFO', r.extendInfo.studyInfo)
        const arr = ['chineseScore', 'englishScore', 'mathScore']
        arr.forEach((v, i) => {
          commit('SET_SCORE', {
            subject: v,
            data: r.extendInfo.studyInfo[v]
          })
        })
        return r
      })
    }
  }
}
