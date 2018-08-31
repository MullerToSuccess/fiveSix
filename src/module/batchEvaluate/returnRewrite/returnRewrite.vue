<template>
  <div class="cube-page cube-view button-view">

    <header class="header">
      <h1>作业退回重做</h1>
      <i class="cubeic-back" @click="goBatchEvaluate">
        <i class="back-up-arrow"></i>
      </i>
    </header>

    <div style="background: #fff;height: 35px;line-height: 35px;padding: 5px 10px;border-bottom: 1px solid rgb(204, 204, 204);">
      <div>确认退回这<span style="color: #ff4e00;">{{chooseBatchEvaluateStudentsArray.length}}</span>个学生的作业</div>
    </div>

    <div style="background: #fff;">
      <div style="padding: 10px 10px;">延迟时间到</div>

      <div style="background: #fff;padding: 0 10px;margin-bottom: 13px;" @click="showEndTime">
        <div style="height: 35px;line-height: 35px;border: 1px solid #ccc;padding: 0 10px;">
          {{endTime}}
        </div>
      </div>

      <van-cell-group>
        <van-field v-model="comment" type="textarea" placeholder="输入评语内容" rows="3"/>
      </van-cell-group>
    </div>

    <div class="noticeWordNum">
      <div style="float: left;">还可以输入<span style="color: #f7af6c">{{50 - comment.length}}</span>字</div>
      <div style="float: right;" @click="clearTextArea">清空</div>
    </div>

    <div style="background: #fff;height: 35px;line-height: 35px;padding: 5px 10px;border-bottom: 1px solid rgb(204, 204, 204);">
      <div style="float: left;">评语模板</div>
      <div style="float: right;color: #2ec2a9;" @click="goAddComments">添加评语</div>
      <div style="float: right;color: #2ec2a9;margin-right:10px;" @click="goEditComments">编辑模板</div>
      <div style="clear: both;"></div>
    </div>

    <div style="background: #fff;">
      <div class="listContainer" v-bind:style="listContainerStyle">
        <div class="templateList" v-for="(item, index) in templateLists" :key="index" @click="chooseTemplate(item)">{{item.comment}}</div>
      </div>
    </div>

    <div class="comfirmBtnContainer">
      <div class="comfirmBtn" :outline="true" @click="sureBtn">确认退回</div>
    </div>

    <van-popup v-model="publishDatePickerShow" position="bottom">
      <van-datetime-picker v-model="currentDate" type="datetime" :min-date="minDate" :max-date="maxDate" @cancel="clickCancelTimeFun" @confirm="clickConfirmTimeFun"/>
    </van-popup>
  </div>
</template>

<script>
import api from "@/module/batchEvaluate/axios/batchEvaluate.js";

export default {
  name: "returnRewrite",
  data() {
    return {
      listContainerStyle: {
        height: window.innerHeight - 430 + "px"
      },
      rateType: "",
      comment: "",
      checkBoxGroup: [],
      templateLists: [],
      minDate: new Date(),
      maxDate: new Date(2020, 12, 30),
      currentDate: new Date(),
      publishDatePickerShow: false,
      endTime: "",
      chooseBatchEvaluateStudentsArray: 0
    };
  },
  created: function() {
  },
  activated() {
  },
  mounted: function() {
    this.endTime = this.$dayjs(
      new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    ).format("YYYY-MM-DD HH:mm:ss");
    this.comment = "";
    this.userInfo = this.$store.state.account.userInfo;
    this.chooseBatchEvaluateStudentsArray = this.$store.state.batchEvaluate.chooseBatchEvaluateStudentsArray;
    this.homeworkOneListInfoObj = this.$store.state.homeworkDetail.homeworkInfo;
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
    goAddComments() {
      this.$store.dispatch("batchEvaluateCommentsTemplateType", 3);
      this.$router.push({
        path: "/addComments"
      });
    },
    goEditComments() {
      this.$store.dispatch("batchEvaluateCommentsTemplateType", 3);
      this.$router.push({
        path: "/editComments"
      });
    },
    showEndTime() {
      this.publishDatePickerShow = true;
    },
    clickConfirmTimeFun(date) {
      var formatTime = this.$dayjs(date).format("YYYY-MM-DD HH:mm:ss");
      this.endTime = formatTime;
      this.publishDatePickerShow = false;
    },
    clickCancelTimeFun() {
      this.publishDatePickerShow = false;
    },
    getTemplateList() {
      var self = this;
      var data = {
        user_id: self.userInfo.userid,
        type: 3
      };

      api.commentplGetList(data).then(function(response) {
        self.templateLists = response;
      });
    },
    clearTextArea() {
      this.comment = "";
    },
    sureBtn() {
      var self = this;
      var array = self.chooseBatchEvaluateStudentsArray;
      var studentIds = "";

      for (let i = 0; i < array.length; i++) {
        if (i + 1 === array.length) {
          studentIds += array[i].userid;
        } else {
          studentIds += array[i].userid + ",";
        }
      }
      var data = {
        user_id: studentIds,
        publish_id: self.homeworkOneListInfoObj.course_hour_publish_id,
        teacher_id: self.userInfo.userid,
        end_time: self.endTime,
        return_reason: self.comment
      };

      api.returnRewrite(data).then(function(response) {
        self.$toast({
          message: "退回成功！",
          duration: 750
        });
        self.$router.go(-1);
      });
    },
    chooseTemplate(item) {
      this.comment += item.comment
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
