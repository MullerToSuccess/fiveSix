import API from '@/axios/_api'

let apis = {
  homeworkLists: 'jwt/homework/publish/getListForTeacher',
  launch: "jwt/homework/publish/create",
  getResourceLists: "jwt/resource/package/get",
  getBookLists: "jwt/resource/common/getBookLists",
  getGradeLists: "jwt/resource/common/getGradeLists",
  getLists: "jwt/resource/package/search",
  saveRecord: "jwt/user/book/saveRecord",
  getLastRecord: "jwt/user/book/getLastRecord",
  favoriteUpdate: "jwt/resource/favorite/update",
  getIfCollect: "jwt/resource/favorite/get",
  getSingleBookByTeacher: "jwt/homework/publish/getStatus",
  getBooksByTeacher: "jwt/resource/common/getBooksByTeacher"
}

let publishHomeWork = new API(apis)

publishHomeWork.getSingleBookByTeacher = (params) => {
  return publishHomeWork.fetch(apis.getSingleBookByTeacher, params, 'post', {"authJwt": true})
}

publishHomeWork.favoriteUpdate = (params) => {
  return publishHomeWork.fetch(apis.favoriteUpdate, params, 'post', {"authJwt": true})
}

publishHomeWork.getIfCollect = (params) => {
  return publishHomeWork.fetch(apis.getIfCollect, params, 'post', {"authJwt": true})
}

publishHomeWork.homeworkLists = (params) => {
  return publishHomeWork.fetch(apis.homeworkLists, params, 'post', {"authJwt": true})
}

publishHomeWork.launch = (params) => {
  return publishHomeWork.fetch(apis.launch, params, 'post', {"authJwt": true})
}

publishHomeWork.getResourceLists = (params) => {
  return publishHomeWork.fetch(apis.getResourceLists, params, 'post', {"authJwt": true})
}

publishHomeWork.getBookLists = (params) => {
  return publishHomeWork.fetch(apis.getBookLists, params, 'post', {"authJwt": true})
}

publishHomeWork.getGradeLists = (params) => {
  return publishHomeWork.fetch(apis.getGradeLists, params, 'post', {"authJwt": true})
}

publishHomeWork.getLists = (params) => {
  return publishHomeWork.fetch(apis.getLists, params, 'post', {"authJwt": true})
}
publishHomeWork.saveRecord = (params) => {
  return publishHomeWork.fetch(apis.saveRecord, params, 'post', {"authJwt": true})
}
publishHomeWork.getLastRecord = (params) => {
  return publishHomeWork.fetch(apis.getLastRecord, params, 'post', {"authJwt": true})
}
publishHomeWork.getBooksByTeacher = (params) => {
  return publishHomeWork.fetch(apis.getBooksByTeacher, params, 'post', {"authJwt": true})
}

export default publishHomeWork
