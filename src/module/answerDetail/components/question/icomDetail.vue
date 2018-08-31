<template>
  <div id="icom-detail" class="page">
    <header-bar @back="$router.back(-1)">
      <div slot="title-name">
        组件详情({{currentIndex + 1}}/{{icomDetail.length}})
      </div>
    </header-bar>
    <!-- 小熊射手（知识点）507(单词汉堡)、4643(宝瓶收妖)、4630(单词速记)、5001(字母书写)、5000(闻英起舞)、504(老鹰捉小鸡)、84(群英争霸(句子版))、420(闻英起舞)、4642(宝瓶收妖（听音辨词）)、4424(虎口拔牙)、508(成功营救)、4423(吃火锅)、503(群英争霸) -->
    <div class="content" v-if="$route.params.icom_id == 5018 || $route.params.icom_id == 507 || $route.params.icom_id == 4643 || $route.params.icom_id == 4630 || $route.params.icom_id == 5001 || $route.params.icom_id == 5000 || $route.params.icom_id == 504 || $route.params.icom_id == 84 || $route.params.icom_id == 420 || $route.params.icom_id == 4642 || $route.params.icom_id == 4424 || $route.params.icom_id == 508 || $route.params.icom_id == 4423 || $route.params.icom_id == 503">
      <div class="title van-hairline--bottom">
        <span class="tigan ellipsis" v-html="icomDetail[currentIndex] && icomDetail[currentIndex].title"></span>
        <span class="correct-rate"><span>正确率:</span> <span style="color:#e4393c">{{icomDetail[currentIndex] && icomDetail[currentIndex].percent | percent}}</span></span>
      </div>
      <div class="list-title van-hairline--bottom">
        <span>姓名</span>
        <span>结果</span>
      </div>
      <div class="list-row van-hairline--bottom" v-for="(item, index) in icomDetail[currentIndex].users" :key="index">
        <div class="list-cell ellipsis">{{item.name}}</div>
        <div class="list-cell">
          <span v-if="typeof item.result === 'string'" class="icon" :class="{right: item.result === 'right', wrong: item.result === 'none' || item.result === 'wrong'}"></span>
          <van-rate v-else v-model="item.result" disabled-color="#ffe901" void-color="#ddd" disabled/>
        </div>
      </div>
    </div>
    <!-- 小熊射手组词 -->
    <div class="content" v-if="$route.params.icom_id == 5013 || $route.params.icom_id == 5011">
      <div class="title van-hairline--bottom">
        <span class="tigan ellipsis" v-html="replaceAnswer(icomDetail[currentIndex].content, icomDetail[currentIndex].right_answer)"></span>
        <span class="correct-rate"><span>正确率:</span> <span style="color:#e4393c">{{icomDetail[currentIndex] && icomDetail[currentIndex].correct_rate | percent}}</span></span>
      </div>
      <div class="chart">
        <div class="column">
          <span class="name">正确:</span>
          <span class="line right" v-if="(icomDetail[currentIndex].right.length + icomDetail[currentIndex].wrong.length + icomDetail[currentIndex].none.length) <= 0" @click="popStudent(3, icomDetail[currentIndex].none)"></span>
          <span class="line right" v-else @click="popStudent(1, icomDetail[currentIndex].right)" :style="{width: icomDetail[currentIndex].right.length / (icomDetail[currentIndex].right.length + icomDetail[currentIndex].wrong.length + icomDetail[currentIndex].none.length) * 70 + '%'}"></span>
          <span class="count">{{icomDetail[currentIndex].right.length}}人</span>
        </div>
        <div class="column">
          <span class="name">错误:</span>
          <span class="line wrong" v-if="(icomDetail[currentIndex].right.length + icomDetail[currentIndex].wrong.length + icomDetail[currentIndex].none.length) <= 0" @click="popStudent(3, icomDetail[currentIndex].none)"></span>
          <span class="line wrong" v-else @click="popStudent(2, icomDetail[currentIndex].wrong)" :style="{width: icomDetail[currentIndex].wrong.length / (icomDetail[currentIndex].right.length + icomDetail[currentIndex].wrong.length + icomDetail[currentIndex].none.length) * 70 + '%'}"></span>
          <span class="count">{{icomDetail[currentIndex].wrong.length}}人</span>
        </div>
        <div class="column">
          <span class="name">未答:</span>
          <span class="line none" v-if="(icomDetail[currentIndex].right.length + icomDetail[currentIndex].wrong.length + icomDetail[currentIndex].none.length) <= 0" @click="popStudent(3, icomDetail[currentIndex].none)"></span>
          <span class="line none" v-else @click="popStudent(3, icomDetail[currentIndex].none)" :style="{width: icomDetail[currentIndex].none.length / (icomDetail[currentIndex].right.length + icomDetail[currentIndex].wrong.length + icomDetail[currentIndex].none.length) * 70 + '%'}"></span>
          <span class="count">{{icomDetail[currentIndex].none.length}}人</span>
        </div>
      </div>
    </div>
    <!-- 5009(汉字听写)、5020(英语听写) -->
    <div class="content" v-if="$route.params.icom_id == 5009 || $route.params.icom_id == 5020">
      <div class="title van-hairline--bottom">
        <span class="tigan ellipsis" v-html="icomDetail[currentIndex] && icomDetail[currentIndex].title"></span>
        <span class="correct-rate"><span>正确率:</span> <span style="color:#e4393c">{{icomDetail[currentIndex] && icomDetail[currentIndex].percent | percent}}</span></span>
      </div>
      <div class="list-title van-hairline--bottom">
        <span style="flex:1">姓名</span>
        <span style="flex:2">答案</span>
        <span style="flex:1">结果</span>
      </div>
      <div class="list-row van-hairline--bottom" v-for="(item, index) in icomDetail[currentIndex].users" :key="index">
        <div class="list-cell ellipsis">{{item.name}}</div>
        <div class="list-cell answer ellipsis">
          <img :class="{right: val.isRight == 1, wrong: val.isRight == 0}" v-if="$route.params.icom_id == 5009" :src="val.path" alt="" v-for="(val, idx) in item.path" :key="idx" @click="pigai(item.userid, val.isRight, idx)">
          <span v-if="$route.params.icom_id == 5020">{{item.answer}}</span>
        </div>
        <div class="list-cell">
          <span class="icon" :class="{right: item.result === 'right', wrong: item.result === 'none' || item.result === 'wrong'}"></span>
        </div>
      </div>
    </div>
    <!-- 5015(斗地鼠) -->
    <div class="content" v-if="$route.params.icom_id == 5015">
      <div class="title van-hairline--bottom">
        <span>
          <span class="tigan ellipsis" :class="{check: icomDetail[currentIndex].checkIndex == index}" v-for="(item, index) in icomDetail[currentIndex].title" :key="index">
            {{item[1]}}
          </span>
        </span>
        <span class="correct-rate"><span>正确率:</span> <span style="color:#e4393c">{{icomDetail[currentIndex] && icomDetail[currentIndex].percent | percent}}</span></span>
      </div>
      <div class="list-title van-hairline--bottom">
        <span style="flex:1">姓名</span>
        <span style="flex:2">答案</span>
        <span style="flex:1">结果</span>
      </div>
      <div class="list-row van-hairline--bottom" v-for="(item, index) in icomDetail[currentIndex].users" :key="index">
        <div class="list-cell ellipsis">{{item.name}}</div>
        <div class="list-cell answer ellipsis">
          <span>{{item.answer}}</span>
        </div>
        <div class="list-cell">
          <span class="icon" :class="{right: item.result === 'right', wrong: item.result === 'none' || item.result === 'wrong'}"></span>
        </div>
      </div>
    </div>
    <!-- 口语训练 -->
    <div class="content" v-if="$route.params.icom_id == 4629">
      <div class="title van-hairline--bottom">
        <span class="tigan ellipsis">{{icomDetail[currentIndex].title}}</span>
        <span class="correct-rate"><span>正确率:</span> <span style="color:#e4393c">{{icomDetail[currentIndex] && icomDetail[currentIndex].percent | percent}}</span></span>
      </div>
      <div class="list-title van-hairline--bottom">
        <span style="flex:1">姓名</span>
        <span style="flex:2">学生录音</span>
        <span style="flex:1">结果</span>
      </div>
      <div class="list-row van-hairline--bottom" v-for="(item, index) in icomDetail[currentIndex].users" :key="index">
        <div class="list-cell ellipsis">{{item.name}}</div>
        <div class="list-cell answer ellipsis">
          <span id="autio" @click="mp3Click($event, item.audio)"></span>
        </div>
        <div class="list-cell">
          <span v-if="item.answer >= 70">优秀</span>
          <span v-else-if="item.answer >= 60 && item.answer < 70">良</span>
          <span v-else-if="item.answer >= 50 && item.answer < 60">中</span>
          <span v-else>待提升</span>
        </div>
      </div>
    </div>
    <div class="footer van-hairline--top">
      <span :class="{active: currentIndex > 0, disabled: currentIndex == 0}" @click="next(-1)">上一题</span>
      <span :class="{active: currentIndex < icomDetail.length - 1, disabled: currentIndex == icomDetail.length - 1}" @click="next(1)">下一题</span>
    </div>
  </div>
