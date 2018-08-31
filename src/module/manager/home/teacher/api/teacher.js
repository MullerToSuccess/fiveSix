import API from '@/axios/_api'

let apis = {
  'list': 'client/stm/teacher/list',
  'info': 'client/stm/teacher/info',
  'saveInfo': 'client/stm/teacher/saveInfo',
  'updateInfo': 'client/stm/teacher/updateInfo',
  'getTeacherClassList': 'client/stm/teacher/getTeacherClassList',
  'saveTeacherClassInfo': 'client/stm/teacher/saveTeacherClassInfo',
  'getSchoolCourseClassList': 'client/stm/teacher/getSchoolCourseClassList',
  'clientConfigList': 'client/stm/clientConfig/list' //   获取年级数据字典
}

let teacher = new API(apis)

teacher.list = (params) => {
  return teacher.fetch(teacher.apis.list, params, 'get', {"api": 'api56'})
}
teacher.info = (params) => {
  return teacher.fetch(teacher.apis.info, params, 'post', {"api": 'api56'})
}
teacher.saveInfo = (params) => {
  return teacher.fetch(teacher.apis.saveInfo, params, 'post', {"api": 'api56'})
}
teacher.updateInfo = (params) => {
  return teacher.fetch(teacher.apis.updateInfo, params, 'post', {"api": 'api56'})
}
teacher.getTeacherClassList = (params) => {
  return teacher.fetch(teacher.apis.getTeacherClassList, params, 'get', {"api": 'api56'})
}
teacher.getSchoolCourseClassList = (params) => {
  return teacher.fetch(teacher.apis.getSchoolCourseClassList, params, 'get', {"api": 'api56'})
}
teacher.saveTeacherClassInfo = (params) => {
  return teacher.fetch(teacher.apis.saveTeacherClassInfo, params, 'post', {"api": 'api56'})
}
teacher.clientConfigList = (params) => {
  return teacher.fetch(teacher.apis.clientConfigList, params, 'get', {"api": 'api56'})
}
export default teacher
