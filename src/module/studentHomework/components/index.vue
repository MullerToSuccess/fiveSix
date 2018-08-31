<template>
  <div id="student-homework" class="page">
    <header-bar @back="$router.back(-1)">
      <div slot="title-name">
        {{user_name}}的作业
      </div>
    </header-bar>
    <div class="content" v-if="!loading">
      <div class="homeworkInfo">
        <div class="name-count">
          <span class="name ellipsis">{{studentHomeworkInfo.title}}</span>
          <span class="count">
            共<span style="color:#7e8181">{{studentHomeworkInfo.course_resource_count}}</span>个
          </span>
        </div>
        <div class="dead-time">
          <span v-if="$store.state.homework.homeworkState === '0'">
            截止时间:{{studentHomeworkInfo.deadline}}{{timeOver}}
          </span>
          <span v-else>上课时间:{{studentHomeworkInfo.deadline}}</span>
        </div>
      </div>
      <div class="chart-area">
        <div class="complete-rate" ref="complete"></div>
        <div class="correct-rate" ref="correct"></div>
      </div>
      <div class="homework-list" @scroll="scroll">
        <div class="list-item van-hairline--bottom" v-for="(item, index) in studentHomeworkInfo.course_resource_list" :key="index" @click="linkTo(item, index)">
          <div class="left">
            <div class="resource-name ellipsis"><span></span>[{{item.resource_name | questionName(item)}}]{{item.resource_name}}</div>
            <div class="correct-rate">正确率<span style="color:#1e1e1e;padding-left:5px">{{item.correct_rate | percent}}</span></div>
          </div>
          <div class="right">
            <span class="tag-btn finish" v-if="item.is_finish === 1">已完成</span>
            <span class="tag-btn unfinish" v-else>未完成</span>
          </div>
        </div>
      </div>
    </div>
    <div class="loading" v-else>
      <i class="fa fa-spinner fa-spin"></i>
      <span>加载中...</span>
    </div>
  </div>
