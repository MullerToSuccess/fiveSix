import Student from 'managerHome/student/js/student'

export function _normalizeStudents (list) {
  let map = {}
  list.forEach((item, index) => {
    const key = item.Findex
    if (!map[key]) {
      map[key] = {
        title: key,
        items: []
      }
    }
    map[key].items.push(new Student({
      name: item.Fsinger_name,
      id: item.Fsinger_mid
    }))
  })
  // 得到有序列表
  let ret = []
  for (let key in map) {
    let val = map[key]
    if (val.title.match(/[a-zA-Z]/)) {
      ret.push(val)
    }
  }
  ret.sort((a, b) => {
    return a.title.charCodeAt(0) - b.title.charCodeAt(0)
  })
  return ret
}
