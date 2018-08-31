<template>
  <div class="cube-page cube-view button-view">

    <header class="header">
      <h1>编辑模板</h1>
      <i class="cubeic-back" @click="goBatchEvaluate">
        <i class="back-up-arrow"></i>
      </i>
    </header>

    <div style="background: #fff;">
      <div class="listContainer" v-bind:style="listContainerStyle">
        <div class="listContainerDiv" v-for="(item, index) in templateLists" :key="index" @click="chooseTemplate(item)">
          <div class="templateList">{{item.comment}}</div>
          <span style="float: right;width: 5%;" @click="deleteCommentsTemplateFun(item)">
            <i class="fa fa-times" v-if="item.custom == 1"></i>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/module/batchEvaluate/axios/batchEvaluate.js";

export default {
  name: "editComments",
  data() {
    return {
      listContainerStyle: {
        height: window.innerHeight - 50 + "px"
      },
      rateType: "",
      comment: "",
      checkBoxGroup: [],
      templateLists: []
    };
  },
  mounted: function() {
    this.userInfo = this.$store.state.account.userInfo;
    this.batchEvaluateCommentsTemplateType = this.$store.state.batchEvaluate.batchEvaluateCommentsTemplateType;
    this.getTemplateList();
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
    writeComments() {
      if (this.checkBoxGroup.length === 0) {
        this.$toast({
          message: "请选择学生！",
          duration: 750
        });
        return;
      }
      this.$store.dispatch(
        "chooseBatchEvaluateStudentsArray",
        this.checkBoxGroup
      );
      this.$router.push({
        path: "/comments"
      });
    },
    deleteCommentsTemplateFun(item) {
      var self = this;
      var data = {
        user_id: self.userInfo.userid,
        id: item.id
      };

      api.commentplRemove(data).then(function(response) {
        self.templateLists = response;
        self.getTemplateList();
      });
    },
    getTemplateList() {
      var self = this;
      var data = {
        user_id: self.userInfo.userid,
        type: self.batchEvaluateCommentsTemplateType
      };

      api.commentplGetList(data).then(function(response) {
        self.templateLists = response;
      });
    },
    clearTextArea() {
      this.comment = "";
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
.listContainerDiv {
  border-bottom: 1px solid #ccc;
  height: 35px;
  line-height: 35px;
  padding: 5px 0px 5px 10px;
}
.activeTab {
  background-color: #2ec2a9;
  color: #fff;
}
.noticeWordNum {
  background: rgb(255, 255, 255);
  border-top: 1px solid rgb(204, 204, 204);
  height: 35px;
  line-height: 35px;
  // padding: 5px 10px;
  color: rgb(204, 204, 204);
  margin-bottom: 10px;
}
.templateList {
  width: 90%;
  background: #fff;
  // padding: 5px 10px;
  float: left;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.listContainer {
  padding: 0 10px;
  overflow-y: auto;
}
</style>
