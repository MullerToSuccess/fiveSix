<template>
<div id="question-detail" class="page">
  <!-- 顶部 -->
  <!-- type === 1 时以批改状态进入-->
  <header class="header van-hairline--bottom" v-if="params.type === 1">
    <div class="back-btn" @click="$router.back(-1)">
      <i class="icon-back"></i>
    </div>
    <div class="title-name" v-if="!noData && resource[currentIndex] && resource[currentIndex]['yx_father']">
      <span class="name ellipsis" v-if="util.judgeQuestionType(resource[currentIndex]['yx_father']) == 'combineqti'">
        <span>
          {{resource[currentIndex] | questionName(resource[currentIndex].yx_father)}}
        </span>
      </span>
      <span class="step" v-if="resource[currentIndex] && resource[currentIndex].yx_count">({{resource[currentIndex].yx_index + 1}}/{{resource[currentIndex].yx_count}})</span>
    </div>
    <div class="title-name" v-else>
      <span>{{resource[currentIndex] | questionName(resource[currentIndex])}}</span>
    </div>
    <div class="right-area">
      <span @click="next" style="color:#08b884">下一题</span>
    </div>
  </header>
  <!-- type === 2 查看学生的学习记录，qti带原题按钮，icom组件不带原题 -->
  <header-bar v-if="params.type === 2" @back="$router.back(-1)">
    <div slot="title-name">
      <span>{{params.title}}</span>
    </div>
    <div class="right-area" slot="right-area" v-if="params.userId">
      <span style="color:#08b884" @click="linkTo" v-if="resource.length && Object.keys(resource[currentIndex]).length && ((resource[currentIndex].icom_id == 4629 && resource[currentIndex].alias != 'oraltest') || resource[currentIndex].icom_id == 5019 || resource[currentIndex].icom_id == 4693)">原题</span>
    </div>
  </header-bar>
  <!-- type === 3 答案情况进入单题带原题按钮，套题，组件不带原题按钮 -->
  <header-bar v-if="params.type === 3" @back="$router.back(-1)">
    <div slot="title-name">
      <span>查看统计</span>
      <span>({{currentIndex + 1}}/{{resource.length}})</span>
    </div>
    <div slot="right-area" @click="linkTo" v-if="util.judgeQuestionType(resource[currentIndex]) === 'objectiveqti' && resource[currentIndex].alias !== 'oraltest'">
      <span>原题</span>
    </div>
  </header-bar>
  <!-- 内容区域 -->
  <div class="swiper-container" :class="{scroll: (util.judgeQuestionType(resource[currentIndex]) === 'subjectiveqti' && resource[currentIndex].qti_question_type_id !== '39' && resource[currentIndex].qti_question_type_id !== '33') && params.type !==3}">
    <div class="swiper-wrapper">
      <!-- type === 1 批改 -->
      <div v-if="params.type === 1" class="swiper-slide" v-for="(item, index) in renderResource" :key="index">
        <!-- {{item}} -->
        <!-- 答案柱状图 判断，单选，多选，不定项选择，排序 -->
        <answer-column @showStudentList="goToStuAnswer" :params="item" type="qti" v-if="(item.status || item.pigai_status) && item.qti_question_type_id && (item.qti_question_type_id == 1 || item.qti_question_type_id == 2 || item.qti_question_type_id == 3 || item.qti_question_type_id == 6 || item.qti_question_type_id == 15)"></answer-column>
        <!-- 投票 -->
        <answer-column @showStudentList="goToStuAnswer" :params="item" type="qti" v-if="(item.status || item.pigai_status) && (item.icom_id == 4693)"></answer-column>
        <screen-shot-answer :params="item" v-if="item.icom_id == 5005"></screen-shot-answer>
        <!-- 选项表格图 完形填空 -->
        <choice-table @showStudentList="goToStuAnswer" :params="item" v-if="(item.status || item.pigai_status) && item.qti_question_type_id && item.qti_question_type_id == 11"></choice-table>
        <!-- 正确率柱状图 连线题、连词成句、加法竖式、减法竖式、乘法竖式、除法竖式、脱式计算 -->
        <correct-column @showStudentList="goToStuAnswer" :params="item" v-if="(item.status || item.pigai_status) && item.qti_question_type_id && (item.qti_question_type_id == 9 || item.qti_question_type_id == 21 || item.qti_question_type_id == 23 || item.qti_question_type_id == 24 || item.qti_question_type_id == 25 || item.qti_question_type_id == 26 || item.qti_question_type_id == 33 || item.qti_question_type_id == 39)"></correct-column>
        <!-- 正确率表格 客观填空、选词填空、图表填空 -->
        <correct-table @showStudentList="goToStuAnswer" :params="item" v-if="(item.status || item.pigai_status) && item.qti_question_type_id && (item.qti_question_type_id == 4 || item.qti_question_type_id == 20 || item.qti_question_type_id == 38 || item.qti_question_type_id == 40)"></correct-table>
        <!-- 答案表格 听力 -->
        <hanzitingxie :params="item" :type="params.type" v-if="item.qti_question_type_id == 17"></hanzitingxie>
        <!-- 答案表格 小熊射手组词(数学) 4629(口语训练)、5009(汉字听写)、5021(文章阅读)、5011(口算训练)、5020（英语听写）、507(单词汉堡)、4643(宝瓶收妖(语音识词))、4630(单词速记)、5001(字母书写)、5000(闻英起舞)、504(老鹰捉小鸡)、84(群英争霸(句子版))、5015(斗地鼠)、4642(宝瓶收妖(听音辩词))、4424(虎口拔牙)、4423(吃火锅)、503(群英争霸) -->
        <group-detail :params="item" :type="params.type" :icomId="item.icom_id" v-if="item.icom_id == 508 || item.icom_id == 5013 || item.icom_id == 5018 || item.icom_id == 5011 || item.icom_id == 420 || (item.icom_id == 4629 && item.alias == 'oraltest') || item.icom_id == 5009 || item.icom_id == 5021 || item.icom_id == 5020 || item.icom_id == 507 || item.icom_id == 4643 || item.icom_id == 4630 || item.icom_id == 5001 || item.icom_id == 5000 || item.icom_id == 504 || item.icom_id == 84 || item.icom_id == 5015 || item.icom_id == 4642 || item.icom_id == 4424 || item.icom_id == 4423 || item.icom_id == 503 || item.icom_id == 5007"></group-detail>
        <!-- 主观题批改 4692(互动题板)、5029(图形切割) -->
        <subjective-icom :params="item" :index="index" :icomId="item.icom_id" v-if="item.icom_id == 4692 || item.icom_id == 4427 || item.icom_id == 5029"></subjective-icom>
        <!-- 微课 5007 -->
        <!-- <weike :params="item" :icomId="item.icom_id" v-if="item.icom_id == 5007"></weike> -->
        <render-qti  v-if="Object.keys(item).length && ((item.icom_id == 4629 && item.alias != 'oraltest') || item.icom_id == 5019 || item.icom_id == 4693) && !loading" :info="item" :qtiData="item.qti_data ? item.qti_data : ''"></render-qti>
        <!-- 不支持的组件 -->
        <div class="no-data" v-if="noData">
          <span class="no-data-img"></span>
          <span>不支持该类型组件</span>
        </div>
      </div>
      <!-- type === 2 单个学生学习记录-->
      <div v-if="params.type === 2" class="swiper-slide" v-for="(item, index) in renderResource" :key="index">
        <answer-column @showStudentList="goToStuAnswer" :params="item" type="qti" v-if="(item.status || item.pigai_status) && (item.icom_id == 4693)"></answer-column>
        <!-- 主观题批改 4692(互动题板)、5029(图形切割) -->
        <screen-shot-answer :params="item" v-if="item.icom_id == 5005"></screen-shot-answer>
        <subjective-icom :params="item" :index="index" :icomId="item.icom_id" v-if="item.icom_id == 4692 || item.icom_id == 4427 || item.icom_id == 5029"></subjective-icom>
        <!-- 答案表格 小熊射手组词(数学) 4629(口语训练)、5009(汉字听写)、5021(文章阅读)、5011(口算训练)、5020（英语听写）、507(单词汉堡)、508(成功营救)、4643(宝瓶收妖(语音识词))、4630(单词速记)、5001(字母书写)、5000(闻英起舞)、504(老鹰捉小鸡)、84(群英争霸(句子版))、5015(斗地鼠)、4642(宝瓶收妖(听音辩词))、4424(虎口拔牙)、4423(吃火锅)、503(群英争霸) -->
        <group-detail :params="item" :type="params.type" :icomId="item.icom_id" :userId="params.user_id ? params.user_id : ''" v-if="item.icom_id == 5013 || item.icom_id == 5018 || item.icom_id == 5011 || item.icom_id == 420 || (item.icom_id == 4629 && item.alias == 'oraltest') || item.icom_id == 5009 || item.icom_id == 5021 || item.icom_id == 5020 || item.icom_id == 507 || item.icom_id == 508 || item.icom_id == 4643 || item.icom_id == 4630 || item.icom_id == 5001 || item.icom_id == 5000 || item.icom_id == 504 || item.icom_id == 84 || item.icom_id == 5015 || item.icom_id == 4642 || item.icom_id == 4424 || item.icom_id == 4423 || item.icom_id == 503 || item.icom_id == 5007"></group-detail>
        <render-qti v-if="Object.keys(item).length && ((item.icom_id == 4629 && item.alias != 'oraltest') || item.icom_id == 5019 || item.icom_id == 4693) && !loading" :info="item" :qtiData="item.qti_data ? item.qti_data : ''" :user_id="params.user_id && params.user_id" :num="currentIndex + 1"></render-qti>
      </div>
      <!-- type ===3 只看答案和统计图，从答案情况进入 -->
      <div v-if="params.type === 3" class="swiper-slide" v-for="(item, index) in renderResource" :key="index">
        <!-- 客观单题 -->
        <template v-if="util.judgeQuestionType(item) === 'objectiveqti'">
          <!-- 答案柱状图 判断，单选，多选，不定项选择，排序 -->
          <answer-column @showStudentList="goToStuAnswer" :params="item" type="qti" v-if="(item.status || item.pigai_status) && item.qti_question_type_id && (item.qti_question_type_id == 1 || item.qti_question_type_id == 2 || item.qti_question_type_id == 3 || item.qti_question_type_id == 6 || item.qti_question_type_id == 15)"></answer-column>
          <!-- 投票 -->
          <answer-column @showStudentList="goToStuAnswer" :params="item" type="qti" v-if="(item.status || item.pigai_status) && item.icom_id == 4693"></answer-column>
          <!-- 选项表格图 完形填空 -->
          <choice-table @showStudentList="goToStuAnswer" :params="item" v-if="(item.status || item.pigai_status) && item.qti_question_type_id && item.qti_question_type_id == 11"></choice-table>
          <!-- 正确率柱状图 连线题、连词成句、加法竖式、减法竖式、乘法竖式、除法竖式、脱式计算 -->
          <correct-column @showStudentList="goToStuAnswer" :params="item" v-if="(item.status || item.pigai_status) && item.qti_question_type_id && (item.qti_question_type_id == 9 || item.qti_question_type_id == 21 || item.qti_question_type_id == 23 || item.qti_question_type_id == 24 || item.qti_question_type_id == 25 || item.qti_question_type_id == 26 || item.qti_question_type_id == 33 || item.qti_question_type_id == 39)"></correct-column>
          <!-- 正确率表格 客观填空、选词填空、图表填空 -->
          <correct-table @showStudentList="goToStuAnswer" :params="item" v-if="(item.status || item.pigai_status) && item.qti_question_type_id && (item.qti_question_type_id == 4 || item.qti_question_type_id == 20 || item.qti_question_type_id == 38 || item.qti_question_type_id == 40)"></correct-table>
          <taoti :params="item" v-if="item.qti_question_type_id == 36"></taoti>
        </template>
        <!-- 套题、试卷和组件 -->
        <template v-else-if="util.judgeQuestionType(item) === 'combineqti' || util.judgeQuestionType(item) === 'objectiveicom'">
          <!-- 投票 -->
          <div v-if="item.icom_id == 4693">
            <answer-column @showStudentList="goToStuAnswer" :params="item" type="qti"></answer-column>
            <render-qti v-if="Object.keys(item).length && ((item.icom_id == 4629 && item.alias != 'oraltest') || item.icom_id == 5019 || item.icom_id == 4693) && !loading" :info="item" :qtiData="item.qti_data ? item.qti_data : ''" :user_id="params.user_id && params.user_id"></render-qti>
          </div>
          <!-- 高效阅读 -->
          <speed-read :params="item" v-else-if="item.qti_question_type_id == 35"></speed-read>
          <!-- 截图发送 -->
          <screen-shot-answer :params="item" v-else-if="item.icom_id == 5005"></screen-shot-answer>
          <!-- 微课5007,文章阅读5021 -->
          <group-detail v-else-if="item.icom_id == 5007 || item.icom_id == 5021" :icomId="item.icom_id" :params="item" type="2"></group-detail>
          <!-- 套题试卷和组件有按题按人的tab -->
          <taoti v-else :params="item"></taoti>
        </template>
        <!-- 主观题 -->
        <template v-else-if="util.judgeQuestionType(item) === 'subjectiveqti' && item.qti_question_type_id != 39 && item.qti_question_type_id != 33">
          <!-- 主观题批改 4692(互动题板)、4427(图形计算器)、5029(图形切割) -->
          <subjective-icom-table :params="item" :index="index" :icomId="item.icom_id"></subjective-icom-table>
        </template>
        <template v-else>
          <div class="no-data" v-if="noData">
            <span class="no-data-img"></span>
            <span>不支持该类型组件</span>
          </div>
        </template>
      </div>
    </div>
  </div>
  <!-- 主观题操作栏 -->
  <div class="subjective-button van-hairline--top" v-if="(util.judgeQuestionType(resource[currentIndex]) === 'subjectiveqti' && resource[currentIndex].qti_question_type_id != '39' && resource[currentIndex].qti_question_type_id != '33') && params.type != 3">
    <span @click="subjectiveQtiPigai(resource[currentIndex])" v-if="(resource[currentIndex].status && (resource[currentIndex].status == 3 || resource[currentIndex].status == 4)) || (resource[currentIndex].pigai_status && (resource[currentIndex].pigai_status == 3 || resource[currentIndex].pigai_status == 4))">查看详情</span>
    <span v-if="(resource[currentIndex].status && resource[currentIndex].status == 1) || (resource[currentIndex].pigai_status && resource[currentIndex].pigai_status == 1)" @click="toggleCorrectPopup" >一键批改</span>
    <span v-if="(resource[currentIndex].status && resource[currentIndex].status == 1) || (resource[currentIndex].pigai_status && resource[currentIndex].pigai_status == 1)" @click="subjectiveQtiPigai(resource[currentIndex])" >批改本题</span>
    <span style="background-color: #666" v-if="(resource[currentIndex].status != undefined && resource[currentIndex].status == 0) || (resource[currentIndex].pigai_status != undefined && resource[currentIndex].pigai_status == 0)">未提交</span>
  </div>
  <!-- 一键批改组件 -->
  <correct-item
    v-if="itemCorrectPopup"
    :publishId="resource[currentIndex].course_hour_publish_id"
    :resourceId="resource[currentIndex].course_resource_id"
    :questionId="resource[currentIndex].qti_question_id || resource[currentIndex].source_pk_id"
    :entityId="resource[currentIndex].dcom_entity_id"
    :hideMutual="hideMutual"
    @toggle="toggleCorrectPopup"
    @callback="correctCallback">
  </correct-item>