</template>
<script>
import api from '../api'
import headerBar from '@/components/headerBar'
import {mapState, mapMutations, mapActions} from 'vuex'
import { Toast } from 'vant'
export default {
  name: 'studentHomework',
  props: ['publish_id', 'user_id', 'user_name'],
  data() {
    return {
      loading: true,
      studentHomeworkInfo: null,
      studentCorrectRate: null, // 正确率
      completeChart: null,
      correctChart: null,
      fontSize: 12
    }
  },
  computed: {
    // 判断截止时间
    timeOver() {
      if (this.studentHomeworkInfo) {
        if (new Date(this.studentHomeworkInfo.deadline).getTime() - new Date().getTime() > 0) {
          return ``
        } else {
          return `(已截止)`
        }
      }
    },
    // 完成率计算
    finishPercent() {
      let val = (this.studentHomeworkInfo.course_resource_finish_count / this.studentHomeworkInfo.course_resource_count * 100)
      return this.formatCorrect(val)
    },
    // 正确率计算
    correctPercent() {
      let val = this.studentCorrectRate * 100
      return this.formatCorrect(val)
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'homeworkDetail') {
        this.restore = true
        this.completeChart = null
        this.correctChart = null
        setTimeout(() => { this.removeAlive(from.name) }, 300)
        window.bus.$off('modifyStu')
      } else if (to.name === 'pigai') {
      }
    }
  },
  created() {
    window.bus.$on('modifyStu', () => {
      this.getResource(true)
    })
  },
  mounted() {
    setTimeout(this.getResource, 300)
  },
  activated() {
    if (this.$route.meta.scrollTop) {
      this.$el.querySelector('.homework-list').scrollTop = this.$route.meta.scrollTop
    }
    if (this.correctChart) {
      this.renderChart()
    }
  },
  methods: {
    ...mapMutations({
      setAnswerParams: 'answerDetail/setParams',
      setAnswerResource: 'answerDetail/setResource'
    }),
    ...mapActions({
      removeAlive: 'alivePages/removeAlive'
    }),
    // 正确率计算
    formatCorrect(val) {
      if (val === '' || val <= -1) {
        return '--'
      } else if (val === 1) {
        return '100%'
      } else {
        let num = val % 1 === 0 ? val : val.toFixed(1)
        return val === 0 ? '0%' : num + '%'
      }
    },
    // 取作业列表
    getResource(loading) {
      if (!loading) this.loading = true
      api.studentHomeworkInfo({
        user_id: this.user_id,
        publish_id: this.publish_id,
        view_mode: 1,
        show_tag: 1
      }).then(succ => {
        if (!loading) this.loading = false
        this.studentHomeworkInfo = succ
        this.studentCorrectRate = succ.correct_rate
        this.studentHomeworkInfo['completeRate'] = this.computedCompleteRate()
        if (!loading) this.correctChart = null
        this.computedSize()
        this.renderChart()
      }).catch(() => {
      })
    },
    // 计算完成率
    computedCompleteRate() {
      let resourceList = this.studentHomeworkInfo.course_resource_list
      let finished = []
      let unfinished = []
      resourceList.filter(ele => {
        if (ele.is_finish === 1) {
          finished.push(ele)
        } else {
          unfinished.push(ele)
        }
      })
      return (finished.length / resourceList.length * 100).toFixed(1)
    },
    // 渲染环形图
    renderChart() {
      this.$nextTick(() => {
        if (!this.completeChart && !this.correctChart) {
          this.completeChart = this.$echarts.init(this.$el.querySelector('.complete-rate'))
          this.correctChart = this.$echarts.init(this.$el.querySelector('.correct-rate'))
        }
        let option = {
          title: {
            text: this.correctPercent,
            subtext: '正确率',
            x: 'center',
            top: '40%',
            textStyle: {
              color: '#1e1e1e',
              fontSize: this.fontSize
            },
            subtextStyle: {
              color: '#c8c8c8',
              fontSize: this.fontSize
            }
          },
          series: [
            {
              name: '',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              silent: true,
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                {
                  value: (this.studentCorrectRate * 100).toFixed(1),
                  itemStyle: {
                    color: '#66b6fe'
                  }
                },
                {
                  value: (100 - (this.studentCorrectRate * 100)).toFixed(1),
                  itemStyle: {
                    color: '#e8edee'
                  }
                }
              ]
            }
          ]
        }
        this.correctChart.setOption(option, true)
        this.completeChart.setOption({
          title: {
            text: this.formatCorrect(Number(this.studentHomeworkInfo.completeRate)),
            subtext: '完成进度',
            x: 'center',
            top: '40%',
            textStyle: {
              color: '#1e1e1e',
              fontSize: this.fontSize
            },
            subtextStyle: {
              color: '#c8c8c8',
              fontSize: this.fontSize
            }
          },
          series: [
            {
              name: '',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              silent: true,
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                {
                  value: this.studentHomeworkInfo.completeRate,
                  itemStyle: {
                    color: '#11d097'
                  }
                },
                {
                  value: 100 - this.studentHomeworkInfo.completeRate,
                  itemStyle: {
                    color: '#e8edee'
                  }
                }
              ]
            }
          ]
        })
        window.onresize = () => {
          this.correctChart.resize()
          this.completeChart.resize()
        }
      })
    },
    // 计算图文字的动态大小
    computedSize() {
      let rect = this.util.getRect(document.getElementById('student-homework'))
      this.fontSize = 12 * (rect.width / 375)
    },
    // 跳转
    linkTo(item, index) {
      if (item.is_finish === 1) {
        let type = this.util.judgeQuestionType(item)
        console.log(11111, type)
        if (type) {
          this.setAnswerParams({
            index: 0,
            title: `${this.$route.params.user_name}的作业`,
            type: 2,
            user_id: this.$route.params.user_id
          })
          if (type === 'combineqti') {
            // 套题
            let toast = Toast.loading({
              duration: 0,
              forbidClick: true,
              loadingType: 'circular',
              message: '加载中'
            })
            api.getMiniResource({
              publish_id: item.course_hour_publish_id,
              course_resource_id: item.course_resource_id,
              dcom_entity_id: item.dcom_entity_id
            }).then(succ => {
              toast.clear()
              this.setAnswerResource(succ)
              this.$router.push({path: '/pigai'})
            })
          } else {
            // 单题
            this.setAnswerResource([item])
            this.$router.push({
              path: '/pigai'
            })
          }
        } else {
          Toast.fail('暂不支持该类型组件查看');
        }
      }
    // }
    },
    // 滚动检测，记录滚动位置
    scroll(e) {
      let targetRect = this.util.getRect(e.target)
      this.$route.meta.scrollTop = targetRect.scrollTop
    }
  },
  beforeRouteEnter: (to, from, next) => {
    if (from.name === 'homeworkDetail') {
      if (to.meta.scrollTop) to.meta.scrollTop = 0
    }
    next()
  },
  components: {
    headerBar
  }
}
</script>
<style lang="scss" scoped>
#student-homework{
  font-size: 16px;
  height: 100%;
  .content{
    height: calc(100% - 45px);
    .homeworkInfo{
      box-sizing: border-box;
      height: 75px;
      padding: 10px 13px;
      .name-count{
        display: flex;
        justify-content: space-between;
        height: 20px;
        line-height: 20px;
        .name{
          flex: 6;
          font-weight: 600;
          color: #1e1e1e;
        }
        .count{
          flex: 1;
          text-align: right;
          color: #c8c8c8;
        }
      }
      .dead-time{
        height: 20px;
        line-height: 20px;
        padding-top: 10px;
        color: #c8c8c8;
      }
    }
    .chart-area{
      height: 180px;
      box-sizing: border-box;
      padding: 0 13px;
      background-color: #f5f8f8;
      display: flex;
      .complete-rate{
        width: 50%;
        height: 100%;
      }
      .correct-rate{
        width: 50%;
        height: 100%;
      }
    }
    .homework-list{
      height: calc(100% - 180px - 75px);
      overflow-y: scroll;
      box-sizing: border-box;
      padding: 0 13px;
      .list-item{
        height: 75px;
        padding: 10px 0;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        .left{
          flex: 0 0 250px;
          .resource-name{
            color: #1e1e1e;
            height: 30px;
            line-height: 30px;
            width: 250px;
          }
          .correct-rate{
            color: #7f8284;
            height: 30px;
            line-height: 30px;
            width: 250px;
          }
        }
        .right{
          flex: 0 0 auto;
          height: 55px;
          line-height: 55px;
          span.tag-btn{
            padding: 10px 15px;
            border-radius: 5px;
            &.finish{
               background-color: #08b884;
               color: #fff;
            }
            &.unfinish{
              background-color: #fff;
              color: #7e8183;
            }
          }
        }
      }
    }
  }
  .loading{
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #999;
  }
}
</style>
