// 参数：班级ID：classId(string or number)、学生答案：answer(array)、学生信息：studentInfo(object)
// import correctIdea from '../index.vue'
const correctIdea = () => import(/* webpackChunkName: "correctIdea" */'../index.vue');

export default
[
  {
    name: 'correctIdea',
    path: '/correctIdea',
    meta: { requiresAuth: false, keepAlive: false },
    component: correctIdea
  }
]
