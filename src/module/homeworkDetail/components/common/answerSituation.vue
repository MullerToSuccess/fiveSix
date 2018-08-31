<template>
  <div id="answer-situation">
    <div class="list">
      <div class="list-title">
        <div class="list-row">
          <div class="list-cell left" style="flex:0.6">序号</div>
          <div class="list-cell question-content left">作业内容</div>
          <div class="list-cell">正确率</div>
          <div class="list-cell">用时</div>
        </div>
      </div>
      <div class="list-body">
        <div class="list-row van-hairline--bottom" v-for="(qus,index) in questionInfo" :key="index" @click="linkTo(questionInfo, index)">
          <div class="list-cell left" style="flex:0.6">{{index + 1}}</div>
          <div class="list-cell left question-content ellipsis">
            <span class="type">[{{qus.icom_name | questionName(qus)}}]</span>
            <span v-html="qus.resource_name"></span>
          </div>
          <div class="list-cell">
            <!-- <span v-if="(qus.marked===1 && qus.pigai_status === 3) ||(qus.pigai_status && qus.pigai_status <= 1) || qus.status && qus.status <= 1">--</span> -->
            <span>{{qus.average_rate | percent}}</span></div>
          <div class="list-cell ellipsis">{{qus.average_time_length | timeFormatSecond}}</div>
          <div class="arrow">
            <i class="fa fa-angle-right"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// 答案情况
import {mapGetters, mapMutations} from 'vuex'
import {Toast} from 'vant'
export default {
  name: 'AnswerSituation',
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      'questionInfo': 'homeworkDetail/getHomeworkQuestionInfo'
    })
  },
  methods: {
    ...mapMutations({
      setResource: 'answerDetail/setResource',
      setParams: 'answerDetail/setParams'
    }),
    linkTo(info, index) {
      this.setResource([...info])
      this.setParams({
        type: 3,
        index: index,
        title: '查看统计'
      })
      this.$router.push({
        path: '/pigai'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#answer-situation{
  .list{
    padding: 0 13px;
    font-size: 16px;
    .list-title{
      color: #848484;
    }
    .list-body{
      color: #1e1e1e;
    }
    .list-row{
      display: flex;
      height: 45px;
      line-height: 45px;
    }
    .list-cell{
      flex: 1;
      text-align: center;
      &.question-content{
        flex: 2.5;
        padding: 0 5px;
      }
      &.left{
        text-align: left;
      }
    }
  }
  .type{
    color: #4d4d4d
  }
}
</style>
