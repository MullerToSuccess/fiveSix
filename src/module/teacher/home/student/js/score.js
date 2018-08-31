export default class Score {
  constructor ({label}) {
    this.label = label
    this.placeholder = '请输入分数'
    this.validsms = '请输入正确的分数！'
    this.pattern = /^\d+$/
    this.key = 'score'
  }
}
