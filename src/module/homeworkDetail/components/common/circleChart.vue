<template>
  <div id="circle-chart">
    <div class="title van-hairline--bottom">
      <span>学生作业成绩分布</span>
      <i class="icon-help" @click="popup"></i>
    </div>
    <div class="chart-content" v-if="pigaiSum">
      <div id="chart"></div>
      <div class="legend one">
        <div class="label"></div>
        <div class="des">
          <span>待提升</span>
          <span>({{this.info['待提升'].num}}人)</span>
        </div>
        <div class="per">{{this.info['待提升'].num / pigaiSum | percent}}</div>
      </div>
      <div class="legend two">
        <div class="label"></div>
        <div class="des">
          <span>及格</span>
          <span>({{this.info['及格'].num}}人)</span>
        </div>
        <div class="per">{{this.info['及格'].num / pigaiSum | percent}}</div>
      </div>
      <div class="legend three">
        <div class="des">
          <span>({{this.info['优秀'].num}}人)</span>
          <span>优秀</span>
        </div>
        <div class="label"></div>
        <div class="per">{{this.info['优秀'].num / pigaiSum | percent}}</div>
      </div>
      <div class="legend four">
        <div class="des">
          <span>({{this.info['良好'].num}}人)</span>
          <span>良好</span>
        </div>
        <div class="label"></div>
        <div class="per">{{this.info['良好'].num / pigaiSum | percent}}</div>
      </div>
    </div>
    <div class="chart-content no-data" v-else>
      <div class="no-data-img"></div>
      <span style="color:#c8c8c8;line-height:26px">作业未批改,暂无数据~</span>
    </div>
    <van-popup v-model="show" style="border-radius: 5%">
      <div id="dialog">
        <div class="title van-hairline--bottom">作业成绩等级说明</div>
        <div class="content van-hairline--bottom">
          <div class="row-title">
            <div class="cell">等级</div>
            <div class="cell">正确率区间</div>
          </div>
          <div class="row-body">
            <div class="cell">
              <div class="color-1">
                <span class="circle"></span>
                <span>优秀</span>
              </div>
              <div>[85%,100%]</div>
            </div>
            <div class="cell">
              <div class="color-2">
                <span class="circle"></span>
                <span>良好</span>
              </div>
              <div>[70%,85%)</div>
            </div>
            <div class="cell">
              <div class="color-3">
                <span class="circle"></span>
                <span>及格</span>
              </div>
              <div>[60%,70%)</div>
            </div>
            <div class="cell">
              <div class="color-4">
                <span class="circle"></span>
                <span>待提升</span>
              </div>
              <div>[0%,60%)</div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="btn" @click="show = false">知道了~</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
