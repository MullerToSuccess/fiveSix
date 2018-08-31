import Vue from 'vue'
import Vuex from 'vuex'

import runEnvStore from './runEnv.js'
import alivePages from './alivePage.js'
import accountStore from '@/module/account/store/account.js'
import userCenterStore from '@/module/user-center/store/userCenter.js'
import homeStore from '@/module/home/store/home.js'
import homeworkStore from '@/module/homework/store/homework.js'
import batchEvaluateStore from '@/module/batchEvaluate/store/batchEvaluate.js'
import homeworkDetailStore from '@/module/homeworkDetail/store/detail.js'
import answerDetailStore from '@/module/answerDetail/store/index'
import noticeStore from '@/module/notice/store/notice.js'
// import wrongQtiNote from '@/module/wrongQtiNote/store/index'
import managerCommon from 'managerCommon/store/index'
import managerStudent from 'managerHome/student/store/student'
import teacherStudent from '@/module/teacher/home/student/store/student'
import managerTeacher from 'managerHome/teacher/store/teacher'
import managerClass from 'managerHome/class/store/class'
import news from '@/module/news/store/news'
import my from '@/module/my/store/my'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    runEnv: runEnvStore, // 环境变量
    alivePages: alivePages, // 页面缓存管理
    account: accountStore, // 用户账户模块
    userCenter: userCenterStore, // 用户中心模块
    home: homeStore,
    homework: homeworkStore,
    batchEvaluate: batchEvaluateStore,
    homeworkDetail: homeworkDetailStore, // 作业详情
    answerDetail: answerDetailStore, // 批改、查看统计
    notice: noticeStore, // 消息中心
    // wrongQtiNote: wrongQtiNote, // 错题本,
    managerCommon: managerCommon,
    managerStudent: managerStudent, // 分店学生模块
    teacherStudent: teacherStudent,
    managerTeacher: managerTeacher, // 分店教师模块
    managerClass: managerClass,
    news: news,
    my: my
  }
})
