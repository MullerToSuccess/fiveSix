// // 作业首页页面
// import homework from './homework.vue'
// // 教材选择页面
// import chooseTextbook from './publishHomework/chooseTextbook'
// // 试题页面
// import examExercise from './publishHomework/examExercise.vue'
// // 作业布置选择发布条件页面
// import homeworkPublishSetting from './publishHomework/homeworkPublishSetting.vue'
// // 推荐和校本库页面
// import publishHomework from './publishHomework/publishHomework.vue'
// // 暑假作业内容页面
// import summerHomework from './publishHomework/summerHomework.vue'

const homework = () => import(/* webpackChunkName: "publishHomework" */ './homework.vue')
const chooseTextbook = () => import(/* webpackChunkName: "publishHomework" */ './publishHomework/chooseTextbook.vue')
const examExercise = () => import(/* webpackChunkName: "publishHomework" */ './publishHomework/examExercise.vue')
const oneExamExercise = () => import(/* webpackChunkName: "publishHomework" */ './publishHomework/oneExamExercise.vue')
const homeworkPublishSetting = () => import(/* webpackChunkName: "publishHomework" */ './publishHomework/homeworkPublishSetting.vue')
const publishHomework = () => import(/* webpackChunkName: "publishHomework" */ './publishHomework/publishHomework.vue')
const summerHomework = () => import(/* webpackChunkName: "publishHomework" */ './publishHomework/summerHomework.vue')

let homeworkRoutes = [{
  path: '/homework',
  name: 'homework',
  meta: { requiresAuth: false, keepAlive: false },
  component: homework
}, {
  path: '/chooseTextbook',
  name: 'chooseTextbook',
  meta: { requiresAuth: false, keepAlive: true },
  component: chooseTextbook
}, {
  path: '/examExercise',
  name: 'examExercise',
  meta: { requiresAuth: false, keepAlive: false },
  component: examExercise
}, {
  path: '/homeworkPublishSetting',
  name: 'homeworkPublishSetting',
  meta: { requiresAuth: false, keepAlive: false },
  component: homeworkPublishSetting
}, {
  path: '/publishHomework',
  name: 'publishHomework',
  meta: { requiresAuth: false, keepAlive: true },
  component: publishHomework
}, {
  path: '/summerHomework',
  name: 'summerHomework',
  meta: { requiresAuth: false, keepAlive: true },
  component: summerHomework
}, {
  path: '/oneExamExercise',
  name: 'oneExamExercise',
  meta: { requiresAuth: false, keepAlive: true },
  component: oneExamExercise
}];

export default homeworkRoutes;
