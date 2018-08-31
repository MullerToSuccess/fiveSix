import API from '@/axios/_api'
import qs from 'qs'

let apis = {
  'statistics': 'jwt/homework/stat/getByRid', // 单题统计
  'speedRead': 'jwt/homework/stat/getReadingEfficiency',
  'subjectiveIcom': 'apiv5/index.php?r=resource/ResourceIcon/index&',
  'getDcom': 'jwt/resource/dcom/get' // 投票截图的图片
}

let questionStatistics = new API(apis)
questionStatistics.getinfo = (params) => {
  return questionStatistics.fetch(questionStatistics.apis.statistics + '?' + qs.stringify(params), undefined, 'get', {"authJwt": true})
}
questionStatistics.getDcom = (params) => {
  return questionStatistics.fetch(questionStatistics.apis.getDcom + '?' + qs.stringify(params), undefined, 'get', {"authJwt": true})
}
questionStatistics.getSubjectiveIcom = (params) => {
  return questionStatistics.fetch(questionStatistics.apis.subjectiveIcom + qs.stringify(params), undefined, 'get', {api: 'old', 'auth': false, "authJwt": true})
}
questionStatistics.speedRead = (params) => {
  return questionStatistics.fetch(questionStatistics.apis.speedRead + '?' + qs.stringify(params), undefined, 'get', {"authJwt": true})
}
export default questionStatistics
