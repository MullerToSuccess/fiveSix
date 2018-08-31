import util from '@/utils/index'
import api from '@/module/homeworkDetail/axios/detail'
export default {
  namespaced: true,
  state: {
    homeworkInfo: null, // 作业信息
    homeworkQuestionInfo: null, // 作业列表
    routeParams: null, // 路由参数信息
    miniResource: {}, // 存储已经打开的小资源
    hasShowMiniResourceList: [] // 已经打开小资源的父级资源的resource_id 集合
  },
  getters: {
    getStudentInfo: (state, getters) => (payload) => {
      if (!state.homeworkInfo) {
        return null
      }
      let result
      let sortRule = payload.split('_')
      switch (sortRule[0]) {
        case 'correct':
          result = getters.getStudentByCorrect(sortRule[1])
          break;
        case 'name':
          result = getters.getStudentByName(sortRule[1])
          break;
        case 'cuoti':
          result = getters.getStudentByCuoti(sortRule[1])
          break;
        case 'time':
          result = getters.getStudentByTime(sortRule[1])
      }
      return result
    },
    // 根据正确率排序
    getStudentByCorrect: (state) => (payload) => {
      let result
      if (payload === 'down') {
        result = state.homeworkInfo.student_list.filter(item => item.time !== '').sort((a, b) => {
          return b.rate - a.rate
        }).concat(state.homeworkInfo.student_list.filter(item => item.time === ''))
      } else {
        result = state.homeworkInfo.student_list.filter(item => item.time !== '').sort((a, b) => {
          return a.rate - b.rate
        }).concat(state.homeworkInfo.student_list.filter(item => item.time === ''))
      }
      return result
    },
    // 根据姓名排序
    getStudentByName: (state) => (payload) => {
      let result
      if (payload === 'down') {
        result = state.homeworkInfo.student_list.filter(item => item.time !== '').sort((a, b) => {
          return b.real_name.localeCompare(a.real_name, 'zh-Hans-CN', {sensitivity: 'accent'})
        }).concat(state.homeworkInfo.student_list.filter(item => item.time === ''))
      } else {
        result = state.homeworkInfo.student_list.filter(item => item.time !== '').sort((a, b) => {
          return a.real_name.localeCompare(b.real_name, 'zh-Hans-CN', {sensitivity: 'accent'})
        }).concat(state.homeworkInfo.student_list.filter(item => item.time === ''))
      }
      return result
    },
    // 根据错题攻克排序
    getStudentByCuoti: (state) => (payload) => {
      let result
      if (payload === 'down') {
        result = state.homeworkInfo.student_list.filter(item => item.time !== '').sort((a, b) => {
          return b.correct_num.split('/')[0] - a.correct_num.split('/')[0]
        }).concat(state.homeworkInfo.student_list.filter(item => item.time === ''))
      } else {
        result = state.homeworkInfo.student_list.filter(item => item.time !== '').sort((a, b) => {
          return a.correct_num.split('/')[0] - b.correct_num.split('/')[0]
        }).concat(state.homeworkInfo.student_list.filter(item => item.time === ''))
      }
      return result
    },
    // 根据完成时间排序
    getStudentByTime: (state) => (payload) => {
      let result
      if (payload === 'down') {
        result = state.homeworkInfo.student_list.filter(item => item.time !== '').sort((a, b) => {
          return Number(b.time) - Number(a.time)
        }).concat(state.homeworkInfo.student_list.filter(item => item.time === ''))
      } else {
        result = state.homeworkInfo.student_list.filter(item => item.time !== '').sort((a, b) => {
          return Number(a.time) - Number(b.time)
        }).concat(state.homeworkInfo.student_list.filter(item => item.time === ''))
      }
      return result
    },
    // 正确率分布图数据
    getCorrectInfo: (state) => {
      if (!state.homeworkInfo) {
        return false
      }
      let stuList = state.homeworkInfo.student_list.filter(item => item.status === 3 || item.status === 4)
      let result = {
        '优秀': {
          num: 0,
          studentList: []
        },
        '良好': {
          num: 0,
          studentList: []
        },
        '及格': {
          num: 0,
          studentList: []
        },
        '待提升': {
          num: 0,
          studentList: []
        }
      }
      stuList.filter(item => {
        if (item.rate * 100 >= 85) {
          result['优秀']['num']++
          result['优秀']['studentList'].push(item)
        } else if ((item.rate * 100 >= 70) && (item.rate * 100 < 85)) {
          result['良好']['num']++
          result['良好']['studentList'].push(item)
        } else if ((item.rate * 100 >= 60) && (item.rate * 100 < 70)) {
          result['及格']['num']++
          result['及格']['studentList'].push(item)
        } else {
          result['待提升']['num']++
          result['待提升']['studentList'].push(item)
        }
      })
      return result
    },
    // 获取作业的题信息
    getHomeworkQuestionInfo: state => {
      return state.homeworkQuestionInfo && state.homeworkQuestionInfo.list
    },
    getMiniResourceList: state => {
      return state.miniResource
    }
  },
  mutations: {
    // 单个作业信息
    homeworkInfo(state, payload) {
      state.homeworkInfo = payload
    },
    // 作业的题信息
    homeworkQuestionInfo(state, payload) {
      state.homeworkQuestionInfo = payload
    },
    // 路由参数信息储存
    saveRouteParams(state, payload) {
      state.routeParams = payload
    },
    // 存储小资源
    saveMiniResource(state, payload) {
      state.miniResource[payload.resource_id] = payload.list
    },
    // 储存已经打开小资源的父级资源的resource_id 集合
    saveHasShowMiniResourceList(state, payload) {
      if (state.hasShowMiniResourceList.some(ele => ele === payload.resource_id)) {
        state.hasShowMiniResourceList.splice(state.hasShowMiniResourceList.findIndex(ele => ele === payload.resource_id), 1)
      } else {
        state.hasShowMiniResourceList.push(payload.resource_id)
      }
    },
    // 删除小资源
    clearMiniResource(state) {
      state.miniResource = {}
    },
    // 删除打开小资源的父级资源id集合
    clearHasShowMiniResourceList(state) {
      state.hasShowMiniResourceList = []
    }
  },
  actions: {
    getMiniResource({commit}, payload) {
      api.getMiniResource(payload.params).then(succ => {
        commit('saveMiniResource', {
          resource_id: payload.resourceId,
          list: succ
        })
        payload.callback && payload.callback(succ)
        // commit('saveHasShowMiniResourceList', {
        //   resource_id: payload.resourceId
        // })
      })
    }
  }
}