</template>
<script>
import headerBar from '@/components/headerBar'
import api from '@/module/answerDetail/axios/checkAnswerDetail'
import {mapState} from 'vuex'
import { Rate } from 'vant'
export default {
  name: 'IcomDetail',
  data() {
    return {
      currentIndex: Number(this.$route.params.index)
    }
  },
  computed: {
    ...mapState({
      icomDetail: state => state.answerDetail.icomDetail,
      currentIcom: state => state.answerDetail.resource,
      currentParams: state => state.answerDetail.params,
      teacherId: state => state.account.userInfo.userid
    })
  },
  watch: {
    $route() {
      if (this.$route.name === 'icomDetail') {
        this.currentIndex = Number(this.$route.params.index)
      }
    }
  },
  methods: {
    next(num) {
      this.currentIndex += num
      this.$mp3playerpause()
    },
    replaceAnswer(val, answer) {
      return val.replace('?', '<span style="color:#ff4e00">' + answer + '</span>')
    },
    mp3Click(e, url) {
      let audioUrl = url
      if (url.indexOf('http://') === -1) {
        audioUrl = window.bus.$store.getters['runEnv/old'] + url
      }
      if (!e.currentTarget.classList.contains('play')) {
        this.$mp3player(audioUrl, e.currentTarget)
      } else {
        this.$mp3playerpause()
      }
    },
    popStudent(type, student) {
      if (!student.length) {
        return false
      }
      let studentListTitle = ''
      switch (type) {
        case 1:
          studentListTitle = '正确的学生'
          break;
        case 2:
          studentListTitle = '错误的学生'
          break;
        case 3:
          studentListTitle = '未答的学生'
          break;
      }
      this.$list(studentListTitle, student, item => {
        return false
      })
    },
    // 汉字听写批改
    pigai(studentid, isRight, idx) {
      let icomInfo = this.currentIcom[this.currentParams.index]
      console.log(111, icomInfo)
      let param = {
        publish_id: icomInfo.course_hour_publish_id,
        course_resource_id: icomInfo.course_resource_id,
        dcom_entity_id: icomInfo.dcom_entity_id,
        qti_question_id: '0',
        student_id: studentid,
        correct_rate: Number(isRight) === 0 ? 1 : 0,
        teacher_id: this.teacherId,
        sequence: this.currentIndex + 1,
        idx: idx + 1
      }
      api.setScore(param).then((succ) => {
        this.icomDetail[this.currentIndex].users.forEach((ele) => {
          if (ele.userid === studentid) {
            ele.path[idx].isRight = Number(ele.path[idx].isRight) === 1 ? 0 : 1
          }
          if (ele.path.find((item) => { return Number(item.isRight) === 0 })) {
            ele.result = 'wrong'
          } else {
            ele.result = 'right'
          }
        })
        let rightUsersLen = this.icomDetail[this.currentIndex].users.filter((data) => {
          return data.result === 'right'
        }).length
        this.icomDetail[this.currentIndex].percent = rightUsersLen / this.icomDetail[this.currentIndex].users.length
        // 修改作业的正确率和统计图
        window.bus.$emit('modifyScore')
        // 修改汉字听写组件的正确率
        window.bus.$emit('hanzitingxie', succ.correct_rate, this.$route.params.icom_id)
      })
    }
  },
  components: {
    headerBar
  }
}
</script>
<style lang="scss" scoped>
#icom-detail{
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-size: 16px;
  .content{
    height: calc(100% - 45px - 50px);
    overflow: scroll;
    .title{
      height: 45px;
      line-height: 45px;
      padding: 0 13px;
      display: flex;
      justify-content: space-between;
      background-color: #f8f8f8;
      .check{
        color:#34c988
      }
      .tigan{
        flex: 2;
        text-align: left;
      }
      .correct-rate{
        flex: 1;
        text-align: right;
      }
    }
    .list-title{
      display: flex;
      height: 50px;
      line-height: 50px;
      padding: 0 13px;
      justify-content: space-around;
      span{
        flex: 1;
        text-align: center;
      }
    }
    .list-row{
      display: flex;
      height: 50px;
      line-height: 50px;
      padding: 0 13px;
      justify-content: space-around;
      .list-cell{
        flex: 1;
        text-align: center;
        &.answer{
          flex: 2;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          img{
            width: 30px;
            height: 30px;
            margin: 0 2px;
            &.right{
              border: 1px solid #2fc890;
            }
            &.wrong{
              border: 1px solid #ff4e00;
            }
          }
        }
        .icon{
          display: inline-block;
          &.right{
            width: 20px;
            height: 14px;
            background: url(../../../../assets/images/answerDetail/right.png) no-repeat 0 0;
            background-size: cover;
          }
          &.wrong{
            width: 14px;
            height: 14px;
            background: url(../../../../assets/images/answerDetail/wrong.png) no-repeat 0 0;
            background-size: cover;
          }
        }
        .icon-star{
          display: inline-block;
          width: 207px;
          height: 36.5px;
          margin-top: 7px;
          background: url(../../../../assets/images/answerDetail/star5.png) no-repeat 0 0;
          background-size: cover;
          .icon-star-light{
            display: inline-block;
            height: 36px;
            width: 207px;
            background: url(../../../../assets/images/answerDetail/star5.png) no-repeat;
            // background-clip: content-box;
            background-size: cover;
            // transform: rotate(180deg)
          }
        }
      }
    }
    .chart{
      .column{
        display: flex;
        justify-content: flex-start;
        height: 35px;
        line-height: 30px;
        margin: 15px 0;
        padding: 0 13px;
        .name{
          flex: 0 0 15%;
        }
        .line{
          min-width: 5px;
          margin-right: 10px;
          &.right{
            background-color: #34c988
          }
          &.wrong{
            background-color: #f56956;
          }
          &.none{
            background-color: #cccdcd
          }
        }
      }
    }
  }
  .footer{
    display: flex;
    position: absolute;
    height: 50px;
    line-height: 50px;
    padding: 0 13px;
    box-sizing: border-box;
    width: 100%;
    bottom: 0;
    justify-content: space-around;
    span.active{
      color: #08b884
    }
    span.disabled{
      color: #e2e4e3;
      pointer-events: none;
    }
  }
  #autio{
    display: inline-block;
    width: 36px;
    height: 36px;
    background: url(../../../../assets/images/public/audio-play.png) no-repeat 0 0;
    background-size: cover;
    &.play{
      background: url(../../../../assets/images/public/audio.jpg) no-repeat 0 0;
      background-size: cover;
    }
  }
}
</style>
