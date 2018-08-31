<template>
  <div id="speed-read">
    <!-- 高效阅读统计 -->
    <div class="content" v-if="!loading">
      <!-- 顶部统计 -->
      <div class="percent-wrapper van-hairline--bottom">
        <div class="percent-params">
          <span class="name">正确率</span>
          <span class="percent red">{{speedReadInfo.average_correct | percent}}</span>
        </div>
        <div class="percent-params">
          <span class="name">平均用时</span>
          <span class="percent black">{{params.average_time_length | timeFormatSecond}}</span>
        </div>
      </div>
      <div class="tab-wrapper van-hairline--bottom">
        <span @click="tabChange(1)" :class="{active: tabActive === 1}">阅读效率</span>
        <span @click="tabChange(2)" :class="{active: tabActive === 2}">试题正确率</span>
      </div>
      <div class="list-wrapper">
        <div class="tab1-content" v-show="tabActive === 1">
          <div class="list" v-show="chartType === 1">
            <div class="title van-hairline--bottom ellipsis">
              <span>班平均阅读效率:{{speedReadInfo.average_efficiency}}字/分钟({{averageCount}}人高于平均值)</span>
            </div>
            <div class="table">
              <div class="table-header van-hairline--bottom">
                <div class="table-cell" @click="sortList(1)">
                  <span>姓名</span>
                  <span class="caret">
                    <i class="fa fa-caret-up" :class="{active: sortRule.name.up}"></i>
                    <i class="fa fa-caret-down" :class="{active: sortRule.name.down}"></i>
                  </span>
                </div>
                <div class="table-cell" @click="sortList(2)">
                  <span>用时</span>
                  <span class="caret">
                    <i class="fa fa-caret-up" :class="{active: sortRule.time.up}"></i>
                    <i class="fa fa-caret-down" :class="{active: sortRule.time.down}"></i>
                  </span>
                </div>
                <div class="table-cell" style="flex: 1.5" @click="sortList(3)">
                  <span>阅读速度</span>
                  <span class="caret">
                    <i class="fa fa-caret-up" :class="{active: sortRule.speed.up}"></i>
                    <i class="fa fa-caret-down" :class="{active: sortRule.speed.down}"></i>
                  </span>
                </div>
                <div class="table-cell" style="flex: 1.5" @click="sortList(4)">
                  <span>正确率</span>
                  <span class="caret">
                    <i class="fa fa-caret-up" :class="{active: sortRule.correct.up}"></i>
                    <i class="fa fa-caret-down" :class="{active: sortRule.correct.down}"></i>
                  </span>
                </div>
                <div class="table-cell" style="flex: 1.5" @click="sortList(5)">
                  <span>阅读效率</span>
                  <span class="caret">
                    <i class="fa fa-caret-up" :class="{active: sortRule.efficiency.up}"></i>
                    <i class="fa fa-caret-down" :class="{active: sortRule.efficiency.down}"></i>
                  </span>
                </div>
                <div class="table-cell" @click="sortList(6)">
                  <span>等级</span>
                  <span class="caret">
                    <i class="fa fa-caret-up" :class="{active: sortRule.grade.up}"></i>
                    <i class="fa fa-caret-down" :class="{active: sortRule.grade.down}"></i>
                  </span>
                </div>
              </div>
              <div class="table-body">
                <transition-group name="flip-list">
                  <div class="table-row van-hairline--bottom" v-for="item in speedReadInfo.user" :key="item.userid" @click="linkToAnswer(item)">
                    <div class="table-cell ellipsis">{{item.real_name}}</div>
                    <div class="table-cell ellipsis">{{item.time}}</div>
                    <div class="table-cell ellipsis" style="flex: 1.5">{{item.speed}}</div>
                    <div class="table-cell correct ellipsis" style="flex: 1.5">
                      <span>{{item.average_correct_rate | percent}}</span>
                      <div class="progress">
                        <van-progress :percentage="item.average_correct_rate * 100" :show-pivot = 'showPovit' :color="item.average_correct_rate >= 0.6 ? '#34c988' : '#f56956'"/>
                      </div>
                    </div>
                    <div class="table-cell ellipsis" style="flex: 1.5">{{item.efficiency}}</div>
                    <div class="table-cell ellipsis">
                      <span v-if="item.grade>0">{{item.grade | changeChinese}}级</span>
                      <!-- <span v-else></span> -->
                    </div>
                  </div>
                </transition-group>
              </div>
            </div>
          </div>
          <div class="chart" v-show="chartType === 2">
            <div class="column" v-for="(item, index) in speedReadInfo.clumn" :key="index" @click="showStudentList(index, item.user)">
              <span class="ellipsis">{{index}}</span>
              <div>
                <span class="col" :style="{width: item.user.length / speedReadInfo.user.length * 100 * 0.75 + '%'}" @click="showStudent(index, item)"></span>
                <span class="counter">
                  <span style="color:#1e1e1e">{{item.user.length}}</span>
                  <span style="color:#7e8183">人</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="tab2-content" v-if="tabActive === 2">
          <div class="table">
            <div class="table-header van-hairline--bottom">
              <div class="table-cell">题型</div>
              <div class="table-cell">正确率</div>
            </div>
            <div class="table-body">
              <div class="table-row van-hairline--bottom" v-for="(item, index) in qtiInfo" :key="index" @click="linkToQti(index, qtiInfo)">
                <div class="table-cell ellipsis">{{item | questionName(item)}}</div>
                <div class="table-cell correct ti">
                  <span>{{item.correct_rate | percent}}</span>
                  <div class="progress">
                    <van-progress :percentage="item.correct_rate * 100" :show-pivot='showPovit' :color="item.correct_rate >= 0.6 ? '#34c988' : '#f56956'"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="icon" v-show="!loading && tabActive === 1" @click="chartType === 1 ? chartType = 2 : chartType = 1">
      <img :src="iconUrl" alt="">
      <span>{{iconFont}}</span>
    </div>
    <div v-if="loading" class="loading">
      <i class="fa fa-spinner fa-spin"></i>
      <span>加载中...</span>
    </div>
  </div>
