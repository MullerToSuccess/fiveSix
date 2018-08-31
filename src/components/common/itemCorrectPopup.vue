<template>
<!-- 接收参数 发布ID：publishId、课时资源ID:resourceId、试题ID：questionId、实体ID：entityId-->
<!-- 接收函数  关闭弹出框：toggle   回调函数：callback -->
<van-popup
  v-model="correct"
  class="tip-popup"
>
  <div class="tip-container">
    <p @click="toggle" style="text-align:right">
       <i class="icon"></i>
    </p>
      <van-row class="title">
        <van-col span="24">
          <p>
            以下操作针对本题中的待批改题目
          </p>
        </van-col>
      </van-row>
    <div class="tip-content">
      <p @click="commit(1)">
        标记为已阅
      </p>
      <p @click="commit(2)" v-if="!hideMutual">
        采用学生互评分数
      </p>
    </div>
    <!-- <div class="warm" v-if="!hideMutual">
      *一键批改后，后面新增学生评分将不被计算在内
    </div> -->
  </div>
  </van-popup>
</template>

<script>
import API from '@/axios/_api'
import { Toast } from 'vant'
export default {
  name: 'itemCorrect',
  props: ['publishId', 'resourceId', 'questionId', 'entityId', 'hideMutual'],
  data() {
    return {
      correct: true,
      teacherId: JSON.parse(localStorage.userinfo).userid
    }
  },
  mounted() {},
  methods: {
    toggle() {
      this.$emit('toggle')
    },
    commit(type) {
      let params = {
        publish_id: this.publishId,
        course_resource_id: this.resourceId,
        qti_question_id: this.questionId,
        dcom_entity_id: this.entityId,
        teacher_id: this.teacherId,
        type: type
      }
      let api = new API();
      api.fetch('/jwt/homework/correct/batchMarkForMinRs', params, {"authJwt": true}).then((r) => {
        if (r.hasNoComment) {
          Toast('有学生作业没有互评！')
          this.toggle()
          return false
        }
        this.$emit('callback');
        this.toggle()
      })
    }
  }
}
</script>

<style scoped>
.tip-popup {
    width: calc(100vw - 85px);
    border-radius: 10px;
    padding:15px;
    box-sizing: border-box;;
  }
.tip-container>.title {
    line-height: 38px;
    text-align: center;
    font-weight: 400;
    font-size: 16px;
    margin-bottom: 10px;
  }

.tip-container>.tip-content {
    text-align: center;
  }
.tip-container>.tip-content>p {
    line-height: 50px;
    margin-bottom: 15px;
    border:1px solid #08b783;
    color:#08b783;
    border-radius: 13px;
  }
  p .icon{
    display: inline-block;
    width:14px;
    height: 14px;
    background: url('../../assets/images/public/close.png') center center;
    background-size:100% 100%;
  }
  .tip-container .warm{
    font-size: 14px;
    text-align: center;
    padding-bottom: 20px;
    text-align: left;
    line-height: 20px;
  }
</style>
