export const Tabs = [{
  name: '首页',
  imgSelect: require('@/assets/_images/manager/tabs_select_1.png'),
  imgNormal: require('@/assets/_images/manager/tabs_normal_1.png'),
  path: 'mHome'
}, {
  name: '消息',
  imgSelect: require('@/assets/_images/manager/tabs_select_2.png'),
  imgNormal: require('@/assets/_images/manager/tabs_normal_2.png'),
  path: 'mNews'
}, {
  name: '我的',
  imgSelect: require('@/assets/_images/manager/tabs_select_3.png'),
  imgNormal: require('@/assets/_images/manager/tabs_normal_3.png'),
  path: 'mMy'
}]
export const Switches = [{
  name: '学生管理',
  imgUrl: require('@/assets/_images/manager/manager_home1.png'),
  path: 'student/studentManagement'
}, {
  name: '教师管理',
  imgUrl: require('@/assets/_images/manager/manager_home2.png'),
  path: 'teacher/teacherManagement'
}, {
  name: '班级管理',
  imgUrl: require('@/assets/_images/manager/manager_home3.png'),
  path: 'class/classManagement'
}]
export const appMode = [{
  title: '确定启用',
  text: '启用后账号在有课程的情况下，可使用',
  mode: 1
}, {
  title: '确定停用',
  text: '停用后账号不可登录',
  mode: 0
}]
export const sex = ['男', '女']
export const week = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
