<template>
  <div class="detail">
    <div class="wrapper" @scroll="scroll">
      <!-- 作业名称 开始时间 结束时间 -->
      <info :title="homeworkInfo.title" :endTime="homeworkInfo.deadline" :total="resourceList.length"></info>
      <!-- 平均正确率 -->
      <div class="correct">
        <i class="icon" @click="toggleTips"></i>
        <div>
          <correct-circle :r="50" :startColor="'#75bdff'" :middleColor="'#86c2ff'" :stopColor="'#3ea2ff'" :stroke="14" :strokeColor="'#e8ecef'" :correct="correct>=0?correct*100:0" :domid="'process'" :text="classCorrect" :describe="'平均正确率'">
          </correct-circle>
        </div>
      </div>
      <!-- 内容 -->
      <div class="content">
        <!-- 作业作答情况 学生完成情况tab -->
        <div class="btns van-hairline--surround">
          <van-row>
            <van-col span="12" :class="{'active':activeBtn=='homework'}">
              <span @click="toggleContent('homework')">作业作答情况</span>
            </van-col>
            <van-col span="12" class="student" :class="{'active':activeBtn=='student'}">
              <span @click="toggleContent('student')">学生完成情况</span>
            </van-col>
          </van-row>
        </div>
        <!-- 作业作答情况内容 -->
        <div class="homework-content" v-if="activeBtn=='homework'">
          <div class="total">
            <!-- <span>共{{resourceList.length}}题</span> -->
            <span>只看待批改</span>
            <span class="right">
              <i class="checkbox icon" :class="{'checked':notcorrect}" @click="check"></i>
            </span>
          </div>
          <!-- 作业资源列表 -->
          <div class="lists">
            <transition-group name="list" tag="ul">
              <li class="item" v-for='(ques,index) in resourceList' :key="index" v-show="!(notcorrect&&ques.pigai_status!==1)">
                <div class="iteminfo" @click="changeCollapse(index)" :class="{'no-border':miniResourceId.find((v) => v == ques.resource_id)}">
                  <div class="left">{{index+1}}、</div>
                  <div class="right">
                    <p>[{{ques.icom_name | questionName(ques)}}]
                      <span class="resource-name" v-html="resourceName(ques.resource_name)"></span>
                      <span v-if="ques.pigai_status===1" class="no-correct"> 待改</span>
                    </p>
                    <p style="position:relative">
                      已完成：{{ques.finished_counter}}/{{homeworkInfo.student_counter}}人 正确率：
                      <template  v-if="ques.pigai_status===0 || (ques.pigai_status===3  && ques.marked===1)">
                        --
                      </template>
                      <template v-else-if="homeworkInfo.hour_section_type_id!=='20'&& ques.pigai_status===1">
                        --
                      </template>
                        <template v-else-if="homeworkInfo.hour_section_type_id==='20'||ques.pigai_status===3 || ques.pigai_status===4">
                        {{ques.average_rate | percent}}
                      </template>

                      <i class="icon arrow" :class="{'down':miniResourceId.find((v) => v == ques.resource_id)}"></i>
                    </p>
                  </div>
                </div>
                <!-- :class="{hide:!miniResourceId.find((v) => v == ques.resource_id)}" -->
                <!-- <transition name="van-fade"> -->
                  <!-- <div>{{miniResource[ques.resource_id]}}</div> -->
                <div class="itemdetail" v-if="(ques.resource_type=='qti_exam'||isCompound(ques)) && miniResourceId.find((v) => v == ques.resource_id)">
                  <template  v-if="!notcorrect">
                    <p v-for="(mini,key) in miniResource[ques.resource_id]" :key="key" @click="goTongji(mini,index,key)" :class="{'no-margin':key>0&&(key+1)%5==0}">
                      <span v-if="mini.status === 1" style="background:#ff8d13;" class="need_corrected">待批改<br> ({{mini.need_corrected_num}})</span>
                      <span v-else-if="mini.status === 0" style="background:#9c9ea1;">未提交</span>
                      <span v-else-if="mini.status == 3 && mini.marked == 1" style="background:#3ea2ff;">阅</span>
                      <span v-else :class="{right: mini.correct_rate >= 0.6,wrong:mini.correct_rate < 0.6}">{{mini.correct_rate | percent}}</span>
                      <span class="ques-num">{{(index+1) + '-' + (key + 1)}}</span>
                    </p>
                  </template>
                  <template v-else>
                    <p v-for="(mini,key) in miniResource[ques.resource_id]" :key="key" @click="goTongji(mini,index,key)" v-if="mini.status===1">
                      <span style="background:#ff8d13;" class="need_corrected">待批改<br> ({{mini.need_corrected_num}})</span>
                      <span class="ques-num">{{(index+1)+'-'+(key+1)}}</span>
                    </p>
                  </template>
                </div>
                <!-- </transition> -->
              </li>
              <!-- <li class="item" v-for='(ques,index) in resourceList' :key="index" v-show="(notcorrect && ques.pigai_status !== 1)">
                无待批改试题
              </li> -->
            </transition-group>
          </div>
        </div>
        <!-- 学生完成情况 -->
        <div class="student-content" v-if="activeBtn=='student'">
          <!-- 完成人数大于0 显示列表 -->
          <div class="status">
            <van-row class="item">
              <van-col span="9">
                <i class="icon unfinish"></i>未完成作业
              </van-col>
              <van-col span="9">{{homeworkInfo.unfinished_counter}}人</van-col>
              <van-col span="6" class="btn" v-if="homeworkState==='0' && isUrge<=0">
                <p @click="toggleUrge" :class="{disable:homeworkInfo.unfinished_counter===0}">催交作业</p>
              </van-col>
              <van-col span="6" class="btn" v-if="homeworkState==='0' && isUrge>0">
                <p class="disable">今日已提醒</p>
              </van-col>
            </van-row>
            <van-row class="item">
              <van-col span="9">
                <i class="icon revising"></i>未攻克错题
              </van-col>
              <van-col span="9">{{homeworkInfo.unretyr_counter}}人</van-col>
              <van-col span="6" class="btn" v-if="homeworkState==='0'">
                <p @click="toggleRemind" :class="{disable:homeworkInfo.unretyr_counter===0}">提醒攻克</p>
              </van-col>
              <!-- <van-col span="6" class="btn" v-if="homeworkState==='0' && isRemind>0">
                <p class="disable">今日已提醒</p>
              </van-col> -->
            </van-row>
          </div>
          <div class="title">学生成绩</div>
          <template v-if="homeworkInfo.has_submit_record>0">
            <!-- 学生列表 -->
            <student-list :studentList="studentList" :publishId="homeworkInfo.course_hour_publish_id"></student-list>
          </template>
          <!-- 没人完成 -->
          <template v-else>
            <div class="noanswer-tip">还没有学生提交作业哟～</div>
          </template>
        </div>
      </div>
    </div>
    <!-- 底部按钮 -->
    <div class="bottom-btn">
      <div class="btn" :class="{disable:homeworkStatus!=1}">
        <p @click="toggleCorrectPopup">一键批改</p>
      </div>
      <div class="btn">
        <p @click="goBatchEvaluate">批量评价</p>
      </div>
      <div class="btn" :class="{disable:!sendAnswer}" v-if="homeworkInfo.hour_section_type_id=='20'">
        <p v-if="isSendAnswer==0">公布答案</p>
        <p v-else @click="toggleAnswerTip">公布答案</p>
      </div>
      <div v-if="homeworkInfo.hour_section_type_id!=='20'" class="btn" :class="{disable:!sendAnswer,result:homeworkInfo.send_num>0}">
          <p v-if="isSendAnswer==0">发送结果</p>
          <p v-else-if="homeworkInfo.send_num>=0" @click="sendResult">
            发送结果(<span style="color:#f00"> {{homeworkInfo.send_num}} </span>)
          </p>
           <p v-else @click="sendResult">
            发送结果
          </p>
      </div>
    </div>
    <!-- 班级平均正确率计算规则tip -->
    <tips v-if="showTips" @toggle="toggleTips"></tips>
    <!-- 催交作业 -->
    <urge v-if="urge" @toggle="toggleUrge"></urge>
    <!-- 攻克提醒 -->
    <remind v-if="remind" @toggle="toggleRemind"></remind>
    <!-- 一键批改 -->
    <correct v-if="correctTip" @toggle="toggleCorrectPopup" @callback="getResource" :publishId="$route.params.publishId" :send="0"></correct>
    <!-- 发布答案 -->
    <answer v-if="answerTip" @toggle="toggleAnswerTip" :publishId="$route.params.publishId" :classId="$route.params.classId" :sectionType="homeworkInfo.hour_section_type_id" :students="studentList"></answer>
  </div>
