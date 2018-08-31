import API from '@/axios/_api'

let apis = {
  studentMutualCommentsGetLists: 'jwt/homework/comment/getList',
  getUserStatusList: 'jwt/homework/stat/getUserStatus',
  setScore: 'jwt/homework/correct/setSore',
  saveAsImage: 'jwt/homework/correct/correct_upload_save',
  replaceImage: 'jwt/homework/correct/correct_upload_replace',
  mergeWithStudent: 'jwt/homework/correct/setPic',
  getUserAnswerForMiniRs: 'jwt/homework/stat/getUserAnswerForMiniRs'
}

let correctTheSubject = new API(apis)

correctTheSubject.studentMutualCommentsGetLists = (params) => {
  return correctTheSubject.fetch(apis.studentMutualCommentsGetLists, params, 'post', {"authJwt": true})
}

correctTheSubject.getUserStatusList = (params) => {
  return correctTheSubject.fetch(apis.getUserStatusList, params, 'post', {"authJwt": true})
}

correctTheSubject.getUserAnswerForMiniRs = (params) => {
  return correctTheSubject.fetch(apis.getUserAnswerForMiniRs, params, 'post', {"authJwt": true})
}

correctTheSubject.setScore = (params) => {
  return correctTheSubject.fetch(apis.setScore, params, 'post', {"authJwt": true})
}
correctTheSubject.saveAsImage = (params) => {
  return correctTheSubject.fetch(apis.saveAsImage, params, 'post', {"authJwt": true})
}

correctTheSubject.replaceImage = (params) => {
  return correctTheSubject.fetch(apis.replaceImage, params, 'post', {"authJwt": true})
}

correctTheSubject.mergeWithStudent = (params) => {
  return correctTheSubject.fetch(apis.mergeWithStudent, params, 'post', {"authJwt": true})
}

export default correctTheSubject
