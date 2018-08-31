<template>
  <div id="screen-shot-answer">
    <!-- 截图发送统计和批改处理 -->
    <div class="header van-hairline--bottom">
      <span>{{params.icom_name}}</span>
      <span>正确率：<span style="color:#ff4e00">{{params.average_rate === undefined ? params.correct_rate : params.average_rate | percent}}</span></span>
    </div>
    <div class="chart">
      <div class="row" v-for="(item, index) in record" :key="index">
        <span class="name">
          <span v-if="index == 'true'">对</span>
          <span v-else-if="index == 'false'">错</span>
          <span v-else-if="index.length > 10"></span>
          <span v-else>{{index}}</span>
        </span>
        <span @click="showList(index, item)" class="line" :class="{right: index == rightAnswer, wrong: index != rightAnswer}" :style="{width: item.length / allCount * 0.75 * 100 + '%'}"></span>
        <span class="count">{{item.length}}人</span>
      </div>
    </div>
    <div class="img-wrapper">
      <img :src="imgUrl | addHttp" alt="加载中...">
    </div>
  </div>
</template>

<script>
import getStatistics from '../../axios/getQuestionStatistics.js'
import {mapState} from 'vuex'
export default {
  name: 'screenShotAnswer',
  props: ['params'],
  data() {
    return {
      record: [],
      allCount: 0,
      imgUrl: '',
      rightAnswer: ''
    }
  },
  created() {
    this.getinfo();
  },
  methods: {
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
        this.record = r.record
        for (let key in this.record) {
          this.allCount += this.record[key].length
        }
      }).then(() => {
        getStatistics.getDcom({
          dcom_id: this.params.dcom_id
        }).then(succ => {
          this.imgUrl = JSON.parse(succ.entity).imgurl
          this.rightAnswer = JSON.parse(succ.entity).answer
        })
      })
    },
    showList(key, stu) {
      let title
      if (key === 'true') {
        title = '选 对 的学生'
      } else if (key === 'false') {
        title = '选 错 的学生'
      } else if (key.length > 10) {
        title = ``
      } else {
        title = `选 ${key} 的学生`
      }
      this.$list(title, stu, () => {
        return false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#screen-shot-answer{
  width: 100%;
  height: 100%;
  .header{
    padding: 0 13px;
    display: flex;
    justify-content: space-between;
    height: 50px;
    line-height: 50px;
  }
  .chart{
    width: 100%;
    overflow: hidden;
    box-sizing: border-box;
    padding: 13px 13px;
    .row{
      width: 100%;
      height: 30px;
      line-height: 30px;
      display: flex;
      margin-bottom: 10px;
      .name{
        width: 15%;
        text-align: center;
      }
      .line{
        min-width: 5px;
        &.right{
          background-color: #34c988;
        }
        &.wrong{
          background-color: #f56956;
        }
      }
      .count{
        width: 10%;
        text-align: center;
      }
    }
  }
  .img-wrapper{
    margin-top: 20px;
    padding: 0 13px;
    box-sizing: border-box;
    img{
      width: 100%;
    }
  }
}
</style>
