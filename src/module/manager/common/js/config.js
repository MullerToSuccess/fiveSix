export const CellConfig = {
  name: {
    label: '姓名',
    placeholder: '请输入姓名',
    validsms: '请输入1到16个汉字或字母!',
    pattern: /^[a-zA-Z\u4e00-\u9fa5]{1,16}$/,
    key: 'name'
  },
  photo: {
    key: 'photo'
  },
  phone: {
    label: '手机号',
    placeholder: '请输入手机号',
    validsms: '请输入正确的手机号！',
    pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57]|19[89])[0-9]{8}$/,
    key: 'mobile'
  },
  user: {
    label: '密码',
    placeholder: '请输入密码',
    validsms: '请输入至少6位密码！',
    pattern: /^[a-zA-Z0-9]{6,10}$/,
    key: 'password'
  },
  cardId: {
    label: '身份证',
    placeholder: '请输入身份证',
    validsms: '请输入正确的身份证号码！',
    pattern: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
    key: 'idNumber'
  },
  graduate: {
    label: '毕业院校',
    placeholder: '请输入毕业院校',
    validsms: '',
    pattern: '',
    key: 'graduateSchool'
  },
  localSchool: { //   所属学生
    label: '所在学校',
    placeholder: '请输入所在学校',
    validsms: '',
    pattern: '',
    key: 'school'
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
    validsms: '请输入不超过50个汉字',
    pattern: /^[\u4e00-\u9fa5]{0,50}$/,
    key: 'address'
  },
  resume: {
    label: '个人简介',
    placeholder: '请输入个人简介',
    validsms: '',
    pattern: '',
    key: 'profile'
  },
  tSubject: {
    key: 'teach'
  },
  birthday: {
    type: 'date_year-month',
    key: 'birthday'
  },
  startTime: {
    type: 'date_time-start',
    key: 'startTime'
  },
  endTime: {
    type: 'date_time-end',
    key: 'endTime'
  },
  week: {
    type: 'date_week'
  },
  sex: {
    type: 'sex',
    key: 'sex',
    columns: ['男', '女']
  },
  political: {
    type: 'political',
    key: 'political',
    columns: ['党员', '团员', '群众']
  },
  degree: {
    type: 'degree',
    key: 'degree',
    columns: ''
  },
  householdAddress: {
    type: 'householdAddress',
    key: 'householdAddress',
    columns: ''
  },
  teacherQc: {
    key: 'teacherQc'
  },
  sEditClass: {
    key: 'sEditClass'
  },
  tEditClass: {
    key: 'tEditClass'
  },
  sEditScore: {
    key: 'score'
  },
  sEditGuardian: {
    type: 'guardian',
    key: 'guardian',
    columns: ''
  },
  sEditGrade: {
    type: 'grade',
    key: 'grade'
  },
  className: {
    label: '班级名称',
    placeholder: '请输入班级名称',
    validsms: '',
    pattern: '',
    key: 'className'
  }
}
