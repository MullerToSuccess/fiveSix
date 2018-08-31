<template>
  <div id="homework-report">
    <report-tab v-if="showReport" :tab-type="tabType" @tabChange="tabChange"></report-tab>
    <div v-if="showReport" class="wrapper">
      <div class="split-line"></div>
      <div class="content" @scroll="scroll" ref="scroll">
        <!-- 班级成绩 -->
        <class-score v-show="tabType === 1"></class-score>
        <!-- 答案情况 -->
        <answer-situation v-show="tabType === 2"></answer-situation>
        <!-- 知识点分析 -->
        <knowledge-point-analysis v-show="tabType === 3" :publishId="info.course_hour_publish_id"></knowledge-point-analysis>
      </div>
    </div>
    <div class="no-data" v-if="!showReport">
      <div class="no-data-img"></div>
      <span class="no-data-font" style="color:#c8c8c8;">无学生提交作业,暂无报告~</span>
    </div>
  </div>
</template>
<script>
// 作业报告
import reportTab from './common/reportTab'
import classScore from './common/classScore'
import answerSituation from './common/answerSituation'
import knowledgePointAnalysis from './common/KnowledgePointAnalysis'
import {mapState} from 'vuex'
export default {
  name: 'HomeworkReport',
  data() {
    return {
      tabType: 1, // 1:全部成绩;2:答案情况;3:知识点分析
      scrollTop: { // 存储对应tab下的滚动条位置
        1: 0,
        2: 0,
        3: 0
      }
    }
  },
  activated() {
    // 初始化滚动条位置
    if (this.$route.meta.scrollTop) {
      this.$nextTick(() => {
        this.$el.querySelector('.content').scrollTop = this.$route.meta.scrollTop
      })
    }
  },
  beforeRouteEnter: (to, from, next) => {
    // 从上一层级跳转后重置滚动条位置
    if (from.name === 'homework' || from.name === 'home' || from.name === 'homeworkNoticeList') {
      if (to.meta.scrollTop) to.meta.scrollTop = 0
    }
    next()
  },
  computed: {
    ...mapState({
      info: state => state.homeworkDetail.homeworkInfo
    }),
    showReport() {
      if (this.info.has_submit_record !== 1) {
        return false
      } else {
        return true
      }
    },
    imgUrl() {
      return require('@/assets/images/homeworkDetail/no-data.png')
    }
  },
  methods: {
    scroll(e) {
      this.$route.meta['scrollTop'] = this.util.getRect(e.target).scrollTop
    },
    tabChange(type) {
      this.scrollTop[this.tabType] = this.$refs.scroll.scrollTop
      this.tabType = type
      this.$nextTick(() => {
        this.$refs.scroll.scrollTop = this.scrollTop[this.tabType]
      })
    }
  },
  components: {
    reportTab,
    classScore,
    answerSituation,
    knowledgePointAnalysis
  }
}
</script>
<style lang="scss" scoped>
#homework-report{
  height: 100%;
  .wrapper{
    width: 100%;
    height: calc(100% - 45px);
    .content{
      height: calc(100% - 10px);
      overflow-y: scroll;
    }
    .split-line{
      width: 100%;
      height: 10px;
      background: #f5f8f8;
    }
  }
  .no-data{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    padding: 0 26px;
    text-align: center;
    .no-data-img{
      width: 100px;
      height: 130px;
      background: url(../../../assets/images/homeworkDetail/no-data.png) no-repeat 0 0;
      background-size: cover;
    }
    .no-data-font{
      line-height: 26px;
    }
  }
}
</style>
