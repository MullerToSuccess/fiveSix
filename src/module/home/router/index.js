// import home from '@/module/home/pages/index'
// import afterQRscan from '@/module/home/pages/QRcodeScan'

const home = () => import(/* webpackChunkName: "home" */ '@/module/home/pages/index')
const afterQRscan = () => import(/* webpackChunkName: "afterQRscan" */ '@/module/home/pages/QRcodeScan')
export default [
  {
    path: '/',
    name: 'home',
    component: home,
    meta: { requiresAuth: true, keepAlive: true }
  },
  {
    path: '/afterQRscan/:status/:uuid', // 0为失败，1为成功
    name: 'afterQrscan',
    component: afterQRscan,
    meta: { requiresAuth: true, keepAlive: true }
  }
]
