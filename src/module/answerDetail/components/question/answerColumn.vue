·<template>
  <div class="danxuan">
    <div class="title-bar">
      <van-row>
        <van-col span="8">
          <span v-if="type === 'qti'">{{ params.icom_id == 4693?'投票':(params.qti_question_type_name||params.name)}}</span>
          <span v-if="type === 'icom'">{{params.content}}</span>
          <span v-if="type === 'icom' && params.content.question">
            <span>{{params.content.question.replace('_', '')}}<span style="border-bottom: 1px solid red">{{params.content.right_answer}}</span></span>
          </span>
        </van-col>
        <van-col span="16" class="info-right" v-if="params.icom_id != 4693">
          正确率：<span class="correct" v-if="type === 'qti'">{{correct}}</span>
          <span class="correct" v-if="type === 'icom'">{{Math.round(params.correct_rate * 100)}}%</span>
        </van-col>
        <van-col span="8" v-if="params.icom_id == 4693">
          <span style="color:#34c988">{{user['1'].length}}</span>
          <span>人已投票</span>
        </van-col>
        <van-col span="8" style="text-align:center" v-if="params.icom_id == 4693">
          <span style="color:#ff4e00">{{user['0'].length}}</span>
          <span>人未投票</span>
        </van-col>
      </van-row>
    </div>
    <div class="wrapper">
      <div v-if="type === 'qti'" v-for="(item,key) in record" :key="key">
        <van-row class="item">
          <van-col span="4" class="tc name">
            {{alias==='sort'?item.alias:itemName(key)}}
          </van-col>
          <van-col span="20" class="right">
            <!-- 截图发送柱状图 -->
            <span class="column right-answer" v-if="params.icom_id==5005"
                  :style="{width:(item.length/count)*100+'%'}"
                  @click="toggleAllCorrec('选 ' + key + ' 的学生' ,item)">
            </span>
            <span class="column" v-else
            :style="{width:((item.count === undefined ? item.length : item.count)/count)*100+'%'}"
            :class="{
              'right-answer':key==answer || (alias==='sort'&&(item.alias===answer.alias)) || Number(params.icom_id) === 4693,
              'half':item.correct_type&&item.correct_type===3,
              'noanswer':key=='noanswer'}"
              @click='!item.user ? (item.students.length > 0 ? toggleAllCorrec((itemName(key) === "未答" ? "" : "选") + (item.alias || itemName(key)) + "的学生", item.students) : "") : (item.user.length > 0 ? toggleAllCorrec("选" + $el.querySelectorAll(".name")[key].innerHTML + "的学生", item.user) : "")'>
            </span>
            <!-- 截图发送 -->
            <span v-if="params.icom_id == 5005" class="column-info">{{item.length}}人</span>
            <span v-else class="column-info">{{item.count}}人</span>
          </van-col>
        </van-row>
      </div>
      <!-- 组件的统计图 -->
      <div v-if="type === 'icom' && params.right && params.wrong && params.none">
        <van-row class="item">
          <van-col span="4" class="tc">
            正确
          </van-col>
          <van-col span="20" class="right">
            <span class="column right-answer"  :style="{width:(params.right.length/(params.right.length + params.wrong.length + params.none.length))*100+'%'}" @click='params.right.length>0?toggleAllCorrec("正确的学生", params.right):""'></span>
            <span class="column-info">{{params.right.length}}人</span>
          </van-col>
        </van-row>
        <van-row class="item">
          <van-col span="4" class="tc">
            错误
          </van-col>
          <van-col span="20" class="right">
            <span class="column"  :style="{width:(params.wrong.length/(params.right.length + params.wrong.length + params.none.length))*100+'%'}" @click='params.wrong.length>0?toggleAllCorrec("正确的学生", params.wrong):""'></span>
            <span class="column-info">{{params.wrong.length}}人</span>
          </van-col>
        </van-row>
        <van-row class="item">
          <van-col span="4" class="tc">
            未答
          </van-col>
          <van-col span="20" class="right">
            <span class="column right-answer"  :style="{width:(params.none.length/(params.right.length + params.wrong.length + params.none.length))*100+'%'}" @click='params.none.length>0?toggleAllCorrec("正确的学生", params.none):""'></span>
            <span class="column-info">{{params.none.length}}人</span>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>

<script>
import getStatistics from '../../axios/getQuestionStatistics.js'
export default {
  name: 'answerColumn',
  props: ['params', 'type'],
  data() {
    return {
      allCorrect: {},
      record: [],
      answer: '',
      alias: '',
      user: null, // 投票储存用户数据
      loading: true,
      correctRate: 0,
      showAllCorrec: false,
      popupTitle: '',
      popupList: []
    }
  },
  mounted() {
    if (this.type === 'qti') {
      this.getinfo();
    }
  },
  watch: {
    params () {
      if (this.type === 'qti') {
        this.getinfo()
      }
    }
    // params: 'getinfo'
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
        var m;
        if (this.record[key].count >= 0) {
          m = this.record[key].count
        } else {
          m = this.record[key].length
        }
        num += m
      }
      return num
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
        this.allCorrect = r.all_correct
        this.record = r.record
        this.user = r.user
        this.answer = r.answer
        this.correctRate = r.correct_rate
        this.alias = r.alias
        this.loading = false
        this.record = r.record
      })
    },
    itemName(key) {
      if (key === "T") {
        return '√'
      } else if (key === 'F') {
        return '×'
      } else if (key === 'noanswer') {
        return '未答'
      } else if (Number(this.params.icom_id) === 4693) {
        return "项" + (key + 1)
      } else {
        return key
      }
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
  .danxuan .wrapper .column.noanswer{
    background:#cccdcd
  }
  .danxuan .wrapper .column-info{
    vertical-align: middle;
    margin-left: 5px;
  }
</style>
