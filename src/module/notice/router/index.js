// import notice from '@/module/notice/components/noticeList.vue'
// import homeworkList from '@/module/notice/components/homeworkList.vue'
// import schoolList from '@/module/notice/components/schoolList.vue'
// import noticeDetail from '@/module/notice/components/noticeDetail.vue'
const notice = () => import(/* webpackChunkName: "notice" */'@/module/notice/components/noticeList.vue');
const homeworkList = () => import(/* webpackChunkName: "notice" */'@/module/notice/components/homeworkList.vue');
const schoolList = () => import(/* webpackChunkName: "notice" */'@/module/notice/components/schoolList.vue');
const noticeDetail = () => import(/* webpackChunkName: "notice" */'@/module/notice/components/noticeDetail.vue');

export default [{
  path: '/notice',
  name: 'notice',
  component: notice,
  meta: {
    requiresAuth: false,
    keepAlive: true
  }
}, {
  path: '/notice/homeworkList',
  name: 'homeworkNoticeList',
  component: homeworkList,
  meta: {
    requiresAuth: false,
    keepAlive: false
  }
},
{
  path: '/notice/schoolList',
  name: 'schoolNoticeList',
  component: schoolList,
  meta: {
    requiresAuth: false,
    keepAlive: false
  }
}, {
  path: '/notice/noticeDetail',
  name: 'noticeDetail',
  component: noticeDetail,
  meta: {
    requiresAuth: false,
    keepAlive: false
  }
}
]