</template>

<script>
import homeworkDetail from "../axios/detail.js";
import { Toast } from 'vant';
import Vue from "vue";
import tips from "./common/tips.vue"; // 正确率提示
import urge from "./common/urge.vue"; // 催交作业
import remind from "./common/remind.vue"; // 提醒攻克
import correct from "@/components/common/correctPopup.vue"; // 一键批改
import answer from "./common/answer.vue"; // 发送答案
import correctCircle from '@/components/common/correct.vue'
import info from './common/info.vue'
import studentList from '@/module/homeworkDetail/components/common/studentList'
import { mapMutations, mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: "detail",
  props: ['homeworkInfo', 'resourceList', 'homeworkStatus'],
  data() {
    return {
      studentList: [], // 班级学生完成情况，
      correct: -1, // 班级正确率
      activeBtn: "homework", // content内容显示
      showTips: false, // 提示遮罩层
      urge: false, // 催交作业遮罩层
      remind: false, // 攻克题型遮罩层
      // eslint-disable-next-line
      notcorrect: this.$route.query.from === 'home' ? true : false, // 是否只看待批改
      isUrge: '', // 是否已催交作业
      isRemind: '', // 是否已题型攻克
      answerTip: false, // 发布答案弹框
      correctTip: false, // 一键批改弹框
      // homeworkStatus: "", // 当前作业完成状态 1未批改 3已批改
      miniResource: {}, // 小资源
      index: 0, // 当前小资源的key
      isSendAnswer: 1,
      homeworkState: "0"
    };
  },
  created() {
    // 初始化课中还是课后的状态
    this.homeworkState = this.$store.state.homework.homeworkState;
    // 初始化变量数据
    this.getinfo();
    // 脱式计算二次批改
    window.bus.$on('getCorrentMiniRS', (publishId, resourceId, entityId) => {
      let param = {
        publish_id: publishId,
        course_resource_id: resourceId,
        dcom_entity_id: entityId
      }
      if (resourceId === this.resourceList[this.index].course_resource_id) {
        homeworkDetail.getMiniResource(param).then(r => {
          this.miniResource[this.index] = r;
        });
      } else {
        return false
      }
    })
    // 监听批改状态的改变
    window.bus.$on('modifyMini', (params, resourceId) => {
      homeworkDetail.getMiniResource(params).then(r => {
        this.miniResource[resourceId] = r
      })
    })
  },
  activated() {
    // 初始化滚动条位置
    if (this.$route.meta.scrollTop) {
      this.$el.querySelector('.wrapper').scrollTop = this.$route.meta.scrollTop
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
      miniResourceId: state => state.homeworkDetail.hasShowMiniResourceList
    }),
    // 班级正确率
    classCorrect() {
      if (this.correct === '' || this.correct <= -1) {
        return '--'
      } else if (this.correct === 1) {
        return '100%'
      } else {
        let num = (this.correct * 100) % 1 === 0 ? (this.correct * 100) : (this.correct * 100).toFixed(1)
        return this.correct === 0 ? '0%' : num + '%'
      }
    },
    sendAnswer() { // 是否能发布答案
      if (this.isSendAnswer === 0) { // 已经发布过答案
        return false
      } else {
        return true
      }
    },
    margin(key) {
      if (key > 0 && (key + 1) % 5 === 0) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'homework') {
        this.activeBtn = 'homework'
      }
    },
    homeworkInfo(data) {
      this.getinfo()
    }
  },
  methods: {
    ...mapMutations({
      setResource: 'answerDetail/setResource',
      setParams: 'answerDetail/setParams',
      saveMiniResource: 'homeworkDetail/saveMiniResource',
      saveHasShowMiniResourceList: 'homeworkDetail/saveHasShowMiniResourceList',
      clearMiniResource: 'homeworkDetail/clearMiniResource'
    }),
    ...mapActions({
      getMiniResource: 'homeworkDetail/getMiniResource'
    }),
    // 记录滚动记录
    scroll(e) {
      this.$route.meta['scrollTop'] = this.util.getRect(e.target).scrollTop
    },
    resourceName(name) { // 资源名称 解决br标签引起的排版混乱bug
      name = name.replace(/(<br>)/ig, '')
      return name
    },
    getResource() {
      this.$emit('getresource');
      this.getinfo();
      // 一键批改后清空小资源列表
      this.miniResource = {};
    },
    getinfo() {
      // 班级正确率
      this.correct = this.homeworkInfo.class_average_correct_rate
      // 学生列表
      this.studentList = this.homeworkInfo.student_list
      // 是否催交过作业  0 未催交 1 当日已催交
      this.isUrge = this.homeworkInfo.notice_zuoye
      // 是否提醒攻克  0 未提醒 1 当日已提醒
      this.isRemind = this.homeworkInfo.notice_retry
      // 是否发送答案
      this.isSendAnswer = this.homeworkInfo.is_send_answer
    },
    check() {
      this.notcorrect = !this.notcorrect;
    },
    goBatchEvaluate() {
      // 批量评价
      this.$router.push({
        path: "/batchEvaluate"
      });
    },
    // 作业作答情况、学生详情切换tab
    toggleContent(items) {
      this.activeBtn = items;
    },
    // 正确率计算规则提示
    toggleTips() {
      this.showTips = !this.showTips;
    },
    // 催交作业弹出框
    toggleUrge() {
      if (this.homeworkInfo.unfinished_counter === 0 || this.isUrge > 0) {
        return false
      }
      let params = {
        teacher_id: JSON.parse(window.localStorage.userinfo).userid,
        course_hour_publish_id: this.homeworkInfo.course_hour_publish_id
      }
      homeworkDetail.urge(params).then((r) => {
        this.urge = !this.urge;
        this.isUrge = true;
        setTimeout(() => {
          this.urge = false;
        }, 3000);
      })
    },
    // 提醒攻克弹出框
    toggleRemind() {
      if (this.homeworkInfo.unretyr_counter === 0) {
        return false
      }
      let params = {
        teacher_id: JSON.parse(window.localStorage.userinfo).userid,
        course_hour_publish_id: this.homeworkInfo.course_hour_publish_id
      }
      homeworkDetail.remind(params).then((r) => {
        this.remind = !this.remind;
        // this.isRemind = true;
        if (this.remind) {
          setTimeout(() => {
            if (this.remind) {
              this.remind = false;
            }
          }, 3000);
        }
      })
    },
    // 一键批改弹框
    toggleCorrectPopup() {
      if (this.homeworkStatus !== 1) {
        return false;
      }
      this.correctTip = !this.correctTip;
    },
    // 发布答案弹窗
    toggleAnswerTip(send) {
      // is_send_answer==0 已发布过答案
      // is_send_answer==1 未发布过答案
      if (Number(this.homeworkInfo.course_hour_section_id) === 20) {
        if (send === 1) {
          this.isSendAnswer = 0
        }
        this.answerTip = !this.answerTip
      }
    },
    // 老作业发送结果
    sendResult() {
      let params = {
        publish_id: this.$route.params.publishId,
        class_id: this.$route.params.classId,
        teacher_id: JSON.parse(window.localStorage.userinfo).userid,
        student_id: []
      }
      for (let i = 0; i < this.studentList.length; i++) {
        if (this.studentList[i].status === 3) {
          params.student_id.push(this.studentList[i].userid)
        }
      }
      params.student_id = params.student_id.join(',')
      homeworkDetail.sendAnswer(params).then(r => {
        Toast.success({
          duration: 2000,
          message: '结果已发送！'
        });
        this.isSendAnswer = 0
      });
    },
    // 查看小题
    changeCollapse(index, ismini) {
      let curr = {};
      let detailbox = "";
      // 套题或试卷  获取当前点击资源
      curr = this.resourceList[index]
      this.index = index

      // 加载小资源参数
      let param = {
        publish_id: curr.course_hour_publish_id,
        course_resource_id: curr.course_resource_id,
        dcom_entity_id: curr.dcom_entity_id
      };
      if (this.isCompound(curr)) {
        // 小资源加载过则不再走接口
        this.saveHasShowMiniResourceList({
          resource_id: curr.resource_id
        })
        if (this.miniResource[curr.resource_id]) {
          return false;
        }
        homeworkDetail.getMiniResource(param).then(succ => {
          Vue.set(this.miniResource, curr.resource_id, succ)
        })
      } else {
        // 单题直接进批改
        let resource = this.resetResource()
        let a = 0
        resource.filter((v, i) => {
          if (JSON.stringify(curr) === JSON.stringify(v)) {
            a = i
          }
        })
        this.setResource(resource)
        this.setParams({
          type: 1,
          index: a,
          title: '批改作业'
        })
        this.$router.push({
          name: 'pigai',
          params: {
            classId: this.$route.params.classId
          }
        })
      }
    },
    // 查看单题统计
    goTongji(curr, index, key) {
      let resource = this.resetResource()
      let a = 0
      resource.filter((v, i) => {
        if (JSON.stringify(curr) === JSON.stringify(v)) {
          a = i
        }
      })
      this.setResource(resource)
      if (curr.status === 0) {
        this.setParams({
          type: 1,
          index: a,
          title: '批改作业'
        })
      } else {
        this.setParams({
          type: 1,
          index: a,
          title: '批改作业'
        })
      }
      this.$router.push({
        path: "/pigai",
        query: {
          classId: this.$route.params.classId,
          hour_section_type_id: this.homeworkInfo.hour_section_type_id
        }
      });
    },
    // 跳转的数据处理
    resetResource() {
      let resource = [...this.resourceList]
      for (let i = 0; i < resource.length; i++) {
        for (let key in this.miniResource) {
          if (key === resource[i].resource_id) {
            this.miniResource[key].forEach((ele, index) => {
              ele['yx_index'] = index
              ele['yx_count'] = this.miniResource[key].length
              ele['yx_father'] = resource[i]
              ele['yx_qti_question_type_id'] = resource[i].qti_question_type_id ? resource[i].qti_question_type_id : ''
              ele['yx_resource_name'] = resource[i].resource_name ? resource[i].resource_name : ''
            })
            resource.splice(i, 1, ...this.miniResource[key])
          }
        }
      }
      return resource
    },
    // 是否为复合题
    isCompound(resource) {
      let result = true
      let type = this.util.judgeQuestionType(resource)
      if (type === 'combineqti') {
        result = true
      } else if (type === 'subjectiveqti' || type === 'objectiveqti' || type === 'objectiveicom' || type === '') {
        result = false
      }
      return result
    }
  },
  components: {
    tips,
    urge,
    remind,
    correct,
    answer,
    correctCircle,
    info,
    studentList
  }
};
</script>

