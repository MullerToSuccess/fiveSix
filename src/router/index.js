// import Vue from 'vue'
// import Router from 'vue-router'
// import account from '@/module/account/router'
// // 纠错
// import correction from '@/module/correction/router'
// // 通知/消息
// import notice from '@/module/notice/router'
// // 批改作业--按题
// import answerDetail from '@/module/answerDetail/router'
// // 批改作业--作业详情
// import homeworkDetail from '@/module/homeworkDetail/router'
// import userCenter from '@/module/user-center/router'
// import home from '@/module/home/router/index'
// import homeworkRoutes from '@/module/homework/homework.route'
// import studentHomework from '@/module/studentHomework/route'
// import originalQuestion from '@/module/qti/router/index'
// import share from '@/module/share/router/index'
// import wrongQtiNote from '@/module/wrongQtiNote/router/index'
// import correctIdea from '@/module/correctIdea/router/index'
// // 批量评价
// import batchEvaluateRoutes from '@/module/batchEvaluate/batchEvaluate.route'
// Vue.use(Router)
// let routes = [
//   ...home,
//   ...homeworkRoutes,
//   ...userCenter,
//   ...account,
//   ...correction,
//   ...notice,
//   ...answerDetail,
//   ...homeworkDetail,
//   ...batchEvaluateRoutes,
//   ...studentHomework,
//   ...originalQuestion,
//   ...share,
//   ...wrongQtiNote,
//   ...correctIdea
// ]
// let router = new Router({
//   routes: routes
// })
// // 全局跳转
// router.beforeEach((to, from, next) => {
//   // 定义路由堆栈信息，便于转场动画
//   let routerArr = router.app.$options.store.state.account.routerStack
//   if (routerArr.find(val => val === to.name)) {
//     router.app.$options.store.state.account.transitionType = 'back'
//   } else {
//     router.app.$options.store.state.account.transitionType = 'forward'
//   }
//   if (to.name === 'home' || to.name === 'login' || to.name === 'userCenter') {
//     router.app.$options.store.state.account.transitionType = 'fade'
//     if (to.name === 'login') {
//       router.app.$options.store.state.account.routerStack = []
//     }
//   }
//   if (!routerArr.find((val) => val === to.name)) {
//     routerArr.push(to.name)
//   } else {
//     if (from.name === routerArr[routerArr.length - 1]) {
//       routerArr.splice(-1, 1)
//     }
//   }
//   // 没定义的路由，跳到/
//   if (to.name === null) {
//     next({
//       path: '/'
//     })
//   }
//   // console.log('to=>', to, 'from=>', from)
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     // 检查state的isLogin
//     if (!router.app.$options.store.state.account.isLogin) {
//       // 从sessionStroage中刷新isLogin
//       router.app.$options.store.dispatch('account/refreshLocalIsLogin')
//       // 再次检查state的isLogin
//       if (!router.app.$options.store.state.account.isLogin) {
//         next({
//           path: '/login',
//           query: {
//             redirect: to.fullPath
//           } // 把要跳转的地址作为参数传到下一步
//         })
//       } else {
//         next()
//       }
//     } else {
//       next()
//     }
//   } else {
//     // 如果to登录页
//     if (to.path === '/login') {
//       // 帐号已经登录过了，就直接转到首页
//       router.app.$options.store.dispatch('account/refreshLocalIsLogin')
//       // console.log('router.app.$options.store.state.account.isLogin', router.app.$options.store.state.account.isLogin)
//       if (router.app.$options.store.state.account.isLogin) {
//         next({
//           path: '/'
//         })
//       } else {
//         next() // 确保一定要调用 next()
//       }
//     } else {
//       next() // 确保一定要调用 next()
//     }
//   }
// })
import Vue from 'vue'
import Router from 'vue-router'
import {Toast} from 'vant'
import account from 'account/router/index'
import manager from 'manager/router/index'
import managerStudent from 'managerHome/student/router/index'
import managerTeacher from 'managerHome/teacher/router/index'
import managerClass from 'managerHome/class/router/index'

import teacher from 'teacher/router/index'
import teacherStudent from 'teacherHome/student/router/index'
// 纠错
// import correction from '@/module/correction/router'
// 通知/消息
// import notice from '@/module/notice/router'
// 批改作业--按题
import answerDetail from '@/module/answerDetail/router'
// 批改作业--作业详情
import homeworkDetail from '@/module/homeworkDetail/router'
// import userCenter from '@/module/user-center/router'
import homeworkRoutes from '@/module/homework/homework.route'
import studentHomework from '@/module/studentHomework/route'
import originalQuestion from '@/module/qti/router/index'
import share from '@/module/share/router/index'
import correctIdea from '@/module/correctIdea/router/index'
// 批量评价
import batchEvaluateRoutes from '@/module/batchEvaluate/batchEvaluate.route'
// 发布作业
// import publishHomework from '@/module/publishHomework/router/index'

