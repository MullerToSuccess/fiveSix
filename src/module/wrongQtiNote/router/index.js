// import wrongQtiNote from '@/module/wrongQtiNote/pages/index'
const wrongQtiNote = () => import(/* webpackChunkName: "wrongQtiNote" */'@/module/wrongQtiNote/pages/index');
export default [
  {
    path: '/wrongQtiNote',
    name: 'wrongQtiNote',
    component: wrongQtiNote,
    meta: { requiresAuth: true, keepAlive: true }
  }
]