<style scoped>
.list-enter-active, .list-leave-active {
  height: 20vw;
  transition: all .3s;
}
.list-enter, .list-leave-to
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translate3d(100% , 0, 0);
}
.detail {
  height: 100vh;
  font-size: 16px;
}

/* title样式 */

.detail > .wrapper {
  height: calc(100vh - 110px);
  overflow-y: scroll;
  overflow-x: hidden;
}

/* 作业信息 */
.detail > .wrapper .itemdetail {
  display: flex;
  flex-wrap: wrap;
  border-bottom: 1px solid #e8ebee;
  background: #f5f7f8;
  padding: 5px 13px 5px;
  box-sizing: border-box;
}

.detail > .wrapper .itemdetail p span:first-child {
  text-align: center;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  line-height: 44px;
  color: #fff;
  font-size: 12px;
}
.detail > .wrapper .itemdetail p span.need_corrected{
  font-size: 10px;
  line-height: 12px;
  padding-top:10px;
  box-sizing: border-box;
}
.detail > .wrapper .itemdetail p span.right {
  background: #08b783;
}
.detail > .wrapper .itemdetail p span.wrong {
  background: #ff5266;
}
.detail > .wrapper .itemdetail p span.ques-num {
  color: #c8c9c9;
}
.detail > .wrapper .itemdetail p {
  text-align: center;
  display: flex;
  flex-direction: column;
  padding: 8px 31px 8px 0px;
  font-size: 14px;
  flex: 1 auto auto;
}
.detail > .wrapper .itemdetail p.no-margin{
  padding-right: 0;
}
.detail > .wrapper .itemdetail p:nth-child(5),
.detail > .wrapper .itemdetail p:nth-child(10),
.detail > .wrapper .itemdetail p:nth-child(15),
.detail > .wrapper .itemdetail p:nth-child(20)
.detail > .wrapper .itemdetail p:nth-child(25)
.detail > .wrapper .itemdetail p:nth-child(30)
.detail > .wrapper .itemdetail p:nth-child(35)
 {
  padding-right: 0px;
}

