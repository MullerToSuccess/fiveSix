<template>
  <div id="tongji" class="page">
    <header-bar @back="$router.back(-1)">
      <div slot="title-name">
        <span>{{params.title}}</span>
        <span v-if="util.judgeQuestionType(resource[currentIndex]) !== 'objectiveicom'">({{currentIndex + 1}}/{{qtiCount}})</span>
      </div>
      <div slot="right-area" v-if="resource.length && resource[currentIndex] && Object.keys(resource[currentIndex]).length && ((resource[currentIndex].icom_id == 4629 && resource[currentIndex].alias != 'oraltest') || resource[currentIndex].icom_id == 5019 || resource[currentIndex].icom_id == 4693)">
        <span @click="linkToOriginal">原题</span>
      </div>
    </header-bar>
    <div class="content">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-if="params.type == 1" v-for="(item, index) in renderResource" :key="index">
            <!-- 答案柱状图 判断，单选，多选，不定项选择，排序 -->
            <answer-column @showStudentList="goToStuAnswer" :params="item" type="qti" v-if="item.qti_question_type_id && (item.qti_question_type_id == 1 || item.qti_question_type_id == 2 || item.qti_question_type_id == 3 || item.qti_question_type_id == 6 || item.qti_question_type_id == 15)"></answer-column>
            <!-- 投票 -->
            <answer-column @showStudentList="goToStuAnswer" :params="item" type="qti" v-if="(item.status || item.pigai_status) && item.icom_id == 4693"></answer-column>
            <!-- 选项表格图 完形填空 -->
            <choice-table @showStudentList="goToStuAnswer" :params="item" v-if="item.qti_question_type_id && item.qti_question_type_id == 11"></choice-table>
            <!-- 正确率柱状图 连线题、连词成句、加法竖式、减法竖式、乘法竖式、除法竖式、脱式计算 -->
            <correct-column @showStudentList="goToStuAnswer" :params="item" v-if="item.qti_question_type_id && (item.qti_question_type_id == 9 || item.qti_question_type_id == 21 || item.qti_question_type_id == 23 || item.qti_question_type_id == 24 || item.qti_question_type_id == 25 || item.qti_question_type_id == 26 || item.qti_question_type_id == 33 || item.qti_question_type_id == 39)"></correct-column>
            <!-- 正确率表格 客观填空、选词填空、图表填空 -->
            <correct-table @showStudentList="goToStuAnswer" :params="item" v-if="item.qti_question_type_id && (item.qti_question_type_id == 4 || item.qti_question_type_id == 20 || item.qti_question_type_id == 38 || item.qti_question_type_id == 40)"></correct-table>
            <!-- <Subjective :params="item" v-if="item.qti_question_type_id == 5 || item.qti_question_type_id == 7"></Subjective> -->
            <!-- 答案表格 成功营救、字母书写、听力 -->
            <hanzitingxie :params="item" :type="params.type" v-if="item.icom_id == 508 || item.qti_question_type_id == 17"></hanzitingxie>
            <!-- 答案表格 小熊射手组词(数学) 4629(口语训练)、5009(汉字听写)、5021(文章阅读)、5011(口算训练)、5020（英语听写）、507(单词汉堡)、4643(宝瓶收妖(语音识词))、4630(单词速记)、5001(字母书写)、5000(闻英起舞)、504(老鹰捉小鸡)、84(群英争霸(句子版))、5015(斗地鼠)、4642(宝瓶收妖(听音辩词))、4424(虎口拔牙)、4423(吃火锅)、503(群英争霸) -->
            <group-detail :params="item" :type="params.type" :icomId="item.icom_id" v-if="item.icom_id == 5013 || item.icom_id == 5018 || item.icom_id == 5011 || item.icom_id == 420 || (item.icom_id == 4629 && item.alias == 'oraltest') || item.icom_id == 5009 || item.icom_id == 5021 || item.icom_id == 5020 || item.icom_id == 507 || item.icom_id == 4643 || item.icom_id == 4630 || item.icom_id == 5001 || item.icom_id == 5000 || item.icom_id == 504 || item.icom_id == 84 || item.icom_id == 5015 || item.icom_id == 4642 || item.icom_id == 4424 || item.icom_id == 4423 || item.icom_id == 503"></group-detail>
            <!-- 主观题批改 -->
            <subjective-icom-table :params="item" :index="index" :icomId="item.icom_id" v-if="util.judgeQuestionType(item) === 'subjectiveqti' && item.qti_question_type_id != 39 && item.qti_question_type_id != 33 && item.qti_question_type_id != 40"></subjective-icom-table>
          </div>
          <div class="swiper-slide" v-if="params.type == 2" v-for="(item, index) in renderResource" :key="index">
            <!-- 主观题批改 4692(互动题板)、5029(图形切割) -->
            <!-- <subjective-icom-table :params="item" :index="index" :icomId="item.icom_id" v-if="util.judgeQuestionType(item) === 'subjectiveqti' && item.qti_question_type_id != 39 && item.qti_question_type_id != 33"></subjective-icom-table> -->
            <!-- <subjective-icom :params="item" :index="index" :icomId="item.icom_id" v-if="item.icom_id == 4692 || item.icom_id == 4427 || item.icom_id == 5029"></subjective-icom> -->
            <!-- 答案表格 小熊射手组词(数学) 4629(口语训练)、5009(汉字听写)、5021(文章阅读)、5011(口算训练)、5020（英语听写）、507(单词汉堡)、508(成功营救)、4643(宝瓶收妖(语音识词))、4630(单词速记)、5001(字母书写)、5000(闻英起舞)、504(老鹰捉小鸡)、84(群英争霸(句子版))、5015(斗地鼠)、4642(宝瓶收妖(听音辩词))、4424(虎口拔牙)、4423(吃火锅)、503(群英争霸) -->
            <group-detail :params="item" :type="params.type" :icomId="item.icom_id" :userId="params.userId ? params.userId : ''" v-if="item.icom_id == 5013 || item.icom_id == 5018 || item.icom_id == 5011 || item.icom_id == 420 || (item.icom_id == 4629 && item.alias == 'oraltest') || item.icom_id == 5009 || item.icom_id == 5021 || item.icom_id == 5020 || item.icom_id == 507 || item.icom_id == 508 || item.icom_id == 4643 || item.icom_id == 4630 || item.icom_id == 5001 || item.icom_id == 5000 || item.icom_id == 504 || item.icom_id == 84 || item.icom_id == 5015 || item.icom_id == 4642 || item.icom_id == 4424 || item.icom_id == 4423 || item.icom_id == 503"></group-detail>
            <render-qti v-if="item && Object.keys(item).length && ((item.icom_id == 4629 && item.alias != 'oraltest') || item.icom_id == 5019 || item.icom_id == 4693)" :info="item" :qtiData="item.qti_data ? item.qti_data : ''" :user_id="params.userId && params.userId" :num="currentIndex + 1"></render-qti>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import headerBar from '@/components/headerBar'
