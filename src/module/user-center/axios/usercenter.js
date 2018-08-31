import API from '@/axios/_api'

let apis = {
  'info': 'jwt/user/account/get',
  'myClass': 'jwt/user/classes/getWithUser',
  'classInfo': 'jwt/user/classes/getMembers',
  'personal': 'jwt/user/account/update',
  'captcha': 'common/captcha/send', // 发送验证码
  'valid': 'common/captcha/valid', // 验证验证码
  'bind': '/user/phone/bind',
  'modifyPassword': 'jwt/user/password/update',
  'feedback': '/feedback/addFeedback' // 意见反馈
}

let usercenter = new API(apis)

usercenter.obtainInfo = (params) => {
  return usercenter.fetch(usercenter.apis.info, params, 'post')
}

usercenter.obtainclasses = (params) => {
  return usercenter.fetch(usercenter.apis.myClass, params, 'post')
}

usercenter.obtainclassDeatail = (params) => {
  return usercenter.fetch(usercenter.apis.classInfo, params, 'post')
}

usercenter.uploadImg = (url, params) => {
  return usercenter.uploadImage(url, params)
}

usercenter.modify = (params) => {
  return usercenter.fetch(usercenter.apis.personal, params, 'post')
}

usercenter.captcha = (params) => {
  return usercenter.fetch(usercenter.apis.captcha, params, 'post')
}

usercenter.valid = (params) => {
  return usercenter.fetch(usercenter.apis.valid, params, 'post')
}

usercenter.bind = (params) => {
  return usercenter.fetch(usercenter.apis.bind, params, 'post')
}

usercenter.modifyPassword = (params) => {
  return usercenter.fetch(usercenter.apis.modifyPassword, params, 'post')
}

usercenter.feedback = (params) => {
  return usercenter.fetch(usercenter.apis.feedback, params, 'post', {'api': 'apis2'})
}

export default usercenter
