const userCenter = () => import(/* webpackChunkName: "usercenter" */'@/module/user-center/components/index')
const userInfo = () => import(/* webpackChunkName: "usercenter" */'@/module/user-center/components/personal')
const myClass = () => import(/* webpackChunkName: "usercenter" */'@/module/user-center/components/myClass')
const feedback = () => import(/* webpackChunkName: "usercenter" */'@/module/user-center/components/feedback')
const OtherQuestion = () => import(/* webpackChunkName: "usercenter" */'@/module/user-center/components/otherQuestion')
const setting = () => import(/* webpackChunkName: "usercenter" */'@/module/user-center/components/setting')
const aboutUs = () => import(/* webpackChunkName: "usercenter" */'@/module/user-center/components/aboutUs')
const modifyName = () => import(/* webpackChunkName: "usercenter" */'@/module/user-center/components/modifyName')
const modifyPhone = () => import(/* webpackChunkName: "usercenter" */'@/module/user-center/components/modifyPhone')
const classInfo = () => import(/* webpackChunkName: "usercenter" */'@/module/user-center/components/classInfo')
const modifyPassword = () => import(/* webpackChunkName: "usercenter" */'@/module/user-center/components/modifyPassword')
const msgSetting = () => import(/* webpackChunkName: "usercenter" */'@/module/user-center/components/msgSetting')
const BindPhone = () => import(/* webpackChunkName: "usercenter" */'@/module/user-center/components/bindPhone')

export default [
  {
    path: '/user-center',
    name: 'userCenter',
    component: userCenter,
    meta: { requiresAuth: true, keepAlive: false }
  },
  {
    path: '/personal',
    name: 'personal',
    component: userInfo,
    meta: { requiresAuth: true, keepAlive: false }
  },
  {
    path: '/myClass',
    name: 'myClass',
    component: myClass,
    meta: { requiresAuth: true, keepAlive: false }
  },
  {
    path: '/feedback',
    name: 'feedback',
    component: feedback,
    meta: { requiresAuth: true, keepAlive: true }
  },
  {
    path: '/otherQuestion',
    name: 'otherQuestion',
    component: OtherQuestion,
    meta: { requiresAuth: true, keepAlive: true }
  },
  {
    path: '/setting',
    name: 'setting',
    component: setting,
    meta: { requiresAuth: true, keepAlive: true }
  },
  {
    path: '/aboutUs',
    name: 'aboutUs',
    component: aboutUs,
    meta: { requiresAuth: true, keepAlive: false }
  },
  {
    path: '/modifyName/:name',
    name: 'modifyName',
    component: modifyName,
    meta: { requiresAuth: true, keepAlive: false }
  },
  {
    path: '/modifyPhone/:phone',
    name: 'modifyPhone',
    component: modifyPhone,
    meta: { requiresAuth: true, keepAlive: false }
  },
  {
    path: '/bindPhone',
    name: 'bindPhone',
    component: BindPhone,
    meta: { requiresAuth: true, keepAlive: false }
  },
  {
    path: '/classInfo/:class_id',
    name: 'classInfo',
    component: classInfo,
    meta: { requiresAuth: true, keepAlive: false }
  },
  {
    path: '/modifyPassword',
    name: 'modifyPassword',
    component: modifyPassword,
    meta: { requiresAuth: true, keepAlive: false }
  },
  {
    path: '/msgSetting',
    name: 'msgSetting',
    component: msgSetting,
    meta: { requiresAuth: true, keepAlive: false }
  }
]
