import API from '@/axios/_api'

let apis = {
  getHomeworkDetailBasic: 'jwt/homework/stat/basic',
  commentplGetList: 'jwt/homework/commentpl/getList',
  commentplCreate: 'jwt/homework/commentpl/create',
  setPraise: 'jwt/homework/correct/setPraise',
  returnRewrite: 'jwt/homework/publish/redo',
  addComment: 'jwt/homework/correct/addComment',
  commentplRemove: 'jwt/homework/commentpl/remove'
}

let batchEvaluate = new API(apis)

batchEvaluate.getHomeworkDetailBasic = (params) => {
  return batchEvaluate.fetch(apis.getHomeworkDetailBasic, params, 'post', {"authJwt": true})
}

batchEvaluate.commentplGetList = (params) => {
  return batchEvaluate.fetch(apis.commentplGetList, params, 'post', {"authJwt": true})
}

batchEvaluate.commentplCreate = (params) => {
  return batchEvaluate.fetch(apis.commentplCreate, params, 'post', {"authJwt": true})
}

batchEvaluate.setPraise = (params) => {
  return batchEvaluate.fetch(apis.setPraise, params, 'post', {"authJwt": true})
}

batchEvaluate.returnRewrite = (params) => {
  return batchEvaluate.fetch(apis.returnRewrite, params, 'post', {"authJwt": true})
}

batchEvaluate.addComment = (params) => {
  return batchEvaluate.fetch(apis.addComment, params, 'post', {"authJwt": true})
}

batchEvaluate.commentplRemove = (params) => {
  return batchEvaluate.fetch(apis.commentplRemove, params, 'post', {"authJwt": true})
}

export default batchEvaluate
