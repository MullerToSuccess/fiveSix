import API from '@/axios/_api'

let apis = {
  'list': 'client/stm/class/list', // 获取学生列表,
  'getCourseList': 'client/stm/class/getCourseList', // 添加班级时获取课程列表
  'getTeacherList': 'client/stm/class/getTeacherList', // 获取老师列表
  'save': 'client/stm/class/save',
  'info': 'client/stm/class/info',
  'getClassTeacherList': 'client/stm/class/getClassTeacherList',
  'clientConfigList': 'client/stm/clientConfig/list', //   获取年级数据字典
  'update': 'client/stm/class/update'
}

let classApi = new API(apis)

classApi.list = (params) => {
  return classApi.fetch(classApi.apis.list, params, 'get', {"api": 'api56'})
}
classApi.getCourseList = (params) => {
  return classApi.fetch(classApi.apis.getCourseList, params, 'get', {"api": 'api56'})
}
classApi.getTeacherList = (params) => {
  return classApi.fetch(classApi.apis.getTeacherList, params, 'get', {"api": 'api56'})
}
classApi.save = (params) => {
  return classApi.fetch(classApi.apis.save, params, 'post', {"api": 'api56'})
}
classApi.info = (params) => {
  return classApi.fetch(classApi.apis.info, params, 'get', {"api": 'api56'})
}
classApi.getClassTeacherList = (params) => {
  return classApi.fetch(classApi.apis.getClassTeacherList, params, 'get', {"api": 'api56'})
}
classApi.update = (params) => {
  return classApi.fetch(classApi.apis.update, params, 'post', {"api": 'api56'})
}
classApi.clientConfigList = (params) => {
  return classApi.fetch(classApi.apis.clientConfigList, params, 'get', {"api": 'api56'})
}
export default classApi
