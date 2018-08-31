<template>
  <!-- 按学生统计 -->
  <div id="according-student">
    <div class="content" v-show="chartType === 1">
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
        <div v-show="type === 'combineqti'" class="table-cell" @click="sortList(3)">
          <span>得分</span>
          <span class="caret">
            <i class="fa fa-caret-up" :class="{active: sortRule.cuoti.up}"></i>
            <i class="fa fa-caret-down" :class="{active: sortRule.cuoti.down}"></i>
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
        <transition-group name="flip-list">
          <div class="table-row van-hairline--bottom" v-if="info.user" v-for="stu in students" :key="stu.userid" @click="linkTo(stu)">
            <div class="table-cell name">
              <div class="stu-name">
                <span>{{stu.real_name}}</span>
              </div>
            </div>
            <div class="table-cell">
              <div class="correct-per">
                <span v-if="stu.status == 3 || stu.status == 4 || stu.status == 1">{{stu.correct_rate | percent}}</span>
                <!-- <span v-else-if="stu.status == 1">未批改</span> -->
                <span v-else-if="stu.status == 0">未提交</span>
              </div>
            </div>
            <div class="table-cell" v-show="type === 'combineqti'">
              <div class="cuoti">
                <span v-if="stu.status == 3 || stu.status == 1 || stu.status == 4">{{stu.score / 100 | percent | replace}}</span>
                <span v-if="stu.status == 0">--</span>
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
          </div>
        </transition-group>
      </div>
    </div>
    <div class="content" v-show="chartType === 2">
      <div class="column" v-for="(item, index) in columnInfo" :key="index">
        <span>{{index}}</span>
        <div>
          <span class="col" @click="showStudent(index, item)" :class="{red: index == '0%-59%'}" :style="{width: columnInfo[index].counter / sum * 100 * 0.75 + '%'}"></span>
          <span class="counter">
            <span style="color:#1e1e1e">{{item.counter}}</span>
            <span style="color:#7e8183">人</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AccordingStudent',
  props: ['info', 'type', 'chartType'],
  data() {
    return {
      'sortRule': {
        name: {
          up: false,
          down: false
        },
        correctPer: {
          up: false,
          down: true
        },
        cuoti: {
          up: false,
          down: false
        },
        time: {
          up: false,
          down: false
        }
      },
      sortParam: 'correct_down',
      sum: 0, // 总人数
      students: this.info.user
    }
  },
  computed: {
    columnInfo() {
      let result = {}
      for (let key in this.info.clumn) {
        let item = this.info.clumn[key]
        if (!item.counter) item.counter = 0
        if (!item.user) item.user = []
        /* eslint-disable */
        if (item.counter) this.sum += item.counter
        result[key] = item
      }
      return result
    }
  },
  mounted() {
    this.sortByCorrect(true)
  },
  filters: {
    replace(data) {
      return data.replace('%', '')
    }
  },
  methods: {
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
    sortByName() {
      this.switchSort('name')
      this.sortParam = this.sortRule.name.up ? 'name_up' : 'name_down'
      let result
      if (this.sortParam.split('_')[1] === 'down') {
        result = this.students.filter(item => item.status !== 0).sort((a, b) => {
          return b.real_name.localeCompare(a.real_name, 'zh-Hans-CN', {sensitivity: 'accent'})
        }).concat(this.students.filter(item => item.status === 0))
      } else {
        result = this.students.filter(item => item.status !== 0).sort((a, b) => {
          return a.real_name.localeCompare(b.real_name, 'zh-Hans-CN', {sensitivity: 'accent'})
        }).concat(this.students.filter(item => item.status === 0))
      }
      this.students = result
    },
    sortByCorrect(first = false) {
      if (!first) {
        this.switchSort('correctPer')
      }
      this.sortParam = this.sortRule.correctPer.up ? 'correct_up' : 'correct_down'
      let result
      if (this.sortParam.split('_')[1] === 'down') {
        result = this.students.filter(item => item.status !== 0).sort((a, b) => {
          return Number(b.correct_rate) - Number(a.correct_rate)
        }).concat(this.students.filter(item => item.status === 0))
      } else {
        result = this.students.filter(item => item.status !== 0).sort((a, b) => {
          return Number(a.correct_rate) - Number(b.correct_rate)
        }).concat(this.students.filter(item => item.status === 0))
      }
      this.students = result
    },
    sortByCuoti() {
      this.switchSort('cuoti')
      this.sortParam = this.sortRule.cuoti.up ? 'cuoti_up' : 'cuoti_down'
      let result
      if (this.sortParam.split('_')[1] === 'down') {
        result = this.students.filter(item => item.status !== 0).sort((a, b) => {
          return Number(b.score) - Number(a.score)
        }).concat(this.students.filter(item => item.status === 0))
      } else {
        result = this.students.filter(item => item.status !== 0).sort((a, b) => {
          return Number(a.score) - Number(b.score)
        }).concat(this.students.filter(item => item.status === 0))
      }
      this.students = result
    },
    sortByTime() {
      this.switchSort('time')
      this.sortParam = this.sortRule.time.up ? 'time_up' : 'time_down'
      let result
      if (this.sortParam.split('_')[1] === 'down') {
        result = this.students.filter(item => item.status !== 0).sort((a, b) => {
          return Number(b.time_length) - Number(a.time_length)
        }).concat(this.students.filter(item => item.status === 0))
      } else {
        result = this.students.filter(item => item.status !== 0).sort((a, b) => {
          return Number(a.time_length) - Number(b.time_length)
        }).concat(this.students.filter(item => item.status === 0))
      }
      this.students = result
    },
    linkTo(stu) {
      if (stu.status === 0) {
        return false
      } else {
        this.$emit('linkToStudentAnswer', stu)
      }
    },
    // 显示学生列表
    showStudent(key, info) {
      if (info.counter) {
        let titleName = key + '的学生'
        let list = info
        this.$emit('showStudentList', titleName, list)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .content{
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
    // 图表样式
    .column{
      display: flex;
      padding: 0px 13px;
      height: 20px;
      margin: 40px 0;
      font-size: 15px;
      span{
        flex: 0 1 25%;
      }
      div{
        flex: 0 1 75%;
        .col{
          display: inline-block;
          min-width: 1px;
          height: 20px;
          background-color: #12d198;
          &.red{
            background-color: #ff5366;
          } 
        }
        .counter{
          display: inline-block;
          height: 100%;
          min-width: 20%;
          vertical-align: top;
          padding-left: 3px;
        }
      }
    }
    .flip-list-move{
      transition: transform .3s
    }
  }
</style>
