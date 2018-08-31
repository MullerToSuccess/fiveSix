<template>
  <div class="wanxing">
    <div class="title-bar">
      <van-row>
        <van-col span="6">
          <span>{{params.qti_question_type_name || params.name}}</span>
        </van-col>
        <van-col span="18" class="info-right">
          正确率：<span class="correct">{{correct}}</span> <span @click="allCorrect.count>0?toggleAllCorrec('全对的学生',allCorrect.students):''"> 全对：{{allCorrect.count}}人</span>
        </van-col>
      </van-row>
    </div>
    <div class="statlist">
      <div class="quelist" v-for="(que,index) in record" :key="index">
        <span>({{index+1}})</span>
        <span v-for="(item,key) in que.record" :key="key" v-if="key!=='noanswer'" :class="{right:key==que.answer}" @click="item.count>0?toggleAllCorrec('选'+key+'的学生',item.students):''">
          {{item.count}}<br>{{key}}
        </span>
        <span @click="que.record.noanswer.count>0?toggleAllCorrec('未答的学生',que.record.noanswer.students):''">
          {{que.record.noanswer?que.record.noanswer.count:'0'}}
          <br>未答
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import getStatistics from '../../axios/getQuestionStatistics.js'
// import {mapState} from 'vuex'
export default {
  name: 'choiceTable',
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
    }
    // ...mapState({
    //   'params': (state) => state.homeworkDetail.params
    // })
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
  .wanxing {
    height: auto;
    font-size: 16px;
  }

  .wanxing>.title {
    text-align: center;
    line-height: 50px;
    height: 50px;
  }

  .wanxing>.title .back {
    display: inline-block;
    float: left;
  }

  .wanxing>.title .text {
    display: inline-block;
    width: calc(100% - 100px);
    font-weight: 600;
  }

  .wanxing>.title-bar {
    padding: 0 10px;
    line-height: 50px;
    height: 50px;
    box-sizing: border-box;
  }

  .wanxing>.title-bar .info-right {
    text-align: right;
  }

  .wanxing>.title-bar .info-right .correct {
    color: #ff4e00;
  }

  .wanxing>.statlist {
    /* height: calc(100vh - 100px); */
    line-height: 40px;
    text-align: center;
    /* overflow: scroll; */
  }
.wanxing>.statlist .quelist{
  display: flex;
  border:1px solid #eaeaea;
  border-bottom: none;
}
.wanxing>.statlist .quelist:last-child{
  border-bottom: 1px solid #eaeaea;
}
.wanxing>.statlist .quelist span{
  width:80px;
  flex: 1 1 auto;
  border-right: 1px solid #eaeaea;
  line-height: 20px;
  padding:5px 0;
}
.wanxing>.statlist .quelist span.right{
  background:#afe9d0
}
.wanxing>.statlist .quelist span:first-child{
  line-height: 40px;
}
.wanxing>.statlist .quelist span:last-child{
  border-right: none;
}
</style>
