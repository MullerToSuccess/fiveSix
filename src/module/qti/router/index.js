// import originalQuestion from '@/module/qti/originalQuestion.vue'
const originalQuestion = () => import(/* webpackChunkName: "qti" */'@/module/qti/originalQuestion.vue');

export default
[
  {
    name: 'originalQuestion',
    path: '/originalQuestion',
    meta: { requiresAuth: false, keepAlive: false },
    component: originalQuestion
  }
]
