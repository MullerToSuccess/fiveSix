<template>
  <div class="kgtk">
    <div class="title-bar">
      <van-row>
        <van-col span="8">
          <span>{{params.qti_question_type_name||params.name}}</span>
        </van-col>
        <van-col span="16" class="info-right">
          正确率：<span class="correct">{{correct}}</span>
           <span @click="allCorrect.count>0?toggleAllCorrec('全对的学生',allCorrect.students):''"> 全对：{{allCorrect.count}}人</span>
        </van-col>
      </van-row>
    </div>
    <div class="statlist">
      <van-row class="question-item" :class="index==0?'van-hairline--surround':'van-hairline--bottom van-hairline--left van-hairline--right'" v-for="(item,index) in  record" :key="index">
        <van-col span="6" class="num van-hairline--right">({{index+1}})</van-col>
        <van-col span="6" class="right van-hairline--right">
          <p @click="item.record.right.count>0?toggleAllCorrec('答对的学生',item.record.right.students):''">
            <span>{{item.record.right.count}}</span><br/>
            <span>答对</span>
          </p>
        </van-col>
        <van-col span="6" class="wrong van-hairline--right">
          <p @click="item.record.wrong.count>0?toggleAllCorrec('答错的学生',item.record.wrong.students):''">
            <span>{{item.record.wrong.count}}</span><br/><span>答错</span>
          </p>
        </van-col>
        <van-col span="6" class="unanswered">
          <p @click="item.record.noanswer.count>0?toggleAllCorrec('未答的学生',item.record.noanswer.students):''">
            <span>{{item.record.noanswer?item.record.noanswer.count:0}}</span><br/><span>未答</span>
          </p>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
import getStatistics from '../../axios/getQuestionStatistics.js'
// import {mapState} from 'vuex'

export default {
  name: 'correctTable',
  props: ['params'],
  data() {
    return {
      allCorrect: {},
      record: [],
      alias: '',
      correctRate: '',
      showAllCorrec: false,
      popupTitle: '',
      popupList: []
    }
  },
  created() {
    this.getinfo();
  },
  // watch: {
  //   params: 'getinfo'
  // },
  activated() {
  },
  computed: {
    correct() {
      if (this.correctRate === '') {
        return '--'
      } else {
        return Math.round(this.correctRate * 100) + '%'
      }
    }
  },
  methods: {
    toggleAllCorrec(title, list) {
      this.$emit('showStudentList', title, list)
    },
    getinfo() {
      let param = {
        "publish_id": this.params.course_hour_publish_id,
        "course_resource_id": this.params.course_resource_id,
        "dcom_entity_id": this.params.dcom_entity_id ? this.params.dcom_entity_id : 0,
        'icom_id': this.params.icom_id,
        "qti_question_id": this.params.source_pk_id,
        "qti_question_sheet": this.params.icom_id === 5019 ? 1 : 0,
        'h': 1
      }
      getStatistics.getinfo(param).then((r) => {
        this.allCorrect = r.all_correct;
        this.record = r.record;
        this.alias = r.alias;
        this.correctRate = r.correct_rate;
      })
    }
  },
  components: {
  }
}
</script>

<style scoped>
  .kgtk {
    height: auto;
    color:#1e1e1e;
    font-size: 16px;
  }

  .kgtk>.title {
    text-align: center;
    line-height: 50px;
    height: 50px;
  }

  .kgtk>.title .back {
    display: inline-block;
  }

  .kgtk>.title .text {
    display: inline-block;
    width: calc(100% - 100px);
    font-weight: 600;
  }

  .kgtk>.title-bar {
    padding: 0 13px;
    line-height: 50px;
    height: 50px;
    box-sizing: border-box;
  }

  .kgtk>.title-bar .info-right {
    text-align: right;
  }

  .kgtk>.title-bar .info-right .correct {
    color: #ff4e00;
  }

  .kgtk>.statlist {
    padding: 0 13px;
    line-height: 60px;
    text-align: center;
  }
.kgtk>.statlist p{
  line-height: 30px;
}
  .kgtk>.statlist>.question-item {
    height: 60px;
  }

  .kgtk>.statlist>.question-item .right {
    background: #afe9d0;
  }
</style>
