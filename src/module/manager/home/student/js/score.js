export default class Score {
  constructor ({label, subject}) {
    this.label = label
    this.placeholder = '请输入分数'
    this.validsms = '请输入0-100的整数！'
    this.pattern = /^(?:0|[1-9][0-9]?|100)$/
    this.key = 'score'
    this.subject = subject
  }
}
