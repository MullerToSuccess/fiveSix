import API from '@/axios/_api'
import qs from 'qs'

let apis = {
  'task': 'jwt/task/teacher/lists', // 登录
  'unReadMsg': 'jwt/notice/message/getUnreadNum',
  'qrcode': 'apiv5/index.php?r=ebag/Qrcode/VerifyQrcode&',
  'userAuth': 'api/?q=json/UserAuth/getItems'
}

let home = new API(apis)

home.task = (params) => {
  return home.fetch(home.apis.task, params, 'post', {"authJwt": true})
}
home.getMsg = (params) => {
  return home.fetch(home.apis.unReadMsg, params, 'post', {"authJwt": true})
}
/**
 * 接口功能 扫码登录后传递扫码信息和用户信息
 * @param {string} token 必须 用户id
 * @param {string} uuid 必须 二维码的唯一标识
 * @param {string} action 必须 操作的类型 'login','scan'
 * @returns
 */
home.qrcode = params => {
  console.log(qs.stringify(params))
  return home.fetch(home.apis.qrcode + qs.stringify(params), undefined, 'get', {'api': 'old', "auth": false, 'tips': false})
}

/**
 * 检查用户权限
 * {"userid":"33609","codes":["TEACHER_MIBILE_ASK"]}
 * @param {string} userid
 * @param {array} codes
 */
home.userAuth = params => {
  return home.fetch(home.apis.userAuth, {"info": JSON.stringify(params)}, 'post', {'api': 'old', "auth": false})
}

export default home