import answerColumn from './question/answerColumn.vue'
import choiceTable from './question/choiceTable.vue'
import correctColumn from './question/correctColumn.vue'
import correctTable from './question/correctTable.vue'
import hanzitingxie from './question/hanzitingxie.vue'
import groupDetail from './question/groupDetail.vue'
import subjectiveIcom from './question/subjectiveIcom.vue'
import subjectiveIcomTable from './question/subjectiveIcomTable.vue'
import renderQti from '@/components/renderQti'
import {mapState, mapMutations, mapActions} from 'vuex'
export default {
  name: 'tongji',
  data() {
    return {
      meSwiper: null, // swiper 实例
      renderResource: [], // 渲染swiper的数据
      qtiCount: 0, // 总数
      currentIndex: 0 // 当前的index
    }
  },
  activated() {
    this.render()
  },
  deactivated() {
    if (this.$route.name === 'pigai' || this.$route.name === 'knowledgePointDetail') {
      this.renderResource = []
      this.qtiCount = null
      this.currentIndex = null
      this.meSwiper.destroy()
      this.meSwiper = null
      setTimeout(() => {
        this.removeAlive('tongji')
      }, 300)
    }
  },
  computed: {
    ...mapState({
      'params': state => state.answerDetail.tongjiParams,
      'resource': state => state.answerDetail.tongjiResource
    })
  },
  methods: {
    ...mapMutations({
      clearTongjiResource: 'answerDetail/clearTongjiResource',
      clearTongjiParams: 'answerDetail/clearTongjiParams'
    }),
    ...mapActions({
      removeAlive: 'alivePages/removeAlive'
    }),
    // 拼装数据，组装swiper
    render() {
      if (this.meSwiper) {
        return false
      }
      let resource = this.resource
      for (let i = 0; i < resource.length; i++) {
        this.renderResource.push({})
      }
      this.qtiCount = this.renderResource.length
      this.currentIndex = this.params.index
      this.renderResource[this.params.index] = this.resource[this.params.index]
      this.meSwiper = new this.Swiper('#tongji .swiper-container', {
        init: false,
        observer: true, // 修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, // 修改swiper的父元素时，自动初始化swiper
        on: {
          slideChange: () => {
            this.slideEnd()
          }
        }
      })
      this.meSwiper.touchEvents = {
        end: 'touchend',
        move: 'touchmove',
        start: 'touchstart'
      }
      this.meSwiper.init()
      this.meSwiper.slideTo(this.params.index, 0)
    },
    // 活动完成后的回调
    slideEnd() {
      this.renderResource[this.meSwiper.activeIndex] = this.resource[this.meSwiper.activeIndex]
      this.currentIndex = this.meSwiper.activeIndex
      if (this.meSwiper.swipeDirection === 'prev') {
        this.$el.querySelectorAll('.swiper-slide')[this.meSwiper.activeIndex + 1].scrollTop = 0 + 'px'
      } else if (this.meSwiper.swipeDirection === 'next') {
        this.$el.querySelectorAll('.swiper-slide')[this.meSwiper.activeIndex - 1].scrollTop = 0 + 'px'
      }
    },
    // 查看学生作答记录
    goToStuAnswer(title, info) {
      if (!this.meSwiper) {
        return false
      }
      this.$list(title, info, (item) => {
        this.$listClose()
        let questionInfo = this.renderResource[this.meSwiper.activeIndex]
        questionInfo.resource_name = ''
        this.$router.push({
          path: `/originalQuestion`,
          query: {
            user_id: item.userid,
            question_info: JSON.stringify(questionInfo),
            title: item.real_name
          }
        })
      })
    },
    // 查看原题
    linkToOriginal() {
      let questionInfo = this.resource[this.meSwiper.activeIndex]
      questionInfo.resource_name = ''
      this.$router.push({
        path: `/originalQuestion`,
        query: {
          user_id: 0,
          question_info: JSON.stringify(questionInfo),
          title: '原题'
        }
      })
    }
  },
  components: {
    headerBar,
    answerColumn,
    choiceTable,
    correctColumn,
    correctTable,
    hanzitingxie,
    groupDetail,
    subjectiveIcom,
    subjectiveIcomTable,
    renderQti
  }
}
</script>
<style lang="scss" scoped>
#tongji{
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}
.content{
  height: calc(100% - 45px);
  .swiper-container{
    width: 100%;
    height: 100%;
    // overflow-y:scroll;
    .swiper-slide{
      overflow-y: scroll;
    }
  }
}
</style>
