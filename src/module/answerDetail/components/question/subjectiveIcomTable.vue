<template>
  <div id="subjective-icom-table">
    <div class="title-header van-hairline--bottom">
      <span>{{params.icom_name | questionName(params)}}</span>
      <span>平均用时: {{params.average_time_length || info.average_time_length | timeFormatSecond}}</span>
      <span>正确率:{{params.average_rate !== undefined ? params.average_rate : (params.correct_rate !== undefined ? params.correct_rate : params.class_avg_rate) | percent}}</span>
    </div>
    <div class="table-title van-hairline--bottom">
      <div class="table-cell name" @click="sortList(1)">
        <span>姓名</span>
        <span class="caret">
          <i class="fa fa-caret-up" :class="{active: sortRule.name.up}"></i>
          <i class="fa fa-caret-down" :class="{active: sortRule.name.down}"></i>
        </span>
      </div>
      <div class="table-cell" @click="sortList(2)">
        <span>正确率</span>
        <span class="caret">
          <i class="fa fa-caret-up" :class="{active: sortRule.correctPer.up}"></i>
          <i class="fa fa-caret-down" :class="{active: sortRule.correctPer.down}"></i>
        </span>
      </div>
      <div class="table-cell" @click="sortList(4)">
        <span>用时</span>
        <span class="caret">
          <i class="fa fa-caret-up" :class="{active: sortRule.time.up}"></i>
          <i class="fa fa-caret-down" :class="{active: sortRule.time.down}"></i>
        </span>
      </div>
    </div>
    <div class="table-body">
      <transition-group name="flip-list" tag="ul">
        <li class="table-row van-hairline--bottom" v-if="info.user" v-for="stu in students" :key="stu.userid" @click="linkTo(stu)">
          <div class="table-cell name">
            <div class="stu-name">
              <span>{{stu.real_name}}</span>
            </div>
          </div>
          <div class="table-cell">
            <div class="correct-per">
              <span v-if="stu.status == 3 || stu.status == 1 || stu.status == 4">{{stu.correct_rate | percent}}</span>
              <span v-else>--</span>
            </div>
          </div>
          <div class="table-cell">
            <div class="time-length">
              <span v-if="stu.status == 3 || stu.status == 1 || stu.status == 4">{{stu.time_length | timeFormatSecond}}</span>
              <span v-else>--</span>
            </div>
          </div>
          <div class="arrow">
            <i class="fa fa-angle-right" v-show="stu.status == 3 || stu.status == 1 || stu.status == 4"></i>
          </div>
        </li>
      </transition-group>
    </div>
  </div>
