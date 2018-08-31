import API from '@/axios/_api'

let apis = {
  'stuHomework': 'jwt/homework/stat/basicForStudent',
  'getMiniResource': 'jwt/homework/stat/getMinResourceList'
}

let studentHomework = new API(apis)
studentHomework.studentHomeworkInfo = params => {
  return studentHomework.fetch(studentHomework.apis.stuHomework, params, 'post', {tips: false, "authJwt": true})
}
studentHomework.getMiniResource = params => {
  return studentHomework.fetch(studentHomework.apis.getMiniResource, params, 'post', {"authJwt": true})
}

export default studentHomework
