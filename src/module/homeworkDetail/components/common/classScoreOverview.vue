<template>
  <div id="class-score-overview">
    <div class="title van-hairline--bottom">全班成绩情况</div>
    <div class="content">
      <div class="score-item">
        <span class="percent">{{this.info.class_average_correct_rate | percent}}</span>
        <span class="name">平均正确率</span>
      </div>
      <div class="score-item">
        <span class="percent">{{hwCompleteRate | percent}}</span>
        <span class="name">作业完成率</span>
      </div>
      <div class="score-item">
        <span class="percent">{{this.info.class_conquer_rate | percent}}</span>
        <span class="name">错题攻克率</span>
      </div>
      <div class="score-item">
        <span class="percent">{{this.info.class_time_length | timeFormatSecond}}</span>
        <span class="name">班平均用时</span>
      </div>
    </div>
  </div>
</template>
<script>
// 全班成绩总览
import {mapState} from 'vuex'
export default {
  name: 'classScoreOverview',
  computed: {
    ...mapState({
      info: state => state.homeworkDetail.homeworkInfo
    }),
    hwCompleteRate() {
      return (this.info.student_counter - this.info.unfinished_counter) / this.info.student_counter
    }
  }
}
</script>
<style lang="scss" scoped>
#class-score-overview{
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  .title{
    height: 45px;
    line-height: 45px;
    color: #1e1e1e;
    padding: 0 13px;
    font-size: 15px;
  }
  .content{
    height: 95px;
    display: flex;
    padding: 0 13px;
    .score-item{
      flex: 1;
      display: inline-flex;
      flex-direction: column;
      .percent{
        color: #fe8d16;
        flex: 1;
        font-size: 20px;
        padding-top: 10px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .name{
        flex: 1;
        color: #c9c9c9;
        font-size: 14px;
        padding-top: 10px;
        text-align: center;
        display: inline-flex;
        align-items: flex-start;
        justify-content: center;
      }
    }
  }
}
</style>