.detail > .wrapper .itemdetail.hide {
  display: none;
}

/* 班级正确率 */

.detail > .wrapper > .correct {
  height: 175px;
  padding: 10px;
  text-align: center;
  background: #f5f7f8;
  box-sizing: border-box;
  position: relative;
}
.detail > .wrapper > .correct>div{
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
}
.detail > .wrapper > .correct i {
  position: absolute;
  right: 45px;
  top: 17px;
  color: #55a9f1;
  z-index: 2;
  display: inline-block;
  width: 22px;
  height: 22px;
  background-image: url("../../../assets/images/public/help.png");
}
.detail > .wrapper > .correct i:active {
  background-image: url("../../../assets/images/public/help-h.png");
}
.detail > .wrapper > .correct > .num {
  font-size: 24px;
  font-weight: bold;
}

.detail > .wrapper > .content {
  background: #fff;
  /* height: calc(100% - 160px - 20px); */
  box-sizing: border-box;
}

/* 作答情况完成情况tab */

.detail > .wrapper > .content > .btns span {
  display: inline-block;
  height: 42px;
  border-bottom: 2px solid transparent;
}

.detail > .wrapper > .content > .btns {
  line-height: 44px;
  height: 44px;
  box-sizing: border-box;
  text-align: center;
}

.detail > .wrapper > .content > .btns .active span {
  color: #08b783;
  border-bottom: 2px solid #08b783;
}

