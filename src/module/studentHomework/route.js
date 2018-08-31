// import studentHomework from './components/index'
const studentHomework = () => import(/* webpackChunkName: "studentHomework" */'./components/index');

export default [{
  // h:1作业 0课中
  path: '/studentHomework/:user_id/:publish_id/:user_name',
  name: 'studentHomework',
  component: studentHomework,
  props: true,
  meta: { requiresAuth: false, keepAlive: true }
}]