</div>
</template>

<script>
import Vue from 'vue'
import {mapState, mapMutations, mapActions} from 'vuex'
import {Toast} from 'vant'
import headerBar from '@/components/headerBar.vue'
import answerColumn from './question/answerColumn.vue'
import choiceTable from './question/choiceTable.vue'
import correctColumn from './question/correctColumn.vue'
import correctTable from './question/correctTable.vue'
import groupDetail from './question/groupDetail.vue'
import subjectiveIcom from './question/subjectiveIcom.vue'
import groupDetailColumn from './question/groupDetailColumn.vue'
import hanzitingxie from './question/hanzitingxie.vue'
import subjectiveIcomTable from './question/subjectiveIcomTable'
import speedRead from './question/speedRead'
import taoti from './exam/taoti.vue'
import renderQti from '@/components/renderQti.vue'
import correctItem from '@/components/common/itemCorrectPopup.vue'
import screenShotAnswer from './question/screenShotAnswer.vue'
import api from '@/module/homeworkDetail/axios/detail'
export default {
  name: 'pigai',
  data () {
    return {
      renderResource: [], // 渲染所需的资源数据
      qtiCount: 0, // 试题总数
      mySwiper: null, // 滑动组件实例
      itemCorrectPopup: false, // 是否显示一键批阅
      loading: false, // 加载中，避免qti渲染出错
      noData: false,
      hideMutual: false
    }
  },
  created() {
    window.bus.$on('nextSubject', () => {
      setTimeout(() => {
        if (this.currentIndex === this.resource.length - 1) {
          Toast('已经是最后一题了')
        } else {
          this.mySwiper.slideTo(this.currentIndex + 1, 0)
        }
      }, 100)
    })
  },
  activated() {
    this.renderView() // 渲染答题列表
    window.bus.$on('modifyScore', (id) => {
      console.log('id=', id)
      if (Number(this.resource[this.currentIndex].status) === 4 || Number(this.resource[this.currentIndex].pigai_status) === 4) {
        return false
      }
      if (Number(this.resource[this.currentIndex].status) === 3 || Number(this.resource[this.currentIndex].pigai_status) === 3) {
        return false
      }
      this.resource[this.currentIndex].status ? this.resource[this.currentIndex].status = id : this.resource[this.currentIndex].pigai_status = id
    })
  },
  // 组件向上返回时，页面数据清空
  deactivated() {
    let routeName = this.$route.name
    if (routeName === 'homeworkDetail' || routeName === 'studentHomework' || routeName === 'knowledgePointDetail') {
      this.renderResource = []
      this.mySwiper.destroy()
      this.mySwiper = null
      setTimeout(() => {
        this.removeAlive('pigai')
      }, 300)
    }
  },
  destroyed() {
    window.bus.$off(['nextSubject', 'hanzitingxie'])
  },
  computed: {
    ...mapState({
      'resource': state => state.answerDetail.resource,
      'params': state => state.answerDetail.params
    }),
    currentIndex: {
      get() {
        return this.params.index
      },
      set(val) {
        this.setParamsIndex(val)
      }
    }
  },
  methods: {
    ...mapMutations({
      clearResource: 'answerDetail/clearResource',
      clearParams: 'answerDetail/clearParams',
      setParamsIndex: 'answerDetail/setParamsIndex',
      setStudentAnswerDetailData: 'answerDetail/setStudentAnswerDetailData',
      modifyResource: 'answerDetail/modifyResource'
    }),
    ...mapActions({
      removeAlive: 'alivePages/removeAlive'
    }),
    // 根据资源创建所需数据结构和swiper视图
    renderView() {
      if (this.mySwiper) {
        return false
      }
      let resource = this.resource
      for (let i = 0; i < resource.length; i++) {
        this.renderResource.push({})
      }
      this.qtiCount = this.renderResource.length
      this.currentIndex = this.params.index
      this.renderResource[this.params.index] = this.resource[this.params.index]
      this.$nextTick(() => {
        this.mySwiper = new this.Swiper('#question-detail .swiper-container', {
          init: false,
          observer: true, // 修改swiper自己或子元素时，自动初始化swiper
          observeParents: true, // 修改swiper的父元素时，自动初始化swiper
          on: {
            slideChange: () => {
              this.slideEnd()
            }
          }
        })
        this.mySwiper.touchEvents = {
          end: 'touchend',
          move: 'touchmove',
          start: 'touchstart'
        }
        this.mySwiper.init()
        if (this.params.index === 0) {
          this.slideEnd()
        } else {
          this.mySwiper.slideTo(this.params.index, 0)
        }
      })
    },
    // 下一题按钮
    next() {
      if (this.currentIndex === this.resource.length - 1) {
        Toast('已经是最后一题了')
      } else {
        this.mySwiper.slideTo(this.currentIndex + 1, 300)
      }
    },
    // 查看原题
    linkTo() {
      let questionInfo = this.renderResource[this.mySwiper.activeIndex]
      questionInfo.resource_name = ''
      this.$router.push({
        path: `/originalQuestion`,
        query: {
          user_id: 0,
          question_info: JSON.stringify(questionInfo),
          title: '原题'
        }
      })
    },
    // 滑动完成的回调
    slideEnd() {
      this.$mp3playerpause()
      let type = this.util.judgeQuestionType(this.resource[this.mySwiper.activeIndex])
      console.log(11111, type)
      if (this.params.type !== 3) { // 从答案详情进入时不需要展开小资源
        if (type) {
          // 滑动过程中遇到套题或试卷的处理
          this.noData = false
          if (type === 'combineqti') {
            this.loading = true
            Toast.loading({
              mask: true,
              message: '加载中...'
            });
            let param = {
              publish_id: this.resource[this.mySwiper.activeIndex].course_hour_publish_id,
              course_resource_id: this.resource[this.mySwiper.activeIndex].course_resource_id,
              dcom_entity_id: this.resource[this.mySwiper.activeIndex].dcom_entity_id
            }
            api.getMiniResource(param).then(succ => {
              Toast.clear()
              let a = []
              succ.forEach((ele, index) => {
                a.push({})
                ele['yx_index'] = index
                ele['yx_count'] = succ.length
                ele['yx_father'] = this.resource[this.mySwiper.activeIndex]
                ele['yx_qti_question_type_id'] = this.resource[this.mySwiper.activeIndex].qti_question_type_id ? this.resource[this.mySwiper.activeIndex].qti_question_type_id : ''
                ele['yx_resource_name'] = this.resource[this.mySwiper.activeIndex].resource_name ? this.resource[this.mySwiper.activeIndex].resource_name : ''
              });
              this.modifyResource({
                currentIndex: this.mySwiper.activeIndex,
                newResource: succ
              })
              this.renderResource.splice(this.mySwiper.activeIndex, 1, ...a)
              Vue.set(this.renderResource, this.mySwiper.activeIndex, this.resource[this.mySwiper.activeIndex])
              this.loading = false
            })
          }
        } else {
          this.noData = true
        }
      } else {
        if (!type) {
          this.noData = true
        } else {
          this.noData = false
        }
      }
      Vue.set(this.renderResource, this.mySwiper.activeIndex, this.resource[this.mySwiper.activeIndex])
      this.currentIndex = this.mySwiper.activeIndex
      if (this.mySwiper.swipeDirection === 'prev') {
        this.$el.querySelectorAll('.swiper-slide')[this.mySwiper.activeIndex + 1].scrollTop = 0 + 'px'
      } else if (this.mySwiper.swipeDirection === 'next') {
        this.$el.querySelectorAll('.swiper-slide')[this.mySwiper.activeIndex - 1].scrollTop = 0 + 'px'
      }
    },
    // 主观题批改
    subjectiveQtiPigai(item) {
      this.setStudentAnswerDetailData(item);
      this.$router.push({
        name: "checkAnswerDetail",
        params: {
          detailData: item,
          hour_section_type_id: this.$route.query.hour_section_type_id
        }
      })
    },
    // 跳转学生答案情况
    goToStuAnswer(title, info) {
      if (!this.mySwiper) {
        return false
      }
      this.$list(title, info, (item) => {
        if (Number(this.resource[this.mySwiper.activeIndex].icom_id) === 4693) {
          return false
        }
        this.$listClose()
        let questionInfo = this.renderResource[this.mySwiper.activeIndex]
        questionInfo.resource_name = ''
        this.$router.push({
          path: `/originalQuestion`,
          query: {
            user_id: item.userid,
            question_info: JSON.stringify(questionInfo),
            title: item.real_name,
            classId: this.$route.query.classId,
            type: this.params.type
          }
        })
      })
    },
    // 一键批阅
    toggleCorrectPopup() {
      if (this.resource[this.currentIndex].qti_question_type_id === 5) {
        this.hideMutual = true
      } else {
        this.hideMutual = false
      }
      this.itemCorrectPopup = !this.itemCorrectPopup
    },
    // 一键批阅回调
    correctCallback() {
      // this.$store.commit('answerDetail/setCorrectStatus')
      window.bus.$emit('modifyScore', 3)
      if (this.resource[this.mySwiper.activeIndex].yx_father) {
        window.bus.$emit('modifyMini', {
          publish_id: this.resource[this.mySwiper.activeIndex].course_hour_publish_id,
          course_resource_id: this.resource[this.mySwiper.activeIndex].course_resource_id,
          dcom_entity_id: this.resource[this.mySwiper.activeIndex].dcom_entity_id
        }, this.resource[this.mySwiper.activeIndex].yx_father.resource_id)
      }
    }
  },
  components: {
    headerBar,
    answerColumn,
    choiceTable,
    correctColumn,
    correctTable,
    groupDetail,
    groupDetailColumn,
    hanzitingxie,
    renderQti,
    correctItem,
    subjectiveIcom,
    taoti,
    subjectiveIcomTable,
    speedRead,
    screenShotAnswer
  }
}
</script>