Vue.use(Router)

let routes = [
  ...account,
  ...manager,
  ...managerStudent,
  ...managerTeacher,
  ...managerClass,
  ...teacher,
  ...teacherStudent,
  ...homeworkRoutes,
  ...homeworkDetail,
  ...answerDetail,
  ...batchEvaluateRoutes,
  ...studentHomework,
  ...originalQuestion,
  ...share,
  ...correctIdea
]
let router = new Router({
  routes: routes
})

router.beforeEach((to, from, next) => {
  // 定义路由堆栈信息，便于转场动画
  const fade = ['manager', 'teacher', 'home', 'news', 'my', 'login']
  let toUrlArr = to.fullPath.split('/')
  let fromUrlArr = from.fullPath.split('/')
  let toLastRoute = toUrlArr[toUrlArr.length - 1]
  let fromLastRoute = fromUrlArr[fromUrlArr.length - 1]
  let routerArr = router.app.$options.store.state.account.routerStack
  if (routerArr.find(val => val === to.name)) {
    router.app.$options.store.state.account.transitionType = 'back'
  } else {
    router.app.$options.store.state.account.transitionType = 'forward'
  }
  // 在fade数组中转场
  if (fade.indexOf(toLastRoute) >= 0 && (fade.indexOf(fromLastRoute) >= 0 || fromLastRoute === '')) {
    router.app.$options.store.state.account.transitionType = 'fade'
    if (to.name === 'login') {
      router.app.$options.store.state.account.routerStack = ['login']
    }
  }
  if (!routerArr.find((val) => val === to.name)) {
    routerArr.push(to.name)
  } else {
    if (from.name === routerArr[routerArr.length - 1]) {
      routerArr.splice(-1, 1)
    }
  }
  // 没定义的路由，跳到/
  if (to.name === null) {
    router.app.$options.store.dispatch('account/refreshLocalIsLogin')
    // 再次检查state的isLogin
    if (!router.app.$options.store.state.account.isLogin) {
      next({
        path: '/login'
      })
    } else {
      router.app.$options.store.dispatch('account/refreshMobileBind')
      if (!router.app.$options.store.state.account.mobileBind) { // 没有绑定
        Toast(`请先绑定手机号`)
        next({
          path: '/login/phoneBinding',
          query: {
            redirect: toNull()
          }
        })
      } else {
        router.app.$options.store.dispatch('account/refreshLocalIdentity')
        if (!router.app.$options.store.state.account.userIdentity) { // 没有身份
          next({
            path: '/login'
          })
        } else {
          next({
            path: toNull()
          })
        }
      }
    }
  }
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 检查state的isLogin
    router.app.$options.store.dispatch('account/refreshLocalIsLogin')
    if (!router.app.$options.store.state.account.isLogin) { //  没有登录
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        } // 把要跳转的地址作为参数传到下一步
      })
    } else { // 权限校验
      router.app.$options.store.dispatch('account/refreshMobileBind')
      if (!router.app.$options.store.state.account.mobileBind) { // 没有绑定
        Toast(`请先绑定手机号`)
        next({
          path: '/login/phoneBinding',
          query: {
            redirect: to.fullPath
          }
        })
      } else {
        router.app.$options.store.dispatch('account/refreshLocalIdentity')
        if (!router.app.$options.store.state.account.userIdentity) {
          Toast('身份错误，请重新登录！')
          next({
            path: '/login',
            query: {
              redirect: to.fullPath
            } // 把要跳转的地址作为参数传到下一步
          })
        } else {
          checkIdentity(to, next)
        }
      }
    }
  } else {
    next()
  }
})

function checkIdentity (to, next) {
  let reg = to.fullPath.split('/')[1]
  if (router.app.$options.store.state.account.userIdentity.indexOf(1) >= 0) { // 身份为店长
    if (reg === 'manager') {
      next()
    } else {
      console.log('当前身份只能在店长模块下浏览')
      next({
        path: '/manager'
      })
    }
  } else if (router.app.$options.store.state.account.userIdentity.indexOf(2) >= 0) { // 身份为教师
    if (reg === 'teacher') {
      next()
    } else {
      console.log('当前身份只能在教师模块下浏览')
      next({
        path: '/teacher'
      })
    }
  } else { // 没有教师、店长身份
    Toast('您没有进入此页面的权限！')
    next({
      path: '/login',
      query: {
        redirect: to.fullPath
      } // 把要跳转的地址作为参数传到下一步
    })
  }
}
function toNull () {
  let path
  if (router.app.$options.store.state.account.userIdentity.indexOf(1) >= 0) { // 身份为店长
    path = '/manager'
  } else if (router.app.$options.store.state.account.userIdentity.indexOf(2) >= 0) { // 身份为教师
    path = '/teacher'
  } else { // 没有教师、店长身份
    path = '/login'
  }
  return path
}
export default router
