// import tongji from '@/module/tongji/components/index'
const tongji = () => import(/* webpackChunkName: "tongji" */'@/module/tongji/components/index');

export default [{
  // h:1作业 0课中
  path: '/tongji/:question_type/:icom_app_name/:course_hour_publish_id/:course_resource_id/:resource_id/:dcom_entity_id/:average_rate/:average_time_length/:icom_id',
  name: 'tongji',
  component: tongji,
  meta: { requiresAuth: false, keepAlive: true }
}]
