import API from '@/axios/_api'

let apis = {
  'list': 'client/stm/student/list', // 获取学生列表,
  'info': 'client/stm/student/info',
  'updateInfo': 'client/stm/student/updateInfo',
  'getStudentCourseClassList': 'client/stm/student/getStudentCourseClassList',
  'saveStudentClassInfo': 'client/stm/student/saveStudentClassInfo',
  'saveStudentParentInfo': 'client/stm/student/saveStudentParentInfo',
  'getNoClassStudentList': 'client/stm/student/getNoClassStudentList', //  待管理学生列表
  'getNoClassStudentCourseClass': 'client/stm/student/getNoClassStudentCourseClass', // 获取分班时的班级列表
  'saveStudentClassGroup': 'client/stm/student/saveStudentClassGroup', //  分班保存
  'clientConfigList': 'client/stm/clientConfig/list', //   获取年级数据字典,
  'getStudentCourseList': 'client/stm/student/getStudentCourseList',
  'upload': 'upload/clientUserAvatar'
}

let student = new API(apis)

student.list = (params) => {
  return student.fetch(student.apis.list, params, 'get', {"api": 'api56'})
}
student.info = (params) => {
  return student.fetch(student.apis.info, params, 'get', {"api": 'api56'})
}
student.updateInfo = (params) => {
  return student.fetch(student.apis.updateInfo, params, 'post', {"api": 'api56'})
}
student.getStudentCourseClassList = (params) => {
  return student.fetch(student.apis.getStudentCourseClassList, params, 'get', {"api": 'api56'})
}
student.saveStudentClassInfo = (params) => {
  return student.fetch(student.apis.saveStudentClassInfo, params, 'post', {"api": 'api56'})
}
student.saveStudentParentInfo = (params) => {
  return student.fetch(student.apis.saveStudentParentInfo, params, 'post', {"api": 'api56'})
}
student.getNoClassStudentList = (params) => {
  return student.fetch(student.apis.getNoClassStudentList, params, 'get', {"api": 'api56'})
}
student.getNoClassStudentCourseClass = (params) => {
  return student.fetch(student.apis.getNoClassStudentCourseClass, params, 'get', {"api": 'api56'})
}
student.saveStudentClassGroup = (params) => {
  return student.fetch(student.apis.saveStudentClassGroup, params, 'post', {"api": 'api56'})
}
student.clientConfigList = (params) => {
  return student.fetch(student.apis.clientConfigList, params, 'get', {"api": 'api56'})
}
student.getStudentCourseList = (params) => {
  return student.fetch(student.apis.getStudentCourseList, params, 'get', {"api": 'api56'})
}
export default student