<style lang="scss" scoped>
#question-detail{
  .header{
    height: 45px;
    width: 100%;
    padding: 0 13px;
    overflow: hidden;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    .back-btn{
      display: inline-block;
      font-size: 15px;
      flex: 0 0 50px;
      // width: 50px;
      color: #4f4f50;
      line-height: 45px;
      .icon-back{
        display: inline-block;
        width: 10px;
        height: 17px;
        background: url('../../../assets/images/public/left.png') no-repeat 0 0;
        background-size: 100% 100%;
        vertical-align: text-bottom;
      }
      span{
        display: inline-block;
      }
    }
    .title-name{
      font-size: 16px;
      flex: 0 0 220px;
      text-align: center;
      line-height: 45px;
      margin-left: 20px;
      .name{
        display: inline-block;
        width: 90px;
        text-align: right;
      }
      .step{
        width: 80px;
        text-align: left;
        display: inline-block;
        vertical-align: top;
      }
    }
    .right-area{
      flex: 0 0 60px;
      line-height: 45px;
      font-size: 16px;
    }
  }
  position: relative;
  .swiper-container{
    height: calc(100% - 45px);
    overflow: hidden;
    &.scroll{
      height: calc(100% - 45px - 50px);
    }
    .swiper-wrapper{
      height: 100%;
      .swiper-slide{
        height: 100%;
        overflow-y: scroll;
        .no-data{
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #999;
          .no-data-img{
            display: inline-block;
            width: 150px;
            height: 180px;
            background: url(../../../assets/images/homeworkDetail/no-data.png) no-repeat 0 0;
            background-size: cover;
          }
        }
      }
    }
  }
  .subjective-button{
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 65px;
    text-align: center;
    line-height: 50px;
    background-color: #fff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    span{
      flex:0 0 100px;
      height: 50px;
      line-height: 50px;
      background-color: #34c988;
      color: #fff;
      border-radius: 10px;
      font-size: 17px;
    }
  }
}
</style>
