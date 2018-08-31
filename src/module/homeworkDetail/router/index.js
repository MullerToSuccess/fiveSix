// import homeworkDetail from '@/module/homeworkDetail/components/index.vue'
// import knowledgePointDetail from '@/module/homeworkDetail/components/knowledgePointDetail.vue'
// import homeworkContent from '@/module/homeworkDetail/components/homeworkContent.vue'
// import personalized from '@/module/homeworkDetail/components/personalized'

const homeworkDetail = () => import(/* webpackChunkName: "homeworkDetail" */ '@/module/homeworkDetail/components/index.vue')
const knowledgePointDetail = () => import(/* webpackChunkName: "homeworkDetail" */ '@/module/homeworkDetail/components/knowledgePointDetail.vue')
const homeworkContent = () => import(/* webpackChunkName: "homeworkDetail" */ '@/module/homeworkDetail/components/homeworkContent.vue')
const personalized = () => import(/* webpackChunkName: "homeworkDetail" */ '@/module/homeworkDetail/components/personalized')
export default [
  {
    path: '/homeworkDetail/:publishId/:classId',
    name: 'homeworkDetail',
    component: homeworkDetail,
    meta: { requiresAuth: false, keepAlive: true }
  },
  {
    path: '/personalized/:publishId/:classId',
    name: 'personalized',
    component: personalized,
    meta: { requiresAuth: false, keepAlive: true }
  },
  {
    path: '/knowledgePointDetail/:publishId/:kp_id/:qti_count/:correct_rate/:kp_name',
    name: 'knowledgePointDetail',
    component: knowledgePointDetail,
    meta: { requiresAuth: false, keepAlive: false }
  },
  {
    path: '/homeworkContent',
    name: 'homeworkContent',
    component: homeworkContent,
    meta: { requiresAuth: false, keepAlive: false }
  }
]
