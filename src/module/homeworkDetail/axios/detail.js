import API from '@/axios/_api'

let apis = {
  'detail': 'jwt/homework/stat/basic', // 统计
  'resource': 'jwt/homework/stat/getResourceList',
  'getMiniResource': 'jwt/homework/stat/getMinResourceList',
  'sendAnswer': 'jwt/homework/correct/sendAnswer',
  'urge': 'jwt/notice/message/jiaozuoye', // 催交作业
  'remind': 'jwt/notice/message/dingzheng', // 攻克提醒
  'remove': 'jwt/homework/publish/remove', // 删除作业
  'favorite': 'jwt/homework/favorite/update', //  收藏作业 1收藏 0 取消收藏
  'kp': 'jwt/homework/stat/getKpList',
  'getQtiListByKp': 'jwt/homework/stat/getQtiListByKp',
  'getQtiExamids': 'jwt/resource/exam/getQtiExamids'
}

let homeworkinfo = new API(apis)
homeworkinfo.getinfo = (params) => {
  return homeworkinfo.fetch(homeworkinfo.apis.detail, params, 'post', {"authJwt": true})
}
homeworkinfo.getResourceList = (params) => {
  return homeworkinfo.fetch(homeworkinfo.apis.resource, params, 'post', {"authJwt": true})
}
homeworkinfo.getMiniResource = (params) => {
  return homeworkinfo.fetch(homeworkinfo.apis.getMiniResource, params, 'post', {"authJwt": true})
}
homeworkinfo.sendAnswer = (params) => {
  return homeworkinfo.fetch(homeworkinfo.apis.sendAnswer, params, 'post', {"authJwt": true})
}
homeworkinfo.urge = (params) => {
  return homeworkinfo.fetch(homeworkinfo.apis.urge, params, 'post', {"authJwt": true})
}
homeworkinfo.remind = (params) => {
  return homeworkinfo.fetch(homeworkinfo.apis.remind, params, 'post', {"authJwt": true})
}
homeworkinfo.remove = (params) => {
  return homeworkinfo.fetch(homeworkinfo.apis.remove, params, 'post', {"authJwt": true})
}
homeworkinfo.favorite = (params) => {
  return homeworkinfo.fetch(homeworkinfo.apis.favorite, params, 'post', {"authJwt": true})
}
homeworkinfo.kp = params => {
  return homeworkinfo.fetch(homeworkinfo.apis.kp, params, 'post', {"authJwt": true})
}
homeworkinfo.getQtiListByKp = params => {
  return homeworkinfo.fetch(homeworkinfo.apis.getQtiListByKp, params, 'post', {"authJwt": true})
}
homeworkinfo.getQtiExamids = params => {
  return homeworkinfo.fetch(homeworkinfo.apis.getQtiExamids, params, 'post', {"authJwt": true})
}
export default homeworkinfo
