const ClassManagement = (resolve) => {
  import('managerHome/class/components/classManagement').then((module) => {
    resolve(module)
  })
}
const AddClass = (resolve) => {
  import('managerHome/class/components/addClass').then((module) => {
    resolve(module)
  })
}
const ClassDetails = (resolve) => {
  import('managerHome/class/components/classDetails').then((module) => {
    resolve(module)
  })
}
const SelectTeacher = (resolve) => {
  import('managerHome/class/components/selectTeacher').then((module) => {
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
    path: '/manager/class/classManagement',
    name: 'classManagement',
    component: ClassManagement,
    meta: {requiresAuth: true, keepAlive: true, isUseCache: false}
  }, {
    path: '/manager/class/classDetails',
    name: 'classDetails',
    component: ClassDetails,
    meta: {requiresAuth: true, keepAlive: false},
    children: [
      {
        name: 'cSelectTeacher',
        path: 'selectTeacher',
        component: SelectTeacher,
        meta: {requiresAuth: true, keepAlive: true}
      },
      {
        name: 'cEditMsg',
        path: 'editMsg',
        component: EditMsg,
        meta: {requiresAuth: true}
      }
    ]
  }, {
    path: '/manager/class/addClass',
    name: 'addClass',
    component: AddClass,
    meta: {requiresAuth: true, keepAlive: false},
    children: [
      {
        name: 'aSelectTeacher',
        path: 'selectTeacher',
        component: SelectTeacher,
        meta: {requiresAuth: true}
      }
    ]
  }]
