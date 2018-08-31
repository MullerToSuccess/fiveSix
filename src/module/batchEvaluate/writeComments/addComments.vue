<template>
  <div class="cube-page cube-view button-view">

    <header class="header">
      <h1>添加评语</h1>
      <i class="cubeic-back" @click="goBatchEvaluate">
        <i class="back-up-arrow"></i>
      </i>
    </header>

    <van-cell-group>
      <van-field v-model="comment" type="textarea" placeholder="输入评语内容" rows="3"/>
    </van-cell-group>

    <div class="noticeWordNum">
      <div style="float: left;">还可以输入<span style="color: #f7af6c">{{50 - comment.length}}</span>字</div>
      <div style="float: right;" @click="clearTextArea">清空</div>
    </div>

    <div class="comfirmBtnContainer">
      <div class="comfirmBtn" :outline="true" @click="addTemplateListsBtn">确认</div>
    </div>
  </div>
</template>

<script>
import api from "@/module/batchEvaluate/axios/batchEvaluate.js";

export default {
  name: "addComments",
  data() {
    return {
      listContainerStyle: {
        height: window.innerHeight - 300 + "px"
      },
      rateType: "",
      comment: "",
      checkBoxGroup: [],
      templateLists: []
    };
  },
  mounted: function() {
    this.userInfo = this.$store.state.account.userInfo;
    this.homeworkOneListInfoObj = this.$store.state.homeworkDetail.homeworkInfo;
    this.chooseBatchEvaluateStudentsArray = this.$store.state.batchEvaluate.chooseBatchEvaluateStudentsArray;
    this.batchEvaluateCommentsTemplateType = this.$store.state.batchEvaluate.batchEvaluateCommentsTemplateType;
  },
  activated() {
    this.comment = "";
  },
  watch: {
    comment: function(val, oldVal) {
      if (val.length > 50) {
        this.comment = this.comment.slice(0, 50);
      }
    }
  },
  methods: {
    goBatchEvaluate() {
      this.$router.go(-1);
    },
    addTemplateListsBtn() {
      var self = this;

      var data = {
        user_id: self.userInfo.userid,
        comment: self.comment,
        type: self.batchEvaluateCommentsTemplateType
      };

      api.commentplCreate(data).then(function(response) {
        if (self.batchEvaluateCommentsTemplateType === 3) {
          // self.$router.push({
          //   path: "/returnRewrite"
          // });
          self.$router.go(-1);
        } else if (self.batchEvaluateCommentsTemplateType === 1) {
          // self.$router.push({
          //   path: "/comments"
          // });
          self.$router.go(-1);
        } else if (self.batchEvaluateCommentsTemplateType === 2) {
          // self.$router.push({
          //   path: "/correctIdea"
          // });
          self.$router.go(-1);
        }
        self.$toast({
          message: "添加成功！",
          duration: 750
        });
      });
    },
    clearTextArea() {
      this.comment = "";
    },
    sureBtn() {

    },
    chooseTemplate(item) {
      this.comment = item.comment
    }
  }
};
</script>

<style scoped lang="scss">
$primary-color: #08b783;
$active-color: #13d098;
$border-state: 1px solid rgb(234, 237, 240);
 @import "@/style/variable.scss";
.activeTab {
  background-color: #2ec2a9;
  color: #fff;
}
.noticeWordNum {
  background: rgb(255, 255, 255);
  border-top: 1px solid rgb(204, 204, 204);
  height: 35px;
  line-height: 35px;
  padding: 5px 10px;
  color: rgb(204, 204, 204);
  margin-bottom: 10px;
}
.templateList {
  background: #fff;
  height: 35px;
  line-height: 35px;
  padding: 5px 10px;
  border-bottom: 1px solid #ccc;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.listContainer {
  padding: 0 10px;
  overflow-y: auto;
}
.comfirmBtnContainer {
  background-color: #ffffff;
  width: 100%;
  height: $bottom-height;
  bottom: 0px;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}
.comfirmBtn {
  height: 54px;
  line-height: 54px;
  width: 50%;
  border-radius: $bottom-btn-radius;
  background-color: $primary-color;
  font-size: $bottom-btn-font-size;
  text-align: center;
  color: #fff;
}
.comfirmBtn:active {
  background-color: $active-color;
}
</style>
