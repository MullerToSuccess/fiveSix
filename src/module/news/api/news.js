import API from '@/axios/_api'

let apis = {
  'getMessage': 'client/getMessage',
  'checkIsFeedback': 'client/stm/teach/checkIsFeedback'
}

let news = new API(apis)

news.getMessage = (params) => {
  return news.fetch(news.apis.getMessage, params, 'get', {"api": 'api56'})
}
news.checkIsFeedback = (params) => {
  return news.fetch(news.apis.checkIsFeedback, params, 'get', {"api": 'api56'})
}
export default news
