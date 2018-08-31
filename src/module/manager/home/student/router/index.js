const StudentManagement = (resolve) => {
  import('managerHome/student/components/studentManagement').then((module) => {
    resolve(module)
  })
}
const StudentDetails = (resolve) => {
  import('managerHome/student/components/studentDetails').then((module) => {
    resolve(module)
  })
}
const WaitingManagement = (resolve) => {
  import('managerHome/student/components/waitingManagement').then((module) => {
    resolve(module)
  })
}
const DivideClass = (resolve) => {
  import('managerHome/student/components/divideClass').then((module) => {
    resolve(module)
  })
}
const Search = (resolve) => {
  import('managerCommon/components/search').then((module) => {
    resolve(module)
  })
}
const EditMsg = (resolve) => {
  import('common/components/editMsg').then((module) => {
    resolve(module)
  })
}

export default [
  {
    path: '/manager/student/studentManagement',
    name: 'studentManagement',
    component: StudentManagement,
    meta: {requiresAuth: true, keepAlive: true, isUseCache: false}
  }, {
    path: '/manager/student/studentDetails',
    name: 'studentDetails',
    component: StudentDetails,
    meta: {requiresAuth: true, keepAlive: false},
    children: [
      {
        name: 'sEditMsg',
        path: 'editMsg',
        component: EditMsg,
        meta: {requiresAuth: true}
      }
    ]
  }, {
    path: '/manager/student/waitingManagement',
    name: 'waitingManagement',
    component: WaitingManagement,
    meta: {requiresAuth: true, keepAlive: true, isUseCache: false, isBackCache: false}
  }, {
    path: '/manager/student/divideClass',
    name: 'divideClass',
    component: DivideClass,
    meta: {requiresAuth: true, keepAlive: false}
  }, {
    path: '/manager/student/search',
    name: 'sSearch',
    component: Search,
    meta: {requiresAuth: true, keepAlive: false}
  }]