</template>
<script>
import api from '@/module/answerDetail/axios/getQuestionStatistics'
import { mapMutations } from 'vuex';
export default {
  name: 'SpeedRead',
  props: ['params'],
  data() {
    return {
      loading: true,
      tabActive: 1,
      speedReadInfo: null,
      showPovit: false,
      averageCount: 0, // 高于平均值人数
      'sortRule': {
        name: {
          up: false,
          down: false
        },
        time: {
          up: false,
          down: false
        },
        speed: {
          up: false,
          down: false
        },
        correct: {
          up: false,
          down: true
        },
        efficiency: {
          up: false,
          down: false
        },
        grade: {
          up: false,
          down: false
        }
      },
      sortParam: 'correct_down',
      chartType: 1,
      qtiInfo: null,
      users: null
    }
  },
  computed: {
    iconUrl() {
      let imgUrl
      if (this.chartType === 1) {
        imgUrl = require('@/assets/images/tongji/chart.png')
      } else {
        imgUrl = require('@/assets/images/tongji/list.png')
      }
      return imgUrl
    },
    iconFont() {
      if (this.chartType === 1) {
        return '统计'
      } else {
        return '列表'
      }
    }
  },
  filters: {
    changeChinese(val) {
      if (val === 1) {
        return '一'
      } else if (val === 2) {
        return '二'
      } else if (val === 3) {
        return '三'
      } else if (val === 4) {
        return '四'
      } else if (val === 5) {
        return '五'
      } else if (val === 6) {
        return '六'
      }
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    ...mapMutations({
      setTongjiParams: 'answerDetail/setTongjiParams',
      setTongjiResource: 'answerDetail/setTongjiResource'
    }),
    linkToAnswer(userInfo) {
      console.log(userInfo)
      this.setTongjiParams({
        index: 0,
        title: `${userInfo.real_name}的作业`,
        type: 2,
        userId: userInfo.userid
      })
      this.setTongjiResource([...this.qtiInfo])
      this.$router.push({
        path: '/tongji'
      })
    },
    // 获取高效阅读统计数据
    getInfo() {
      this.loading = true
      let param = {
        "publish_id": this.params.course_hour_publish_id,
        "course_resource_id": this.params.course_resource_id,
        'dcom_entity_id': this.params.dcom_entity_id,
        'h': this.$store.state.homework.homeworkState === '0' ? 1 : 0,
        'qti_question_sheet': (this.params.resource_type === 'qti_exam_sheet' || this.params.resource_type === 'qti_question_sheet') ? 1 : 0
      }
      api.speedRead(param).then(succ => {
        this.speedReadInfo = succ
        this.speedReadInfo.user.forEach(ele => {
          if (ele.efficiency > this.speedReadInfo.average_efficiency) {
            this.averageCount++
          }
          if (ele.efficiency) {
            if (ele.efficiency > 300 && ele.efficiency <= 500) {
              ele['grade'] = 1
            } else if (ele.efficiency > 500 && ele.efficiency <= 600) {
              ele['grade'] = 2
            } else if (ele.efficiency > 600 && ele.efficiency <= 800) {
              ele['grade'] = 3
            } else if (ele.efficiency > 800 && ele.efficiency <= 1000) {
              ele['grade'] = 4
            } else if (ele.efficiency < 1000 && ele.efficiency <= 1200) {
              ele['grade'] = 5
            } else if (ele.efficiency > 1200) {
              ele['grade'] = 6
            } else {
              ele['grade'] = 0
            }
          }
        })
      }).then(() => {
        api.getinfo({
          'publish_id': this.params.course_hour_publish_id,
          'course_resource_id': this.params.course_resource_id,
          'dcom_entity_id': this.params.dcom_entity_id,
          'icom_id': this.params.icom_id,
          'h': this.$store.state.homework.homeworkState === '0' ? 1 : 0,
          'qti_question_sheet': (this.params.resource_type === 'qti_exam_sheet' || this.params.resource_type === 'qti_question_sheet') ? 1 : 0
        }).then(succ => {
          this.qtiInfo = succ.resource
          this.users = succ.user
          this.loading = false
        })
      }).then(() => {
        // 初始化排序
        this.sortByCorrect(true)
      })
    },
    // tab切换
    tabChange(type) {
      this.tabActive = type
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
          this.sortByTime()
          break;
        case 3:
          this.sortBySpeed()
          break;
        case 4:
          this.sortByCorrect()
          break;
        case 5:
          this.sortByEfficiency()
          break;
        case 6:
          this.sortByGrade()
      }
    },
    sortByName() {
      this.switchSort('name')
      this.sortParam = this.sortRule.name.up ? 'name_up' : 'name_down'
      let result
      if (this.sortParam.split('_')[1] === 'down') {
        result = this.speedReadInfo.user.sort((a, b) => {
          return b.real_name.localeCompare(a.real_name, 'zh-Hans-CN', {sensitivity: 'accent'})
        })
      } else {
        result = this.speedReadInfo.user.sort((a, b) => {
          return a.real_name.localeCompare(b.real_name, 'zh-Hans-CN', {sensitivity: 'accent'})
        })
      }
      this.speedReadInfo.user = result
    },
    sortByCorrect(first = false) {
      if (!first) {
        this.switchSort('correct')
      }
      this.sortParam = this.sortRule.correct.up ? 'correct_up' : 'correct_down'
      let result
      if (this.sortParam.split('_')[1] === 'down') {
        result = this.speedReadInfo.user.sort((a, b) => {
          return Number(b.average_correct_rate) - Number(a.average_correct_rate)
        })
      } else {
        result = this.speedReadInfo.user.sort((a, b) => {
          return Number(a.average_correct_rate) - Number(b.average_correct_rate)
        })
      }
      this.students = result
    },
    sortByTime() {
      this.switchSort('time')
      this.sortParam = this.sortRule.time.up ? 'time_up' : 'time_down'
      let result
      if (this.sortParam.split('_')[1] === 'down') {
        result = this.speedReadInfo.user.sort((a, b) => {
          return Number(b.time.slice(0, -1)) - Number(a.time.slice(0, -1))
        })
      } else {
        result = this.speedReadInfo.user.sort((a, b) => {
          return Number(a.time.slice(0, -1)) - Number(b.time.slice(0, -1))
        })
      }
      this.students = result
    },
    sortBySpeed() {
      this.switchSort('speed')
      this.sortParam = this.sortRule.speed.up ? 'speed_up' : 'speed_down'
      let result
      if (this.sortParam.split('_')[1] === 'down') {
        result = this.speedReadInfo.user.sort((a, b) => {
          return Number(b.speed) - Number(a.speed)
        })
      } else {
        result = this.speedReadInfo.user.sort((a, b) => {
          return Number(a.speed) - Number(b.speed)
        })
      }
      this.students = result
    },
    sortByEfficiency() {
      this.switchSort('efficiency')
      this.sortParam = this.sortRule.efficiency.up ? 'efficiency_up' : 'efficiency_down'
      let result
      if (this.sortParam.split('_')[1] === 'down') {
        result = this.speedReadInfo.user.sort((a, b) => {
          return Number(b.efficiency) - Number(a.efficiency)
        })
      } else {
        result = this.speedReadInfo.user.sort((a, b) => {
          return Number(a.efficiency) - Number(b.efficiency)
        })
      }
      this.students = result
    },
    sortByGrade() {
      this.switchSort('grade')
      this.sortParam = this.sortRule.grade.up ? 'grade_up' : 'grade_down'
      let result
      if (this.sortParam.split('_')[1] === 'down') {
        result = this.speedReadInfo.user.sort((a, b) => {
          return Number(b.grade) - Number(a.grade)
        })
      } else {
        result = this.speedReadInfo.user.sort((a, b) => {
          return Number(a.grade) - Number(b.grade)
        })
      }
      this.students = result
    },
    showStudent(index, item) {
      if (item.user.length) {
        window.bus.$emit('showStudentList', `阅读效率每分钟${index}的学生`, item.user)
      }
    },
    linkToQti(index, info) {
      this.setTongjiParams({
        index: index,
        title: '试卷详情',
        type: 1
      })
      this.setTongjiResource([...info])
      this.$router.push({
        path: '/tongji'
      })
    },
    showStudentList(title, user) {
      if (!user.length) {
        return false
      }
      this.$list(`阅读效率${title}/分钟的学生`, user, (item) => {
        return false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#speed-read{
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-size: 16px;
  position: relative;
  .loading{
    text-align: center;
    padding-top: 20px;
  }
  .content{
    width: 100%;
    height: 100%;
    .percent-wrapper{
      width: 100%;
      height: 80px;
      overflow: hidden;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      font-size: 15px;
      .percent-params{
        flex: 1;
        display: inline-flex;
        flex-direction: column;
        text-align: center;
        .name{
          height: 24px;
          line-height: 24px;
          color: #7f8284;
        }
        .percent{
          height: 24px;
          line-height: 24px;
          &.red{
            color: #fc5363;
          }
          &.black{
            color: #1e1e1e;
          }
        }
      }
    }
    .tab-wrapper{
      width: 100%;
      height: 45px;
      line-height: 45px;
      background-color: #f5f8f8;
      display: flex;
      justify-content: space-around;
      color: #4f4f50;
      span{
        text-align: center;
        &.active{
          color: #08b884;
          border-bottom: 2px solid #08b884;
        }
      }
    }
    .list-wrapper{
      width: 100%;
      height: calc(100% - 80px - 45px);
      overflow-y: scroll;
      .tab1-content{
        width: 100%;
        height: 100%;
        position: relative;
        .title{
          height: 40px;
          line-height: 40px;
          padding: 0 13px;
          color: #4f4f50;
        }
        // 图表样式
        .column{
          display: flex;
          padding: 0px 13px;
          height: 20px;
          margin: 30px 0;
          font-size: 15px;
          span{
            flex: 0 1 25%;
          }
          div{
            flex: 0 1 75%;
            .col{
              display: inline-block;
              min-width: 1px;
              height: 100%;
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
      }
    }
  }
  .table{
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
    .table-header{
      height: 40px;
      line-height: 40px;
      display: flex;
      padding: 0 13px;
      font-size: 12px;
      justify-content: space-between;
      color: #c7cac9;
      .table-cell{
        flex: 1;
        text-align: center;
      }
    }
    .table-body{
      font-size: 12px;
      .table-row{
        display: flex;
        box-sizing: border-box;
        width: 100%;
        height: 60px;
        line-height: 60px;
        padding: 0 13px;
        justify-content: space-between;
        .table-cell{
          flex: 1;
          text-align: center;
          &.correct{
            display: inline-flex;
            flex-direction: column;
            justify-content: center;
            span{
              height: 30px;
              line-height: 30px;
            }
          }
          &.ti{
            align-items: center;
            .progress{
              width: 50%
            }
          }
        }
      }
    }
  }
  .icon{
    position: absolute;
    width: 55px;
    height: 55px;
    bottom: 20px;
    right: 13px;
    background-color: #3ac69e;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 2px 2px rgba(0, 0, 0, .2);
    img{
      width: 24px;
      height: 19px;
    }
    span{
      padding-top: 5px;
      color: #fff;
      font-size: 10px;
    }
  }
}
.flip-list-move{
  transition: transform .3s
}
</style>