/* 作业作答情况content */

.detail > .wrapper > .content > .homework-content,
.detail > .wrapper > .content > .student-content {
  height: calc(100% - 50px - 68px - 20px);
}

.detail > .wrapper > .content > .homework-content > .total {
  padding: 0 10px;
  line-height: 45px;
  height: 45px;
  box-sizing: border-box;
  border-bottom: 1px solid #e8ebee;
}

.detail > .wrapper > .content > .homework-content > .total > .right {
  float: right;
}
.detail > .wrapper > .content > .homework-content > .total > .right .checkbox {
  display: inline-block;
  width: 19px;
  height: 19px;
  background-image: url("../../../assets/images/public/checkunsel.png");
}
.detail
  > .wrapper
  > .content
  > .homework-content
  > .total
  > .right
  .checkbox.checked {
  background-image: url("../../../assets/images/public/checksel.png");
}
.detail > .wrapper > .content > .homework-content .lists {
  height: calc(100% - 45px);
  overflow-y: scroll;
  box-sizing: border-box;
  width: 100%;
}

.detail > .wrapper > .content > .homework-content .lists .item .iteminfo {
  height: 75px;
  border-bottom: 1px solid #e8ebee;
  display: flex;
  margin: 0 13px;
  box-sizing: border-box;
  padding-top: 8px;
}

