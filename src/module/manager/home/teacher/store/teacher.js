import * as types from './mutation-types'
import teacher from '../api/teacher'
import commonAPI from 'common/api/api'
export default {
  namespaced: true,
  state: {
    userId: '', //  老师
    teacherDetails: {}, //  老师详情
    baseInfo: {},
    classInfo: {},
    teacherInfo: {},
    classLists: [], // 提交补课班级时的数组 cEditClass
    title: '', // 所授学科的前缀年级
    addTeacher: {},
    teacherClassName: [],
    profile: '',
    isAdd: {
      name: false,
      password: false,
      mobile: false
    },
    degreeArr: [],
    householdAddressArr: [],
    householdAddressName: '',
    degreeName: '',
    isCache: false
  },
  getters: {
    userId: state => state.userId,
    teacherDetails: state => state.teacherDetails,
    baseInfo: state => state.baseInfo,
    classInfo: state => state.classInfo,
    teacherInfo: state => state.teacherInfo,
    classLists: state => state.classLists,
    title: state => state.title,
    addTeacher: state => state.addTeacher,
    teacherClassName: state => state.teacherClassName,
    isAdd: state => state.isAdd,
    profile: state => state.profile,
    householdAddressArr: state => state.householdAddressArr,
    householdAddressName: state => state.householdAddressName,
    degreeArr: state => state.degreeArr,
    degreeName: state => state.degreeName,
    isCache: state => state.isCache
  },
  mutations: {
    [types.SET_USERID] (state, userId) {
      state.userId = userId
    },
    [types.SET_TEACHERDETAILS] (state, teacherDetails) {
      state.teacherDetails = teacherDetails
    },
    [types.SET_BASEINFO] (state, baseInfo) {
      state.baseInfo = baseInfo
    },
    [types.SET_CLASSINFO] (state, classInfo) {
      state.classInfo = classInfo
    },
    [types.SET_TEACHERNIFO] (state, teacherInfo) {
      state.teacherInfo = teacherInfo
    },
    [types.SET_CLASSLISTS] (state, classLists) {
      state.classLists = classLists
    },
    [types.SET_TITLE] (state, title) {
      state.title = title
    },
    [types.SET_ADDTEACHER] (state, json) {
      state.addTeacher = Object.assign(state.addTeacher, json)
    },
    [types.SET_TEACHERCLASSNAME] (state, teacherClassName) {
      state.teacherClassName = teacherClassName
    },
    [types.CLEAR_ADDTEACHER] (state, json) {
      state.addTeacher = {}
    },
    [types.SET_ISADD] (state, json) {
      state.isAdd = Object.assign(state.isAdd, json)
    },
    [types.SET_PROFILE] (state, profile) {
      state.profile = profile
    },
    [types.SET_HOUSEHOLDADDRESSARR] (state, householdAddressArr) {
      state.householdAddressArr = householdAddressArr
    },
    [types.SET_HOUSEHOLDADDRESSNAME] (state, householdAddressName) {
      state.householdAddressName = householdAddressName
    },
    [types.SET_DEGREEARR] (state, degreeArr) {
      state.degreeArr = degreeArr
    },
    [types.SET_DEGREENAME] (state, degreeName) {
      state.degreeName = degreeName
    },
    [types.SET_ISCACHE] (state, isCache) {
      state.isCache = isCache
    }
  },
  actions: {
    getTeacherDetails ({ state, commit }) {
      return teacher.info({
        userId: state.userId,
        schoolId: window.bus.$store.getters['managerCommon/schoolId']
      }).then(r => {
        commit('SET_TEACHERDETAILS', r)
        commit('SET_BASEINFO', r.baseInfo)
        commit('SET_CLASSINFO', r.extendInfo.classInfo)
        commit('SET_TEACHERNIFO', r.extendInfo.teacherInfo)
        if (state.householdAddressArr.length === 0) {
          commonAPI.provinceList().then(item => {
            commit('SET_HOUSEHOLDADDRESSARR', item.provinceList)
            state.householdAddressArr.forEach((v, i) => {
              if (state.teacherInfo.householdAddress === v.id) commit('SET_HOUSEHOLDADDRESSNAME', v.name)
            })
          })
        } else {
          state.householdAddressArr.forEach((v, i) => {
            if (state.teacherInfo.householdAddress === v.id) commit('SET_HOUSEHOLDADDRESSNAME', v.name)
          })
        }
        if (state.degreeArr.length === 0) {
          commonAPI.clientConfigList({
            category: 'degree'
          }).then(item => {
            commit('SET_DEGREEARR', item.page)
            state.degreeArr.forEach((v, i) => {
              if (state.teacherInfo.degree === v.codeValue) commit('SET_DEGREENAME', v.codeName)
            })
          })
        } else {
          state.degreeArr.forEach((v, i) => {
            if (state.teacherInfo.degree === v.codeValue) commit('SET_DEGREENAME', v.codeName)
          })
        }
      })
    }
  }
}
