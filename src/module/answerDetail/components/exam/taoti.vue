<template>
  <div id="tongji">
    <!-- 顶部统计 -->
    <div class="percent-wrapper van-hairline--bottom">
      <div class="percent-params">
        <span class="name">正确率</span>
        <span class="percent red">{{params.average_rate | percent}}</span>
      </div>
      <div class="percent-params">
        <span class="name">平均用时</span>
        <span class="percent black">{{params.average_time_length | timeFormatSecond}}</span>
      </div>
    </div>
    <!-- 加载动画 -->
    <div v-show="loading" class="loading">
      <i class="fa fa-spinner fa-spin"></i>
      <span>加载中...</span>
    </div>
    <div class="tab-wrapper van-hairline--bottom" v-if="!loading">
      <tab :tabType="tabType" @tabChange="tabChange"></tab>
    </div>
    <div class="list-wrapper" ref="list" @scroll="listScroll" v-if="!loading">
      <template v-if="util.judgeQuestionType(this.params) == 'combineqti'">
        <according-question v-show="tabType === 1 && (homeworkInfo.resource.length || Object.keys(homeworkInfo.resource).length) && !loading" :homeworkInfo="homeworkInfo.resource" @linkToAnswer="linkToAnswer"></according-question>
      </template>
      <template v-else>
        <!-- 答案表格 成功营救、字母书写、听力 -->
        <!-- <hanzitingxie v-show="tabType === 1" :params="params" type="3" v-if=""></hanzitingxie> -->
        <!-- 答案表格 小熊射手组词(数学) 4629(口语训练)、5009(汉字听写)、5021(文章阅读)、5011(口算训练)、5020（英语听写）、507(单词汉堡)、4643(宝瓶收妖(语音识词))、4630(单词速记)、5001(字母书写)、5000(闻英起舞)、504(老鹰捉小鸡)、84(群英争霸(句子版))、5015(斗地鼠)、4642(宝瓶收妖(听音辩词))、4424(虎口拔牙)、4423(吃火锅)、503(群英争霸) -->
        <group-detail v-show="tabType === 1" :params="params" type="3" :icomId="params.icom_id" v-if="params.icom_id == 508 || params.qti_question_type_id == 17 || params.icom_id == 5013 || params.icom_id == 5018 || params.icom_id == 5011 || params.icom_id == 420 || (params.icom_id == 4629 && params.alias == 'oraltest') || params.icom_id == 5009 || params.icom_id == 5021 || params.icom_id == 5020 || params.icom_id == 507 || params.icom_id == 4643 || params.icom_id == 4630 || params.icom_id == 5001 || params.icom_id == 5000 || params.icom_id == 504 || params.icom_id == 84 || params.icom_id == 5015 || params.icom_id == 4642 || params.icom_id == 4424 || params.icom_id == 4423 || params.icom_id == 503"></group-detail>
      </template>
      <according-student @showStudentList="showStudent" :type="util.judgeQuestionType(params)" v-show="tabType === 2 && homeworkInfo && !loading" :info="homeworkInfo" :chartType="chartType" @linkToStudentAnswer="linkToStudentAnswer"></according-student>
    </div>
    <div class="model-icon" v-show="tabType === 2" @click="changeChart">
      <img :src="iconUrl" alt="...">
      <span>{{chartType === 1 ? '统计' : '列表'}}</span>
    </div>
  </div>
</template>
<script>
import tab from './tab'
import accordingQuestion from './accordingQuestion'
import accordingStudent from './accordingStudent'
import hanzitingxie from '../question/hanzitingxie'
import api from '../../axios/getQuestionStatistics'
import groupDetail from '@/module/answerDetail/components/question/groupDetail'
import {mapMutations} from 'vuex'
export default {
  name: 'taoti',
  props: ['params'],
  data() {
    return {
      tabType: 1, // 1按试题统计，2按学生统计
      chartType: 1, // 1列表,2图表
      homeworkInfo: null,
      loading: true,
      studentListShow: false,
      studentListInfo: {
        title: null,
        studentList: []
      },
      scrollTop: {
        1: 0,
        2: 0
      }
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
    }
  },
  mounted() {
    this.getResource()
  },
  activated() {
    // 初始化滚动条位置
    if (this.$route.meta.scrollTop) {
      this.$el.querySelector('.list-wrapper').scrollTop = this.$route.meta.scrollTop
    }
  },
  methods: {
    ...mapMutations({
      setResource: 'answerDetail/setResource',
      setParams: 'answerDetail/setParams',
      setTongjiParams: 'answerDetail/setTongjiParams',
      setTongjiResource: 'answerDetail/setTongjiResource'
    }),
    // 滚动
    listScroll(e) {
      this.$route.meta['scrollTop'] = this.util.getRect(e.target).scrollTop
    },
    // 顶部tab切换
    tabChange(type) {
      this.scrollTop[this.tabType] = this.$refs.list.scrollTop
      this.tabType = type
      this.$nextTick(() => {
        this.$refs.list.scrollTop = this.scrollTop[this.tabType]
      })
    },
    // 获取资源
    getResource() {
      this.qtiStatistics()
    },
    // 获取资源
    qtiStatistics() {
      this.loading = true
      api.getinfo({
        'publish_id': this.params.course_hour_publish_id,
        'course_resource_id': this.params.course_resource_id,
        'dcom_entity_id': this.params.dcom_entity_id,
        'icom_id': this.params.icom_id,
        'h': 1,
        'qti_question_sheet': (this.params.resource_type === 'qti_exam_sheet' || this.params.resource_type === 'qti_question_sheet') ? 1 : 0
      }).then(succ => {
        console.log(succ)
        // 课前课后处理
        // if (this.$store.state.homework.homeworkState === '0') {
        this.loading = false
        this.homeworkInfo = succ
        // } else {
        // 课后处理
        // }
      })
    },
    // 图标和列表的切换
    changeChart() {
      if (this.chartType === 1) {
        this.chartType = 2
      } else {
        this.chartType = 1
      }
    },
    // 显示学生该正确率下的学生列表
    showStudent(title, studentList) {
      let titleName = title + '的学生'
      let list = studentList
      this.$list(titleName, list.user, item => {
        this.$listClose()
        this.linkToStudentAnswer(item)
        return false
      })
    },
    // 按题统计的跳转
    linkToAnswer(info, index, type, children) {
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
    // 按学生查看跳转
    linkToStudentAnswer(userInfo) {
      this.setTongjiParams({
        index: 0,
        type: 2,
        userId: userInfo.userid,
        title: userInfo.real_name + '的作业'
      })
      if (this.util.judgeQuestionType(this.params) === 'objectiveicom') {
        this.setTongjiResource([this.params])
      } else {
        this.setTongjiResource([...this.homeworkInfo.resource])
      }
      this.$router.push({
        path: '/tongji'
      })
    }
  },
  components: {
    tab,
    accordingQuestion,
    accordingStudent,
    groupDetail,
    hanzitingxie
  }
}
</script>
<style lang="scss" scoped>
#tongji{
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
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
    background-color: #f5f8f8;
  }
  .list-wrapper{
    width: 100%;
    height: calc(100% - 80px - 45px);
    overflow-y: scroll;
    &.according-q{
      height: calc(100% - 80px);
    }
    &.noScroll{
      overflow: hidden;
    }
  }
  .model-icon{
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
  .loading{
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #999;
  }
}
</style>
