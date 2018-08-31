const Teacher = (resolve) => {
  import('teacher/teacher').then((module) => {
    resolve(module)
  })
}
const Home = (resolve) => {
  import('teacherHome/tHome').then((module) => {
    resolve(module)
  })
}
const News = (resolve) => {
  import('@/module/news/components/news').then((module) => {
    resolve(module)
  })
}
const Details = (resolve) => {
  import('@/module/news/components/details').then((module) => {
    resolve(module)
  })
}
const SystemNewsStudent = (resolve) => {
  import('@/module/news/components/news-system-student').then((module) => {
    resolve(module)
  })
}
const My = (resolve) => {
  import('@/module/my/components/my').then((module) => {
    resolve(module)
  })
}
const Set = (resolve) => {
  import('@/module/my/components/set').then((module) => {
    resolve(module)
  })
}
const About = (resolve) => {
  import('@/module/my/components/about').then((module) => {
    resolve(module)
  })
}
const EditPhone = (resolve) => {
  import('@/module/my/components/editPhone').then((module) => {
    resolve(module)
  })
}
const RevisePwd = (resolve) => {
  import('@/module/my/components/revisePwd').then((module) => {
    resolve(module)
  })
}
const classDetails = (resolve) => {
  import('managerHome/class/components/classDetails').then((module) => {
    resolve(module)
  })
}
const PhoneBinding = (resolve) => {
  import('account/components/phoneBinding').then((module) => {
    resolve(module)
  })
}
export default [
  {
    path: '/teacher',
    name: 'teacher',
    component: Teacher,
    meta: {requiresAuth: true, keepAlive: true},
    children: [
      {
        name: 'tHome',
        path: 'home',
        component: Home,
        meta: {requiresAuth: true, keepAlive: true}
      }, {
        name: 'tNews',
        path: 'news',
        component: News,
        meta: {requiresAuth: true, keepAlive: true},
        children: [
          {
            name: 'tDetails',
            path: 'details',
            component: Details,
            meta: {requiresAuth: true, keepAlive: true},
            children: [
              {
                path: 'systemNewsStudent',
                name: 'tSystemNewsStudent',
                component: SystemNewsStudent,
                meta: {requiresAuth: true, keepAlive: true}
              }
            ]
          }
        ]
      }, {
        name: 'tMy',
        path: 'my',
        component: My,
        meta: {requiresAuth: true, keepAlive: true},
        children: [
          {
            name: 'tSet',
            path: 'set',
            component: Set,
            meta: {requiresAuth: true, keepAlive: true},
            children: [
              {
                path: 'revisePwd',
                name: 'tRevisePwd',
                component: RevisePwd,
                meta: {requiresAuth: true, keepAlive: true}
              }
            ]
          },
          {
            name: 'tAbout',
            path: 'about',
            component: About,
            meta: {requiresAuth: true, keepAlive: true}
          },
          {
            name: 'tEditPhone',
            path: 'editPhone',
            component: EditPhone,
            meta: {requiresAuth: true, keepAlive: true},
            children: [
              {
                path: 'resizeBind',
                name: 'tResizeBind',
                component: PhoneBinding,
                meta: {requiresAuth: true, keepAlive: true}
              }
            ]
          }
        ]
      }
    ]
  }, {
    path: '/teacher/classDetails',
    name: 'tClassDetails',
    component: classDetails,
    meta: {requiresAuth: true, keepAlive: false}
  }]
