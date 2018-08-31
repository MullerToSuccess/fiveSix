const icomType = {
  '35': '高效阅读',
  '36': '口语训练',
  '84': '群英争霸(句子版)',
  '420': '闻英起舞',
  '500': '知识脑图',
  '503': '群英争霸(词汇版)',
  '504': '老鹰抓小鸡',
  '507': '单词汉堡',
  '508': '成功营救',
  '4423': '吃火锅',
  '4424': '虎口拔牙',
  '4427': '图型计算器',
  '4628': '互动视频',
  '4630': '单词速记',
  '4642': '宝瓶收妖(听音辨词)',
  '4643': '宝瓶收妖(语音识词)',
  '4688': '作文集',
  '4690': '国学',
  '4680': '古诗文',
  '4692': '互动题板',
  '4693': '投票',
  '5000': '闻音起舞(音标)',
  '5001': '字母书写',
  '5002': '字母学习',
  '5003': '音标学习',
  '5007': '微课',
  '5009': '汉字听写',
  '5011': '口算训练',
  '5013': '小熊射手',
  '5015': '斗地鼠',
  '5029': '图形切割',
  '5020': '英语听写',
  '4679': 'flash播放器',
  '5018': '小熊射手',
  '5005': '截屏答题'
}
// 过滤题干中的标签
const replaceTag = val => {
  return val.replace(/<span class="pos"><\/span>/g, '_____').replace(/<.+?>/g, '-')
}
const timeFormat = val => {
  return val
}
const timeFormatSecond = val => {
  let str = ''
  let time = val
  let s = parseInt(time) % 60.0
  let m = parseInt(time / 60.0 % 60.0)
  let h = parseInt(time / 60.0 / 60.0)
  str = h >= 1 ? `${m + parseInt(h * 60.0)}分${s}秒` : m >= 1 ? `${m}分${s}秒` : `${s}秒`
  return str
}
const timeFormatT = val => {
  let time = val
  if (time != null && time !== '') {
    if (time > 60 && time < 60 * 60) {
      time = parseInt(time / 60.0) + '分' + parseInt((parseFloat(time / 60.0) -
                      parseInt(time / 60.0)) * 60) + '秒'
    } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
      time = parseInt(time / 3600.0) + '小时' + parseInt((parseFloat(time / 3600.0) -
                      parseInt(time / 3600.0)) * 60) + '分' +
                      parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                      parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + '秒'
    } else if (time >= 60 * 60 * 24) {
      time = parseInt(time / 3600.0 / 24) + '天' + parseInt((parseFloat(time / 3600.0 / 24) -
                      parseInt(time / 3600.0 / 24)) * 24) + '小时' + parseInt((parseFloat(time / 3600.0) -
                      parseInt(time / 3600.0)) * 60) + '分' +
                      parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                      parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + '秒'
    } else {
      time = parseInt(time) + '秒'
    }
  }
  return time
}
const questionName = (val, params) => {
  if (!params) {
    return false
  }
  let name = '未知类型'
  if (params.resource_type === 'icom' || (params.icom_app_name && !params.resource_type)) {
    name = icomType[params.icom_id] || '组件'
  } else if (params.resource_type === 'graph') {
    name = '图形计算器'
  } else if (params.resource_type === 'qti_question') {
    name = params.qti_question_type_name ? params.qti_question_type_name : params.name
  } else if (params.resource_type === 'qti_exam') {
    name = '互动试卷'
  } else if (params.resource_type === 'qti_exam_sheet' || params.resource_type === 'qti_question_sheet') {
    name = '答题卡'
  } else if (params.icom_id === 4679 && params.icom_app_name === 'flashplayer') {
    name = 'flash播放组件'
  } else if (params.resource_type === 'courseware') {
    name = '互动课件'
  }
  return name
}
const addHttp = (val) => {
  return val.indexOf('http://') > -1 ? val : window.bus.$store.getters['runEnv/old'] + val
}
// 保留一位小数百分比
const percent = (val) => {
  if (val === '' || val <= -1) {
    return '--'
  } else if (val === 1) {
    return '100%'
  } else {
    let num = round(val * 100, 1)
    return val === 0 ? '0%' : num + '%'
  }
}
// 组件详情中替换答案
const replaceAnswer = (val, answer) => {
  return val.replace('?', '<span style="color:#ff4e00">' + answer + '</span>')
}
const round = (num, d) => {
  // num* 10的d次方
  num *= Math.pow(10, d);
  // 对num四舍五入取整
  num = Math.round(num);
  // num/ 10的d次方
  num /= Math.pow(10, d);
  return num;
}
const date = (input, is) => {
  if (!input) return ''
  const d = new Date(input)
  const year = d.getFullYear()
  let month = d.getMonth() + 1
  month = month < 10 ? '0' + month : month
  const day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate()
  return is ? year + '-' + month : year + '-' + month + '-' + day
}
const spaceDate = (str) => {
  const reg = /\s{1}/
  if (reg.test(str)) {
    let timeStr = str.split(' ')[1]
    return timeStr.substring(0, timeStr.length - 3)
  } else {
    return str
  }
}
const guardian = (str) => {
  let arr = window.bus.$store.state.managerStudent.guardianConfig
  let name
  arr.forEach((v, i) => {
    if (v.codeValue === str) name = v.codeName
  })
  return name
}
const showSize = (str) => {
  let equalIndex = str.indexOf('=')
  if (str.indexOf('=') > 0) {
    str = str.substring(0, equalIndex)
  }
  let strLength = str.length
  let size = ""
  size = (strLength / 1024).toFixed(2)
  return parseInt(size);
}
export {
  replaceTag,
  timeFormat,
  timeFormatSecond,
  questionName,
  addHttp,
  percent,
  replaceAnswer,
  timeFormatT,
  date,
  spaceDate,
  guardian,
  showSize
}
