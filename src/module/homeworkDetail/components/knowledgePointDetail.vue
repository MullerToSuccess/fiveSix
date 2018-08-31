<template>
  <div id="knowledge-point-detail" class="page">
    <header-bar @back="goBack">
      <div slot="title-name">{{$route.params.kp_name}}</div>
    </header-bar>
    <div class="content">
      <div class="percent-wrapper van-hairline--bottom">
        <div class="percent-item">
          <span class="name">正确率</span>
          <span class="percent red">{{$route.params.correct_rate ? $route.params.correct_rate : 0 | percent}}</span>
        </div>
        <div class="percent-item">
          <span class="name">题数</span>
          <span class="percent black">{{$route.params.qti_count ? $route.params.qti_count : 0}}</span>
        </div>
      </div>
      <div class="list">
        <div class="list-title">
          <div class="list-row">
            <div class="list-cell left">序号</div>
            <div class="list-cell question-content left">题目</div>
            <div class="list-cell">正确率</div>
          </div>
        </div>
        <div class="list-body">
          <div class="list-row van-hairline--bottom" v-for="(item, index) in qtiList" :key="index" @click="linkTo(index)">
            <div class="list-cell left">{{index + 1}}</div>
            <div class="list-cell left question-content ellipsis">
              <span class="type">[{{item.name}}]</span>
              <span v-html="item.title"></span>
            </div>
            <div class="list-cell">{{item.class_avg_rate | percent}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import headerBar from '@/components/headerBar'
import api from '@/module/homeworkDetail/axios/detail'
import {mapMutations} from 'vuex'
export default {
  name: 'knowledgePointDetail',
  data() {
    return {
      qtiList: []
    }
  },
  mounted() {
    this.getResource()
  },
  activated() {
    this.getResource()
  },
  methods: {
    ...mapMutations({
      setAnswerParams: 'answerDetail/setTongjiParams',
      setAnswerResource: 'answerDetail/setTongjiResource'
    }),
    goBack() {
      this.$router.back(-1)
    },
    getResource() {
      api.getQtiListByKp({
        publish_id: this.$route.params.publishId,
        kp_id: this.$route.params.kp_id
      }).then(succ => {
        this.qtiList = succ
      })
    },
    linkTo(index) {
      this.setAnswerParams({
        index: index,
        title: `试题详情`,
        type: 1
      })
      this.setAnswerResource([...this.qtiList])
      this.$router.push({path: '/tongji'})
    }
  },
  components: {
    headerBar
  }
}
</script>
<style lang="scss" scoped>
#knowledge-point-detail{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  .content{
    height: calc(100% - 45px);
    overflow-y: scroll;
    .percent-wrapper{
      width: 100%;
      height: 80px;
      overflow: hidden;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      font-size: 15px;
      .percent-item{
        flex: 1;
        display: inline-flex;
        flex-direction: column;
        text-align: center;
        .name{
          height: 24px;
          line-height: 24px;
          color: #7f8284;
        }
        .percent{
          height: 24px;
          line-height: 24px;
          &.red{
            color: #fc5363;
          }
          &.black{
            color: #1e1e1e;
          }
        }
      }
    }
    .list{
      padding: 0 13px;
      font-size: 16px;
      .list-title{
        color: #848484
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
  }
}
</style>
