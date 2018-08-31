
// import CheckDetail from '../check/CheckDetail.vue'
const CheckDetail = () => import(/* webpackChunkName: "answerDetail" */'@/module/answerDetail/check/CheckDetail.vue');
// const answerDetail = () => import(/* webpackChunkName: "answerDetail" */'@/module/answerDetail/components/index.vue');
const Tongji = () => import(/* webpackChunkName: "answerDetail" */'@/module/answerDetail/components/tongji.vue');
const Pigai = () => import(/* webpackChunkName: "answerDetail" */'@/module/answerDetail/components/pigai.vue');
// 批改本题页面
const checkAnswerDetail = () => import(/* webpackChunkName: "answerDetail" */'@/module/answerDetail/checkAnswerDetail/checkAnswerDetail.vue');
const quondamTitle = () => import(/* webpackChunkName: "answerDetail" */'@/module/answerDetail/checkAnswerDetail/quondamTitle.vue');
const icomDetail = () => import(/* webpackChunkName: "icomDetail" */'@/module/answerDetail/components/question/icomDetail.vue');
export default [
  // {
  //   name: 'answerDetail',
  //   path: '/answerDetail',
  //   meta: { requiresAuth: false, keepAlive: true },
  //   component: answerDetail
  // },
  {
    name: 'pigai',
    path: '/pigai',
    meta: { requiresAuth: false, keepAlive: true },
    component: Pigai
  },
  {
    path: '/checkAnswerDetail',
    meta: { requiresAuth: false, keepAlive: false },
    name: "checkAnswerDetail",
    component: checkAnswerDetail
  },
  {
    path: '/quondamTitle',
    meta: { requiresAuth: false, keepAlive: false },
    name: "quondamTitle",
    component: quondamTitle
  },
  {
    path: '/tongji',
    name: 'tongji',
    component: Tongji,
    meta: { requiresAuth: false, keepAlive: true }
  },
  {
    path: '/checkAnswerDetail/check',
    meta: { requiresAuth: false, keepAlive: false },
    name: "CheckDetail",
    component: CheckDetail
  },
  {
    path: '/icomDetail/:index/:icom_id',
    meta: {requiresAuth: false, keepAlive: false},
    name: 'icomDetail',
    component: icomDetail
  }
]