</template>
<script>
import getStatistics from '../../axios/getQuestionStatistics.js'
import {mapMutations} from 'vuex'
export default {
  name: 'SubjectiveIcomTable',
  props: ['params', 'icomId', 'index'],
  data() {
    return {
      'sortRule': {
        name: {
          up: false,
          down: false
        },
        correctPer: {
          up: false,
          down: false
        },
        cuoti: {
          up: false,
          down: false
        },
        time: {
          up: true,
          down: false
        }
      },
      sortParam: 'time_down',
      info: null,
      students: []
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    ...mapMutations({
      setStudentAnswerDetailData: 'answerDetail/setStudentAnswerDetailData'
    }),
    // 获取数据
    getInfo() {
      let param = {
        "publish_id": this.params.course_hour_publish_id,
        "course_resource_id": this.params.course_resource_id,
        'icom_id': this.params.icom_id,
        'dcom_entity_id': this.params.dcom_entity_id,
        'dcom_id': this.params.dcom_id,
        'h': 1,
        'qti_question_id': this.params.source_pk_id,
        'qti_question_sheet': (this.params.resource_type === 'qti_exam_sheet' || this.params.resource_type === 'qti_question_sheet') ? 1 : 0
      }
      getStatistics.getinfo(param).then(succ => {
        this.info = succ
        this.students = succ.user
        this.sortByTime()
      })
    },
    // 转换排序规则
    switchSort(type) {
      if (!this.sortRule[type]['up'] && !this.sortRule[type]['down']) {
        for (let key in this.sortRule) {
          for (let inner in this.sortRule[key]) {
            this.sortRule[key][inner] = false
          }
        }
        this.sortRule[type]['down'] = true
      } else if (this.sortRule[type]['up']) {
        this.sortRule[type]['up'] = false
        this.sortRule[type]['down'] = true
      } else {
        this.sortRule[type]['up'] = true
        this.sortRule[type]['down'] = false
      }
    },
    // 点击排序
    sortList(type) {
      switch (type) {
        case 1:
          this.sortByName()
          break;
        case 2:
          this.sortByCorrect()
          break;
        case 3:
          this.sortByCuoti()
          break;
        case 4:
          this.sortByTime()
          break;
      }
    },
    // 按姓名排序
    sortByName() {
      this.switchSort('name')
      this.sortParam = this.sortRule.name.up ? 'name_up' : 'name_down'
      let result
      if (this.sortParam.split('_')[1] === 'down') {
        result = this.students.sort((a, b) => {
          return b.real_name.localeCompare(a.real_name, 'zh-Hans-CN', {sensitivity: 'accent'})
        })
      } else {
        result = this.students.sort((a, b) => {
          return a.real_name.localeCompare(b.real_name, 'zh-Hans-CN', {sensitivity: 'accent'})
        })
      }
      this.students = result
    },
    // 按错误率排序
    sortByCorrect(first = false) {
      if (!first) {
        this.switchSort('correctPer')
      }
      this.sortParam = this.sortRule.correctPer.up ? 'correct_up' : 'correct_down'
      let result
      if (this.sortParam.split('_')[1] === 'down') {
        result = this.students.filter(item => item.correct_rate > 0).sort((a, b) => {
          return Number(b.correct_rate) - Number(a.correct_rate)
        }).concat(this.students.filter(item => item.correct_rate <= 0))
      } else {
        result = this.students.sort((a, b) => {
          return Number(a.correct_rate) - Number(b.correct_rate)
        })
      }
      this.students = result
    },
    // 按时间排序
    sortByTime() {
      this.switchSort('time')
      this.sortParam = this.sortRule.time.up ? 'time_up' : 'time_down'
      let result
      if (this.sortParam.split('_')[1] === 'down') {
        result = this.students.sort((a, b) => {
          return Number(b.time_length) - Number(a.time_length)
        })
      } else {
        result = this.students.sort((a, b) => {
          return Number(a.time_length) - Number(b.time_length)
        })
      }
      this.students = result
    },
    // 单个学生答案详情
    linkTo(stu) {
      if (!stu.time_length) {
        return false
      }
      this.setStudentAnswerDetailData(this.params)
      this.$router.push({
        name: "checkAnswerDetail",
        params: {
          detailData: this.params,
          studentInfo: stu
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#subjective-icom-table{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}
.title-header{
  padding: 0 13px;
  height: 45px;
  line-height: 45px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
}
.table-title, .table-row{
  display: flex;
  font-size: 14px;
}
.table-title{
  padding: 0 13px;
  height: 45px;
  line-height: 45px;
  text-align: center;
  color: #c7cac9;
}
.table-cell{
  flex: 1;
  &.name{
    flex: 0 0 75px;
  }
}
.caret{
  display: inline-flex;
  flex-direction: column;
  font-size: 10px;
  justify-content: center;
  position: relative;
  top: -3px;
  i{
    height: 6px;
    &.active{
      color: #4e4e4e;
    }
  }
}
.table-body{
  padding: 0 13px;
  height: calc(100% - 45px - 45px);
  overflow-y: scroll;
  .table-row{
    width: 100%;
    color: #1e1e1e;
    display: flex;
    height: 55px;
    line-height: 55px;
    text-align: center;
  }
}
.stu-name{
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 75px;
  span{
    flex: 0 0 75px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.flip-list-move{
  transition: transform .5s;
}
</style>
