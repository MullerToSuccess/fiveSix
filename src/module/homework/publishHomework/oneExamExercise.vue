<template>
  <div class="cube-page cube-view button-view">
    <header class="header">
      <h1>试题详情</h1>
      <i class="cubeic-back" @click="goBack"><i class="back-up-arrow"></i></i>
      <div class="collect" @click="collectOneExam" :class="isFavorite ? 'collect-active' : 'collect-default'"></div>
      <div class="collectText" @click="goCorrect"></div>
    </header>
    <div style="overflow-y:auto;overflow-x:hidden;" v-bind:style="listContainerStyle">
      <Qti :setting="item" v-if="showItem"></Qti>
    </div>
  </div>
</template>

<script>
import api from "@/module/homework/axios/publishHomeWork.js";
import exerciseCheckBox from "@/components/common/exercise-check-box.vue";

export default {
  name: "oneExamExercise",
  components: { exerciseCheckBox },
  data() {
    return {
      setting: [],
      listContainerStyle: {
        height: window.innerHeight - 50 + 'px'
      },
      hasChoosePagesNumArray: [],
      item: {},
      showItem: false,
      isFavorite: false,
      isFavoriteRequest: false
    };
  },
  activated() {
    this.showItem = true;
    this.item = this.$store.state.homework.oneExamExercise;
    this.item.hide_result = "";
    this.userInfo = this.$store.state.account.userInfo;
    this.getIfCollectFun();
  },
  mounted() {
  },
  methods: {
    goCorrect() {
      this.$router.push({
        path: "/correction/:rsid",
        name: "correction",
        params: {
          rsid: this.item.resource_id
        }
      });
    },
    goBack() {
      this.showItem = false;
      this.$router.go(-1);
    },
    checkboxChange(item, event) {
      if (event.selecteState) {
        this.hasChoosePagesNumArray.push(item);
        this.hasChooseProblemsNum =
          parseInt(this.hasChooseProblemsNum) + parseInt(item.qti_num);
      } else {
        this.hasChoosePagesNumArray.splice(
          this.hasChoosePagesNumArray.indexOf(item),
          1
        );
        this.hasChooseProblemsNum =
          parseInt(this.hasChooseProblemsNum) - parseInt(item.qti_num);
      }
    },
    collectOneExam: function() {
      var self = this;
      var data = {
        user_id: self.userInfo.userid,
        resource_id: self.item.resource_id
      };
      if (this.isFavoriteRequest) return;
      this.isFavoriteRequest = true;
      api.favoriteUpdate(data).then(
        success => {
          self.isFavoriteRequest = false;
          self.isFavorite = success.status !== 0;
          // debugger
          // self.currentItem.is_favorite = success.status;
          if (self.isFavorite) {
            self.$toast({
              message: "收藏成功",
              duration: 750
            });
          } else {
            self.$toast({
              message: "取消收藏",
              duration: 750
            });
          }
        },
        err => {
          console.log(err);
          self.isFavoriteRequest = false;
          self.$toast("网络异常");
        }
      );
    },
    getIfCollectFun: function() {
      var self = this;
      var data = {
        user_id: self.userInfo.userid,
        resource_id: self.item.resource_id
      };
      api.getIfCollect(data).then(
        success => {
          // debugger
          self.isFavorite = success.status !== 0;
        },
        err => {
          console.log(err);
          self.isFavoriteRequest = false;
          self.$toast("网络异常");
        }
      );
    }
  },
  beforeDestroy() {
    this.showItem = false;
    console.log(this.showItem)
  }
};
</script>

<style scoped lang="scss">
@import "@/assets/css/custom.scss";
.activeTabClass {
  color: #2ec2a9;
}
.list-item .checkbox {
  width: 25px;
  height: 25px;
  right: 3px;
  top: 42px;
  border-radius: 20px;
  position: absolute;
}
.list-item .checkboxAll {
  width: 25px;
  height: 25px;
  border-radius: 20px;
}
.checkboxAll img {
  width:100%;
  height:100%
}
.bg-class {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.collect {
  display: inline-block;
  width: 24px;
  height: 24px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100% 100%;
  margin-top: 3px;
  vertical-align: text-bottom;
  margin-right: 5px;
  position: absolute;
  top: 1.5vw;
  right: 10vw;
}
.collect-active {
  background-image: url("../../../assets/images/homeworkDetail/collect.png");
}
.collect-default {
  background-image: url("../../../assets/images/homeworkDetail/collect-default.png");
}
.collectText {
  display: inline-block;
  width: 24px;
  height: 24px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100% 100%;
  margin-top: 3px;
  vertical-align: text-bottom;
  margin-right: 5px;
  position: absolute;
  top: 1.5vw;
  right: 2vw;
  background-image: url("../../../assets/images/homeworkDetail/correction-default.png");
}
</style>
