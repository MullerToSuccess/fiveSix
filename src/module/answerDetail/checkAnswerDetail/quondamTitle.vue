<template>
  <div class="page">
    <header class="header van-hairline--bottom">
      <div class="back-btn" @click="goHomework"><i class="icon-back"></i></div>
      <div class="title-name">
        查看原题
      </div>
      <div data-v-1bd7ddda="" class="right-area">
        <span data-v-1bd7ddda="" style="color: rgb(8, 184, 132);"></span>
      </div>
    </header>

    <div class="swiper-slide">
      <subjective-icom :params="item" v-if="item.icom_id == 4692 || item.icom_id == 4427 || item.icom_id == 5029"></subjective-icom>
      <render-qti v-if="Object.keys(item).length && ((item.icom_id == 4629 && item.alias != 'oraltest') || item.icom_id == 5019 || item.icom_id == 4693)" :info="item"></render-qti>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import subjectiveIcom from '../components/question/subjectiveIcom.vue'
import renderQti from '@/components/renderQti.vue'

export default {
  name: "quondamTitle",
  components: {
    subjectiveIcom,
    renderQti
  },
  data() {
    return {
      item: this.$store.state.answerDetail.studentAnswerDetailData,
      loading: false
    };
  },
  computed: {
    ...mapGetters({
      env: "runEnv/old"
    })
  },
  activated() {
  },
  methods: {
    goHomework() {
      this.$router.go(-1);
    },
    goQuondamTitle() {
      this.$router.push({
        name: "quondamTitle",
        params: {
          studentInfo: this.studentOneDetail
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.header {
  height: 45px;
  width: 100%;
  padding: 0 13px;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  .back-btn{
    display: inline-block;
    font-size: 15px;
    flex: 0 0 50px;
    // width: 50px;
    color: #4f4f50;
    line-height: 45px;
    .icon-back{
      display: inline-block;
      width: 10px;
      height: 17px;
      background: url('../../../assets/images/public/left.png') no-repeat 0 0;
      background-size: 100% 100%;
      vertical-align: text-bottom;
    }
    span{
      display: inline-block;
    }
  }
  .title-name{
    font-size: 16px;
    flex: 0 0 220px;
    text-align: center;
    line-height: 45px;
    margin-left: 20px;
    .name{
      display: inline-block;
      width: 90px;
      text-align: right;
    }
    .step{
      width: 80px;
      text-align: left;
      display: inline-block;
      vertical-align: top;
    }
  }
  .right-area{
    flex: 0 0 60px;
    line-height: 45px;
    font-size: 16px;
    text-align: right;
  }
}
.swiper-slide {
  height: calc(100% - 13vw);
  overflow-y: scroll;
}
</style>
