const Manager = (resolve) => {
  import('manager/manager').then((module) => {
    resolve(module)
  })
}
const Home = (resolve) => {
  import('managerHome/mHome').then((module) => {
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
const My = (resolve) => {
  import('@/module/my/components/my').then((module) => {
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
const Set = (resolve) => {
  import('@/module/my/components/set').then((module) => {
    resolve(module)
  })
}
const RevisePwd = (resolve) => {
  import('@/module/my/components/revisePwd').then((module) => {
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
    path: '/manager',
    name: 'manager',
    component: Manager,
    meta: {requiresAuth: true, keepAlive: true, isUseCache: false},
    children: [
      {
        name: 'mHome',
        path: 'home',
        component: Home,
        meta: {requiresAuth: true, keepAlive: true}
      }, {
        name: 'mNews',
        path: 'news',
        component: News,
        meta: {requiresAuth: true, keepAlive: true},
        children: [
          {
            name: 'mDetails',
            path: 'details',
            component: Details,
            meta: {requiresAuth: true, keepAlive: false}
          }
        ]
      }, {
        name: 'mMy',
        path: 'my',
        component: My,
        meta: {requiresAuth: true, keepAlive: true},
        children: [
          {
            name: 'mSet',
            path: 'set',
            component: Set,
            meta: {requiresAuth: true, keepAlive: true},
            children: [
              {
                path: 'revisePwd',
                name: 'mRevisePwd',
                component: RevisePwd,
                meta: {requiresAuth: true, keepAlive: true}
              }
            ]
          },
          {
            name: 'mAbout',
            path: 'about',
            component: About,
            meta: {requiresAuth: true, keepAlive: true}
          },
          {
            name: 'mEditPhone',
            path: 'editPhone',
            component: EditPhone,
            meta: {requiresAuth: true, keepAlive: true},
            children: [
              {
                path: 'resizeBind',
                name: 'mResizeBind',
                component: PhoneBinding,
                meta: {requiresAuth: true, keepAlive: true}
              }
            ]
          }
        ]
      }
    ]
  }]