// 全班成绩中的环形图组件
import {mapGetters} from 'vuex'
import { Popup } from 'vant'
export default {
  name: 'CircleChart',
  data() {
    return {
      chart: null,
      fontSize: 16,
      show: false
    }
  },
  mounted() {
    if (this.pigaiSum) {
      this.$nextTick(() => {
        this.computedSize()
        this.chart = this.$echarts.init(document.getElementById('chart'))
        this.chart.setOption({
          title: {
            text: `${this.pigaiSum}人`,
            subtext: '批改人数',
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
              name: '学生作业成绩分布',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                {
                  value: this.info['优秀'].num,
                  info: this.info['优秀'].studentList,
                  title: '优秀',
                  itemStyle: {
                    color: '#27d29e'
                  }
                },
                {
                  value: this.info['良好'].num,
                  info: this.info['良好'].studentList,
                  title: '良好',
                  itemStyle: {
                    color: '#55a3fe'
                  }
                },
                {
                  value: this.info['及格'].num,
                  info: this.info['及格'].studentList,
                  title: '及格',
                  itemStyle: {
                    color: '#9673fe'
                  }
                },
                {
                  value: this.info['待提升'].num,
                  info: this.info['待提升'].studentList,
                  title: '待提升',
                  itemStyle: {
                    color: '#ffa743'
                  }
                }
              ]
            }
          ]
        })
        this.chart.on('click', (e) => {
          let studentList = e.data.info
          let title = e.data.title
          this.$list(title, studentList, (item) => {
            this.$listClose()
            this.$router.push({
              name: 'studentHomework',
              params: {
                publish_id: this.$route.params.publishId,
                user_id: item.userid,
                user_name: item.real_name
              }
            })
          })
        })
      })
      window.onresize = () => {
        this.chart.resize()
      }
    }
  },
  computed: {
    ...mapGetters({
      info: 'homeworkDetail/getCorrectInfo'
    }),
    pigaiSum() {
      let sum = 0
      for (let key in this.info) {
        sum += this.info[key].num
      }
      return sum
    },
    imgUrl() {
      return require('@/assets/images/homeworkDetail/no-data.png')
    }
  },
  methods: {
    popup() {
      this.show = true
    },
    // 计算图文字的动态大小
    computedSize() {
      let rect = this.util.getRect(document.getElementById('homework-content'))
      this.fontSize = this.fontSize * (rect.width / 375)
    }
  }
}
</script>
<style lang="scss" scoped>
#circle-chart{
  width: 100%;
  height: 295px;
  box-sizing: border-box;
  overflow: hidden;
  font-size: 16px;
  .title{
    height: 45px;
    line-height: 45px;
    color: #1e1e1e;
    padding: 0 13px;
    font-size: 15px;
    .icon-help{
      display: inline-block;
      width: 20px;
      height: 20px;
      margin-left: 10px;
      background: url(../../../../assets/images/public/help-h.png) no-repeat 0 0;
      background-size: cover;
      vertical-align: middle;
    }
  }
  .chart-content{
    width: 100%;
    height: 250px;
    position: relative;
    .legend{
      position: absolute;
      font-size: 16px;
      .des{
        color: #c8c8c8;
        display: inline-block;
        vertical-align: middle;
      }
      .label{
        width: 16px;
        height: 16px;
        display: inline-block;
        border-radius: 50px;
        vertical-align: middle;
      }
      .per{
        text-align: center;
        margin-top: 10px;
        color: #1e1e1e;
      }
      &.one{
        top: 21px;
        left: 13px;
        .label{
          background-color: #ffa743;
          margin-right: 5px;
        }
      }
      &.two{
        bottom: 21px;
        left: 13px;
        .label{
          background-color: #9673fe;
          margin-right: 5px;
        }
      }
      &.three{
        top: 21px;
        right: 13px;
        .label{
          background-color: #27d29e;
          margin-left: 5px;
        }
      }
      &.four{
        bottom: 21px;
        right: 13px;
        .label{
          background-color: #55a3fe;
          margin-left: 5px;
        }
      }
    }
    #chart{
      width: 100%;
      height: 100%;
    }
    &.no-data{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      padding: 0 26px;
      box-sizing: border-box;
      text-align: center;
      .no-data-img{
        width: 100px;
        height: 130px;
        background: url(../../../../assets/images/homeworkDetail/no-data.png) no-repeat 0 0;
      background-size: cover;
      }
    }
  }
  #dialog{
    width: 80vw;
    box-sizing: border-box;
    padding: 0 13px;
    .title{
      height: 45px;
      line-height: 45px;
      text-align: center;
      color: #1e1e1e;
      font-size: 18px;
      font-weight: 600;
    }
    .row-title{
      display: flex;
      justify-content: space-between;
      text-align: center;
      height: 50px;
      line-height: 50px;
      .cell{
        flex: 1;
        color: #a8a8a8;
      }
    }
    .row-body{
      .cell{
        display: flex;
        justify-content: space-between;
        height: 45px;
        line-height: 45px;
        div{
          flex: 1;
          text-align: center;
        }
        .color-1{
          .circle{
            display: inline-block;
            vertical-align: sub;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: #27d29e
          }
        }
        .color-4{
          .circle{
            display: inline-block;
            vertical-align: sub;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: #ffa743
          }
        }
        .color-2{
          .circle{
            display: inline-block;
            vertical-align: sub;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: #55a3fe
          }
        }
        .color-3{
          .circle{
            display: inline-block;
            vertical-align: sub;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: #9673fe;
          }
        }
      }
    }
    .dialog-footer{
      height: 50px;
      width: 100%;
      line-height: 50px;
      margin: 10px 0;
      text-align: center;
      .btn{
        display: inline-block;
        height: 40px;
        line-height: 40px;
        width: 80%;
        border-radius: 8px;
        color: #fff;
        background: linear-gradient(to right, #08b783, #12cf97);
      }
    }
  }
}
</style>
