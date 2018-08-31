import API from '@/axios/_api'

let apis = {
  'share': 'api/?q=json/ebag/space/thread/shareAdd'
}

let share = new API(apis)
share.share = (params) => {
  return share.fetch(share.apis.share, {"info": JSON.stringify(params)}, 'post', {api: 'old', auth: false, "authJwt": true})
}
export default share
