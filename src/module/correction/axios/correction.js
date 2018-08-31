import API from '@/axios/_api'

let apis = {
  'create': 'jwt/resource/correction/create',
  'getAuthority': 'jwt/cuoti/error/upload_auth',
  'upLoad': 'jwt/cuoti/error/base64_upload'
}

let correction = new API(apis)

correction.create = (params) => {
  return correction.fetch(correction.apis.create, params, 'post')
}
correction.getAuthority = (params) => {
  return correction.fetch(correction.apis.getAuthority, params, 'post')
}
correction.upload = (params) => {
  return correction.fetch(correction.apis.upLoad, params, 'post')
}
export default correction
