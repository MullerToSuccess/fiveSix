<template>
  <div id="new-qti" >
    <Qti :setting="newSetting"></Qti>
    <div class="score-group">
      <div v-for="(answer,index) in answerDetail.answer" :key="index" v-if="JSON.parse(answer.answer).length"  @click="changeScore(index)">
        <div class="score" :class="{right:answer.is_correct==1,wrong:answer.is_correct!=1}"></div>
      </div>
    </div>
    <div class="correct">
      <span>{{correct}}</span>
    </div>
  </div>
</template>
<script>
import api from "@/module/answerDetail/axios/checkAnswerDetail.js";
export default {
  name: 'RenderQtiNew',
  props: {
    // 取学习记录需要传对应的学生id 显示正确答案user_id = 0
    user_id: {
      default: '0'
    },
    info: {
      type: Object
    }
  },
  data() {
    return {
      answerDetail: {},
      correct: 0
    }
  },
  computed: {
    newSetting() {
      return {
        // domain: "e.dev.anoah.com",
        // qid: "9002511508374200001",
        // publish_id: "bd9002511511407200001f",
        // course_resource_id: "9002511508374200001",
        // num: -1,
        // caller: "PREVIEWOR",
        // user_id: "33536",
        // dcom_entity_id: "",
        // resource_type: "qti_question",
        domain: window.bus.$store.getters['runEnv/old'],
        qid: this.info.source_pk_id,
        publish_id: this.info.course_hour_publish_id,
        course_resource_id: this.info.course_resource_id,
        num: -1,
        caller: 'PREVIEWOR',
        user_id: this.user_id,
        dcom_entity_id: this.info.dcom_entity_id,
        resource_type: this.info.resource_type,
        hide_result: 1
      }
    }
  },
  created() {
    this.getData();
  },
  mounted () {
    this.$nextTick(() => {
      setTimeout(() => {
        // 设置正确率容器高度和top值
        let height = $('.qtivue').height();
        let top = $('.qti_body')[0].clientHeight + 2;
        $('.score-group').height(height);
        $('.score-group').css({
          'padding-top': top + 'px'
        })
        // 增加番号、设置步骤正确率高度
        for (let i = 0; i < this.answerDetail.answer.length; i++) {
          if (JSON.parse(this.answerDetail.answer[i].answer).length > 0) {
            // let div2 = `<span class="num">${i + 1}、</span>`;
            let height = $('.iminputdiv .row').eq(i).height() + 2;
            // $('.iminputdiv .row').eq(i).prepend(div2);
            $('.score-group>div').eq(i).css({
              height: height + 'px'
            });
          }
        }
      }, 800)
    })
  },
  methods: {
    getData() {
      var data = {
        publish_id: this.info.course_hour_publish_id,
        course_resource_id: this.info.course_resource_id,
        dcom_entity_id: this.info.dcom_entity_id,
        source_pk_id: this.info.source_pk_id,
        user_id: this.user_id,
        icom_id: this.info.icom_id,
        dcom_id: this.info.dcom_id
      };
      // 获取答案步骤及正确率
      api.getUserAnswerForMiniRs(data).then((r) => {
        this.answerDetail = r
        this.correct = parseInt(r.correct_rate * 100) + '%'
      })
    },
    changeScore(index) { // 修改正确率
      // 只有当改步骤前一步正确的情况下才能修改正确率
      if (index === 0 || (this.answerDetail.answer[index - 1] && parseInt(this.answerDetail.answer[index - 1].is_correct) === 1)) {
        // 修改的正确率
        let correct = 0;
        if (parseInt(this.answerDetail.answer[index].is_correct) === 1) {
          correct = 0
        } else {
          correct = 1
        }
        // 接口参数
        let params = {
          publish_id: this.info.course_hour_publish_id,
          course_resource_id: this.info.course_resource_id,
          qti_question_id: this.info.qti_question_id,
          student_id: this.user_id,
          correct_rate: correct,
          teacher_id: JSON.parse(localStorage['userinfo']).userid,
          sequence: parseInt(this.answerDetail.answer[index].sequence) + 1
        }
        api.setScore(params).then(r => {
          // 修改该学生本题的正确率
          this.answerDetail.correct_rate = r.question_correct_rate
          this.correct = parseInt(this.answerDetail.correct_rate * 100) + '%'
          if (parseInt(this.answerDetail.answer[index].is_correct) === 1) { // 正确====>错误
            this.answerDetail.answer[index].is_correct = 0
            $('.iminputdiv .row').eq(index).removeClass('green').addClass('red')
            // 之后的题全部改为错误
            for (let i = index; i < this.answerDetail.answer.length; i++) {
              this.answerDetail.answer[i].is_correct = 0
              $('.iminputdiv .row').eq(i).removeClass('green').addClass('red')
            }
          } else { // 错误===》正确
            this.answerDetail.answer[index].is_correct = 1
            $('.iminputdiv .row').eq(index).removeClass('red').addClass('green')
          }
          // 修改柱状图表
          window.bus.$emit('getCorrectInfo', this.info.qti_question_id)
          // 修改小资源正确率
          window.bus.$emit('getCorrentMiniRS', this.info.course_hour_publish_id, this.info.course_resource_id, this.info.dcom_entity_id)
          // 修改作业正确率
          window.bus.$emit('getHomeworkInfo', this.$route.query.classId, this.info.course_hour_publish_id)
        })
      } else {
        return false
      }
    }
  }
}
</script>
<style lang="scss">
#new-qti  {
  // padding:0 13px;
  position: relative;
  .qtivue {
    box-sizing: border-box;
    div.qti_question {
      .qti_options{
        margin-top:0px;
      .iminputdiv {
        width:calc(100% - 40px);
        border: none;
        padding-left: 0;
        .row{
          position: relative;
          min-height:6vh;
          border:1px solid #badeff;
          margin-bottom: 10px;
          box-sizing: border-box;
          .num{
            color:#1e1e1e
          }
        }
      }
      }
    }
  }
  .score-group{
    position: absolute;
    left:13px;
    box-sizing: border-box;
    top:0;
    width:calc(100% - 26px);
    height: 135px;
    padding-top: 68px;
    &>div{
      width: 100%;
      position: relative;
      margin-bottom: 11px;
      .score{
        color:#1e1e1e;
        position: absolute;
        top:50%;
        right: 0;
        transform: translateY(-50%);
        width:28px;
        height: 28px;
        vertical-align: middle;
        background-repeat:no-repeat;
        background-size: 100% 100%;
        background-position: center center;
        &.right{
          background-image: url('../assets/images/public/right-default.png');
        }
        &.wrong{
          background-image: url('../assets/images/public/wrong-default.png');
        }
      }
    }
  }
  .correct{
    height:70px;
    width:100%;
    position: fixed;
    bottom:0;
    text-align: center;
    border-top:1px solid #e8ebee;
    box-sizing: border-box;
    padding-top:10px;
    background-color: #fff;
    span{
      display: inline-block;
      height: 50px;
      line-height: 50px;
      width:50px;
      border-radius: 50%;
      border:1px solid #e8ebee;
    }
  }
}
#new-qti .qtivue  div.qti_question .qti_options>.line,
#new-qti .qtivue  div.qti_question div.qti_typediff{
  display: none;
}
</style>
