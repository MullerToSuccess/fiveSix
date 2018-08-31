// import batchEvaluate from './batchEvaluate.vue'
// import comments from './writeComments/comments.vue'
// import addComments from './writeComments/addComments.vue'
// import editComments from './writeComments/editComments.vue'
// import returnRewrite from './returnRewrite/returnRewrite.vue'
const batchEvaluate = () => import(/* webpackChunkName: "batchEvaluate" */'./batchEvaluate.vue');
const comments = () => import(/* webpackChunkName: "batchEvaluate" */'./writeComments/comments.vue');
const addComments = () => import(/* webpackChunkName: "batchEvaluate" */'./writeComments/addComments.vue');
const editComments = () => import(/* webpackChunkName: "batchEvaluate" */'./writeComments/editComments.vue');
const returnRewrite = () => import(/* webpackChunkName: "batchEvaluate" */'./returnRewrite/returnRewrite.vue');

let batchEvaluateRoutes = [{
  path: '/batchEvaluate',
  name: 'batchEvaluate',
  meta: { requiresAuth: false, keepAlive: false },
  component: batchEvaluate
}, {
  path: '/comments',
  name: 'comments',
  meta: { requiresAuth: false, keepAlive: false },
  component: comments
}, {
  path: '/addComments',
  name: 'addComments',
  meta: { requiresAuth: false, keepAlive: false },
  component: addComments
}, {
  path: '/editComments',
  name: 'editComments',
  meta: { requiresAuth: false, keepAlive: false },
  component: editComments
}, {
  path: '/returnRewrite',
  name: 'returnRewrite',
  meta: { requiresAuth: false, keepAlive: false },
  component: returnRewrite
}];

export default batchEvaluateRoutes;