.detail
  > .wrapper
  > .content
  > .homework-content
  .lists
  .item
  .iteminfo.no-border {
  border-bottom: 1px solid transparent;
}
.detail
  > .wrapper
  > .content
  > .homework-content
  .lists
  .item
  .iteminfo
  > .right {
  width: calc(100% - 35px);
  line-height: 30px;
  font-size: 14px;
  position: relative;
}
.detail
  > .wrapper
  > .content
  > .homework-content
  .lists
  .item
  .iteminfo
  > .right
  .arrow {
  position: absolute;
  right: 0;
  top: 3px;
  background-image: url("../../../assets/images/public/right.png");
}
.detail
  > .wrapper
  > .content
  > .homework-content
  .lists
  .item
  .iteminfo
  > .right
  .arrow.down {
  background-image: url("../../../assets/images/public/down.png");
}
.detail
  > .wrapper
  > .content
  > .homework-content
  .lists
  .item
  .iteminfo
  > .right
  .no-correct {
  position: absolute;
  right: 0;
  background: #ff8d13;
  color: #fff;
  border-radius: 30px;
  font-size: 12px;
  height: 22px;
  width: 60px;
  line-height: 22px;
  box-sizing: border-box;
  text-align: center;
}
.detail
  > .wrapper
  > .content
  > .homework-content
  .lists
  .item
  .iteminfo
  > .right
  p {
  display: flex;
  position: relative;
}

