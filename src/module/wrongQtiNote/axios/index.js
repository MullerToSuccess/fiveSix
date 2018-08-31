import API from '@/axios/_api'

let apis = {
  getList: 'jwt/cuoti/lists/getByClass'
}

let wrongQtiNote = new API(apis)
/**
 * 接口功能 错题本列表获取筛选
 * @param {int} class_id 必须 班级id
 * @param {int} edu_subject_id 非必须 学科id
 * @param {int} type 非必须 类型 0：试题类(默认) 1：组件类
 * @param {int} conquer_rate_flag 非必须 攻克率 1:10%以下 2:10%-20% 3:21%-40% 4:41%-100%
 * @param {int} wrong_rate_flag 非必须 错误率 1:10%以下 2:10%-20% 3:21%-40% 4:41%-100%
 * @param {string} start_time 非必须 起始时间
 * @param {string} end_time 非必须 结束时间
 * @param {int} page 非必须 页码
 * @param {int} per_page 非必须 每页条数 默认5 注：为下拉式分页
 * @returns
 */
wrongQtiNote.getList = params => {
  return wrongQtiNote.fetch(wrongQtiNote.apis.getList, params, 'post')
}

export default wrongQtiNote
