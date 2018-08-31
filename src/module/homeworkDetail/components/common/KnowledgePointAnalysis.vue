<template>
  <div id="knowledge-point-analysis">
    <div class="list" v-if="kpList.length">
      <div class="list-title">
        <div class="list-row">
          <div class="list-cell question-content left">知识点</div>
          <div class="list-cell">题目数</div>
          <div class="list-cell">正确率</div>
        </div>
      </div>
      <div class="list-body">
        <div class="list-row van-hairline--bottom" v-for="(item, index) in kpList" :key="index" @click="linkTo(item)">
          <div class="list-cell left question-content ellipsis">
            <span class="type">{{item.kp_name}}</span>
          </div>
          <div class="list-cell">{{item.qti_count}}</div>
          <div class="list-cell">{{item.class_right_rate | percent}}</div>
          <div class="arrow">
            <i class="fa fa-angle-right"></i>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="no-data">
      <div class="no-data-img"></div>
      <span style="color:#c8c8c8;font-weight:600;margin-bottom:10px;">无知识点正确率相关数据~</span>
    </div>
  </div>
</template>
<script>
// 知识点分析
import api from '@/module/homeworkDetail/axios/detail'
export default {
  name: 'knowledgePointAnalysis',
  props: ['publishId'],
  data() {
    return {
      kpList: []
    }
  },
  computed: {
    imgUrl() {
      return require('@/assets/images/homeworkDetail/no-data.png')
    }
  },
  mounted() {
    api.kp({
      publish_id: this.publishId
    }).then(succ => {
      this.kpList = succ
    })
  },
  methods: {
    linkTo(item) {
      console.log(item)
      this.$router.push({path: `/knowledgePointDetail/${this.publishId}/${item.kp_id}/${item.qti_count}/${item.class_right_rate}/${item.kp_name}`})
    }
  }
}
</script>
<style lang="scss" scoped>
#knowledge-point-analysis{
  width: 100%;
  height: 100%;
  .list{
    padding: 0 13px;
    font-size: 16px;
    .list-title{
      color: #848484;
    }
    .list-body{
      color: #1e1e1e;
    }
    .list-row{
      display: flex;
      height: 45px;
      line-height: 45px;
    }
    .list-cell{
      flex: 1;
      text-align: center;
      &.question-content{
        flex: 2.5;
        padding: 0 5px;
      }
      &.left{
        text-align: left;
      }
    }
  }
  .type{
    color: #4d4d4d
  }
  .no-data{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    padding: 0 26px;
    text-align: center;
    .no-data-img{
      width: 100px;
      height: 130px;
      background: url(../../../../assets/images/homeworkDetail/no-data.png) no-repeat 0 0;
      background-size: cover;
    }

  }
}
</style>
