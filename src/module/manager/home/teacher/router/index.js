const TeacherManagement = (resolve) => {
  import('managerHome/teacher/components/teacherManagement').then((module) => {
    resolve(module)
  })
}
const TeacherDetails = (resolve) => {
  import('managerHome/teacher/components/teacherDetails').then((module) => {
    resolve(module)
  })
}
const EditMsg = (resolve) => {
  import('common/components/editMsg').then((module) => {
    resolve(module)
  })
}
const Search = (resolve) => {
  import('managerCommon/components/search').then((module) => {
    resolve(module)
  })
}
export default [
  {
    path: '/manager/teacher/teacherManagement',
    name: 'teacherManagement',
    component: TeacherManagement,
    meta: {requiresAuth: true, keepAlive: true, isUseCache: false}
  }, {
    path: '/manager/teacher/teacherDetails',
    name: 'teacherDetails',
    component: TeacherDetails,
    meta: {requiresAuth: true},
    children: [
      {
        name: 'tEditMsg',
        path: 'editMsg',
        component: EditMsg,
        meta: {requiresAuth: true}
      }
    ]
  }, {
    path: '/manager/teacher/search',
    name: 'tSearch',
    component: Search,
    meta: {requiresAuth: true, keepAlive: false}
  }]
