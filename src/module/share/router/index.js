// 参数：班级ID：classId(string or number)、学生答案：answer(array)、学生信息：studentInfo(object)
// import share from '../index.vue'
const share = () => import(/* webpackChunkName: "share" */'../index.vue');

export default
[
  {
    name: 'share',
    path: '/share',
    meta: { requiresAuth: false, keepAlive: false },
    component: share
  }
]
