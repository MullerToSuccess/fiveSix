import API from '@/axios/_api'

let apis = {
  'getUserInfo': 'client/stm/user/getUserInfo',
  'changePhoto': 'client/changePhoto',
  'updatePassword': 'client/updatePassword'
}

let my = new API(apis)

my.getUserInfo = (params) => {
  return my.fetch(my.apis.getUserInfo, params, 'get', {"api": 'api56'})
}
my.changePhoto = (params) => {
  return my.fetch(my.apis.changePhoto, params, 'post', {"api": 'api56'})
}
my.updatePassword = (params) => {
  return my.fetch(my.apis.updatePassword, params, 'post', {"api": 'api56'})
}
export default my