.detail
  > .wrapper
  > .content
  > .homework-content
  .lists
  .item
  .iteminfo
  > .right
  p
  .showdetail {
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
}

.detail > .wrapper > .content > .homework-content .right .resource-name {
  display: inline-block;
  width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 10px;
}

.detail
  > .wrapper
  > .content
  > .homework-content
  .lists
  .item
  .iteminfo
  > .left {
  /* display: inline-block; */
  width: 35px;
  height: 100%;
  line-height: 60px;
}

/* 学生列表样式 */

.detail > .wrapper > .content > .student-content .unfinish-state {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.detail > .wrapper > .content > .student-content .unfinish-state > div {
  width: 50%;
  display: flex;
  justify-content: center;
}

.detail > .wrapper > .content > .student-content .unfinish-state p {
  width: 80px;
  text-align: center;
  border: 1px solid #e8ebee;
  padding: 10px 20px;
}

.detail > .wrapper > .content > .student-content .title {
  margin-top: 20px;
  padding-left: 10px;
  font-weight: 500;
}

.detail > .wrapper > .content > .student-content .noanswer-tip {
  text-align: center;
  margin-top: 20px;
}

.detail > .wrapper > .content > .student-content .status > .item {
  padding: 0 13px;
  height: 55px;
  line-height: 55px;
  border-bottom: 1px solid #e8ebee;
  box-sizing: border-box;
}
.detail > .wrapper > .content > .student-content .status > .item i {
  position: relative;
  margin-right: 5px;
  top: 4px;
  background-image: url("../../../assets/images/homeworkDetail/unfinish.png");
}
.detail > .wrapper > .content > .student-content .status > .item i.revising {
  background-image: url("../../../assets/images/homeworkDetail/revising.png");
}
.detail > .wrapper > .content > .student-content .status > .item .disable {
  opacity: 0.5;
}

.detail > .wrapper > .content > .student-content .status > .item .btn {
  background: #08b783;
  float: right;
  width: 75px;
  color: #fff;
  height: 30px;
  line-height: 30px;
  margin-top: 12.5px;
  text-align: center;
  border-radius: 8px;
  font-size: 12px;
}
.detail > .wrapper > .content > .student-content .student-list {
  height: calc(100% - 120px);
}

/* 班级平均正确率计算规则提示样式 */

/* 底部按钮 */

.detail .bottom-btn {
  position: fixed;
  bottom: 0px;
  width: 100%;
  height: 65px;
  background: #fff;
  padding: 7.5px 13px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  border-top: 1px solid #e8ebee;
}

.detail .bottom-btn .btn {
  flex: 1 1 auto;
  background: #06bb9c;
  border-radius: 13px;
  color: #fff;
  height: 50px;
  line-height: 50px;
  margin-right: 15px;
  text-align: center;
  font-size: 17px;
  width: 102px;
}
.detail .bottom-btn .btn:first-child {
  background: #08b783;
}
.detail .bottom-btn .btn:first-child.disable{
  background: #c7f0e4;
}
.detail .bottom-btn .btn:nth-child(2) {
  background: #3ea2ff;
}
.detail .bottom-btn .btn:nth-child(2).disable{
  background: #cde5fc
}
.detail .bottom-btn .btn:last-child {
  background: #2ecbd0;
  margin-right: 0;
}
.detail .bottom-btn .btn.result{
  font-size: 15px;
}
.detail .bottom-btn .btn:last-child.disable{
  background: #c6eff1;
}
.detail .icon {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: inline-block;
  width: 19px;
  height: 19px;
}
</style>
