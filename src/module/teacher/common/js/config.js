export const CellConfig = {
  name: {
    label: '姓名',
    placeholder: '请输入姓名',
    validsms: '请输入1到5个汉字!',
    pattern: /^[\u4E00-\u9FA5]{1,5}$/,
    key: 'name'
  },
  phone: {
    label: '手机号',
    placeholder: '请输入手机号',
    validsms: '请输入正确的手机号！',
    pattern: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\\d{8}$/,
    key: 'phone'
  },
  user: {
    label: '密码',
    placeholder: '请输入密码',
    validsms: '',
    pattern: '',
    key: 'password'
  },
  cardId: {
    label: '身份证',
    placeholder: '请输入身份证',
    validsms: '请输入正确的身份证号码！',
    pattern: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
    key: 'cardId'
  },
  graduate: {
    label: '毕业院校',
    placeholder: '请输入毕业院校',
    validsms: '',
    pattern: '',
    key: 'graduate'
  },
  professional: {
    label: '专业',
    placeholder: '请输入所学专业',
    validsms: '',
    pattern: '',
    key: 'professional'
  },
  email: {
    label: '邮箱',
    placeholder: '请输入邮箱',
    validsms: '请输入正确的邮箱格式！',
    pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
    key: 'email'
  },
  address: {
    label: '地址',
    placeholder: '请输入地址',
    validsms: '',
    pattern: '',
    key: 'address'
  },
  resume: {
    label: '个人简历',
    placeholder: '请输入个人简历',
    validsms: '',
    pattern: '',
    key: 'resume'
  }
}
