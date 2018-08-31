<template>
  <div class="danxuan">
    <div class="title-bar">
      <van-row>
        <van-col span="14">
          <span>{{params.qti_question_type_name|| params.name}}</span>
        </van-col>
        <van-col span="10" class="info-right">
          正确率：<span class="correct">{{correct}}</span>
        </van-col>
      </van-row>
    </div>
    <div class="wrapper">
      <div v-for="(item,key) in record" :key="key" v-if="item.students">
        <van-row class="item">
          <van-col span="4" class="tc">{{itemName(key)}}</van-col>
          <van-col span="20" class="right">
            <span class="column"  :style="{width:(item.count/count)*100+'%'}" :class="{'right-answer':key=='right','no-answer':key=='no','half':key=='half'}" @click='item.students.length>0?toggleAllCorrec(itemName(key)+"的学生",item.students):""'></span>
            <span class="column-info">{{item.count}}人</span>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>

<script>
import getStatistics from '../../axios/getQuestionStatistics.js'
import {mapState} from 'vuex'

export default {
  name: 'correctColumn',
  props: ['params'],
  data() {
    return {
      record: {
        'right': {},
        'half': {},
        'wrong': {},
        'no': {}
      },
      correctRate: 0,
      showAllCorrec: false,
      popupTitle: '',
      popupList: []
    }
  },
  created() {
    this.getinfo();
    // 脱式计算二次更改后刷新柱状图表
    window.bus.$on('getCorrectInfo', (questionId) => {
      console.log(questionId)
      if (this.params.source_pk_id === questionId) {
        this.getinfo(questionId)
      } else {
        return false
      }
    })
  },
  watch: {
    params: 'getinfo'
  },
  activated() {
  },
  computed: {
    correct() {
      if (this.correctRate === '') {
        return '--'
      } else {
        return Math.round(this.correctRate * 100) + '%'
      }
    },
    count() {
      let num = 0;
      for (let key in this.record) {
        this.record[key].count && (num += this.record[key].count)
      }
      return num
    }
  },
  methods: {
    toggleAllCorrec(title, list) {
      this.$emit('showStudentList', title, list)
    },
    itemName(key) {
      if (this.alias === 'wordorder') {
        return key === 'right' ? '答对' : (key === 'wrong' ? '答错' : (key === 'no' ? '未答' : ''))
      }
      return key === 'right' ? '全对' : (key === 'wrong' ? '全错' : (key === 'no' ? '未答' : '半对'))
    },
    getinfo(questionId) {
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
      // r.all_correct ===>   连线题、竖式题
      // r.record.allcorrect ===>   连词成句
        this.record['right'] = r.all_correct || r.record.allcorrect;
        this.record['half'] = r.all_half || r.record.halfcorrect || {};
        this.record['wrong'] = r.all_wrong || r.record.allfault;
        this.record['no'] = r.all_no_answer || r.record.noanswer;
        this.correctRate = r.correct_rate >= 0 ? r.correct_rate : r.class_average_correct_rate
      })
    }
  },
  components: {
  }
}
</script>

<style scoped>
  .danxuan {
    height: auto;
    font-size: 16px;
  }

  .danxuan>.title {
    text-align: center;
    line-height: 50px;
    height: 50px;
  }

  .danxuan>.title .back {
    display: inline-block;
    float: left;
  }

  .danxuan>.title .text {
    display: inline-block;
    width: calc(100% - 100px);
    font-weight: 600;
  }

  .danxuan>.title-bar {
    padding: 0 10px;
    line-height: 50px;
    height: 50px;
    box-sizing: border-box;
  }

  .danxuan>.title-bar .info-right {
    text-align: right;
  }

  .danxuan>.title-bar .info-right .correct {
    color: #ff4e00;
  }
   .danxuan .wrapper{
     line-height: 30px;
   }
  .danxuan .wrapper .tc{
    text-align: center;
  }
   .danxuan .wrapper .item{
     height: 40px;
   }
   .danxuan .wrapper .right{
     display: flex;
   }
  .danxuan .wrapper .column{
    display: inline-block;
    max-width: 80%;
    min-width: 5px;
    height: 30px;
    background: #f56956;
  }
  .danxuan .wrapper .column.right-answer{
    background: #34c988;
  }
   .danxuan .wrapper .column.half{
    background: #ff9600;
  }
  .danxuan .wrapper .column.no-answer{
    background:#cccdcd;
  }
  .danxuan .wrapper .column-info{
    vertical-align: middle;
    margin-left: 5px;
  }
</style>
