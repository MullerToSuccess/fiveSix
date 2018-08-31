import API from '@/axios/_api'

let apis = {
  'getTodayList': '/client/stm/teach/getTodayList',
  'getClassList': '/client/stm/teach/getClassList',
  'getTrusteeship': '/client/stm/teach/getTrusteeship',
  'addFeedback': '/client/stm/teach/addFeedback',
  'Kpoint': '/api/index.php?q=json/Kpoint/search',
  'getHistoryFeedback': '/client/stm/teach/getHistoryFeedback',
  'getHistoryFeedbackInfo': '/client/stm/teach/getHistoryFeedbackInfo'
}

let hosting = new API(apis)

hosting.getTodayList = (params) => {
  return hosting.fetch(hosting.apis.getTodayList, params, 'get', {"api": "api56"})
}
hosting.getClassList = (params) => {
  return hosting.fetch(hosting.apis.getClassList, params, 'get', {"api": "api56"})
}
hosting.getTrusteeship = (params) => {
  return hosting.fetch(hosting.apis.getTrusteeship, params, 'get', {"api": "api56"})
}
hosting.addFeedback = (params) => {
  return hosting.fetch(hosting.apis.addFeedback, params, 'post', {"api": "api56", "dataType": 'json', 'headers': {'Content-Type': 'application/json'}})
}
hosting.Kpoint = (params) => {
  return hosting.fetch(hosting.apis.Kpoint, params, 'get', {"api": "apidev", "auth": false})
}
hosting.getHistoryFeedback = (params) => {
  return hosting.fetch(hosting.apis.getHistoryFeedback, params, 'get', {"api": "api56"})
}
hosting.getHistoryFeedbackInfo = (params) => {
  return hosting.fetch(hosting.apis.getHistoryFeedbackInfo, params, 'get', {"api": "api56"})
}

export default hosting
