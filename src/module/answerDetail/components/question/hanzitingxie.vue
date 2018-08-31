<template>
  <div class="hanzitingxie">
    <div class="title-bar" v-show="type === 2">
      <van-row>
        <van-col span="6">
          <span>{{params.icom_name}}</span>
        </van-col>
        <van-col span="18" class="info-right">
          正确率：<span class="correct">{{correct}}</span>
        </van-col>
      </van-row>
    </div>
    <div class="wrapper">
      <div class="container">
        <div class="tabs" v-show="type === 2">
          <van-row>
            <van-col span="12" class="tab" :class="{active:orderName==='question'}">
              <p @click="changeTab('question')">按题目</p>
            </van-col>
            <van-col span="12" class="tab" :class="{active:orderName==='student'}">
              <p @click="changeTab('student')">按学生</p>
            </van-col>
          </van-row>
        </div>
        <group-word v-if="orderName=='question'&&params.icom_id=='5018'" :resource="resource" :user="user"></group-word>
        <calculation v-else-if="orderName=='question'&&(params.icom_id=='5011'||params.icom_id=='5013')" :resource="resource"></calculation>
        <question v-else-if="orderName=='question'" :resource="resource" @go2IcomDetail="go2IcomDetail"></question>
        <student v-if="orderName=='student'" :user="user" :columnData="columnData"></student>
      </div>
    </div>
  </div>
</template>

<script>
import getStatistics from '../../axios/getQuestionStatistics.js'
import question from '../common/questionTable.vue'
import groupWord from '../common/groupWord.vue'
import calculation from '../common/calculation.vue'
import student from '../common/studentTable.vue'
import {mapMutations} from 'vuex'
// import {mapState} from 'vuex'

export default {
  name: 'hanzitingxie',
  props: ['params', 'type'],
  data() {
    return {
      allCorrect: {},
      resource: [],
      user: [],
      orderName: 'question',
      sortNum: 0,
      correctRate: 0,
      ordertype: 'column',
      columnData: []
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
      if (this.correctRate === '' || this.params.average_rate === '') {
        return '--'
      } else {
        return Math.round((this.correctRate || this.params.average_rate) * 100) + '%'
      }
    }
  },
  methods: {
    ...mapMutations({
      setIcomDetail: 'answerDetail/setIcomDetail'
    }),
    changeTab(name) {
      this.orderName = name
    },
    itemCorrect(correct) {
      if (correct === '' || correct === -1) {
        return '--'
      } else {
        return Math.round(correct * 100) + '%'
      }
    },
    getinfo() {
      let param = {
        "publish_id": this.params.course_hour_publish_id,
        "course_resource_id": this.params.course_resource_id,
        'icom_id': this.params.icom_id,
        'dcom_entity_id': this.params.dcom_entity_id,
        'h': 1
      }
      getStatistics.getinfo(param).then((r) => {
        this.allCorrect = r.all_correct;
        this.resource = r.resource;
        this.user = r.user;
        this.columnData = r.clumn
      })
    },
    // 跳转组件选项详情
    go2IcomDetail(item, index) {
      let result = []
      this.resource.filter(ele => {
        let r = {}
        r['title'] = ele[0]
        r['percent'] = ele[1]
        r['users'] = []
        result.push(r)
      })
      this.user.filter((ele) => {
        if (Object.keys(ele.answer).length > 0) {
          // console.log(11111, ele.answer.items[index])
          let val = ele.answer.items
          val.filter((v, r) => {
            let c = {}
            c['name'] = ele.real_name
            // 字母书写
            if (this.params.icom_id === 5001) {
              c['result'] = v[1] * 5
            } else if (this.params.icom_id === 508) { // 成功营救
              c['result'] = v[2]
            }
            result[r]['users'].push(c)
          })
        }
      })
      this.setIcomDetail(result)
      this.$router.push({
        path: '/icomDetail/' + index + '/' + this.params.icom_id
      })
    }
  },
  components: {
    student, question, groupWord, calculation
  }
}
</script>

<style scoped>
  .hanzitingxie {
    height: auto;
    background: #f8f8f8;
  }

  .hanzitingxie>.title {
    text-align: center;
    line-height: 50px;
    height: 50px;
    background: #fff;
  }

  .hanzitingxie>.title .back {
    display: inline-block;
    float: left;
  }

  .hanzitingxie>.title .text {
    display: inline-block;
    width: calc(100% - 100px);
    font-weight: 600;
  }

  .hanzitingxie>.title-bar {
    padding: 0 10px;
    line-height: 50px;
    height: 50px;
    box-sizing: border-box;
  }

  .hanzitingxie>.title-bar .info-right {
    text-align: right;
  }

  .hanzitingxie>.title-bar .info-right .correct {
    color: #ff4e00;
  }

  .hanzitingxie .wrapper {
    line-height: 50px;
    height: calc(100% - 100px);
  }

  .hanzitingxie .wrapper>.container {
    background: #fff;
    text-align: center;
    height: 100%;
  }

  .hanzitingxie .wrapper>.container .tabs {
    height: 50px;
    line-height: 48px;
  }

  .hanzitingxie .wrapper>.container .tabs .tab {
    border-bottom: 2px solid #e2e2e2;
  }

  .hanzitingxie .wrapper>.container .tabs .tab.active {
    border-bottom: 2px solid #34c988;
  }
</style>
