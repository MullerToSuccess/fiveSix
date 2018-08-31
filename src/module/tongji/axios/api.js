import API from '@/axios/_api'
import qs from 'qs'

let apis = {
  'statistics': 'jwt/homework/stat/getByRid?' // 统计
}

let questionStatistics = new API(apis)
questionStatistics.getinfo = (params) => {
  return questionStatistics.fetch(questionStatistics.apis.statistics + qs.stringify(params), undefined, 'get')
}

export default questionStatistics
