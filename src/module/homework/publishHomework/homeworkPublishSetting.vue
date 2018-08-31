<template>
  <div class="cube-page cube-view button-view page" id="create-paper">
    <header class="header">
      <h1>作业发布</h1>
      <i class="cubeic-back" @click="goSummerHomework"><i class="back-up-arrow"></i></i>
    </header>

    <div>
      <van-cell-group>
        <van-field v-model="homeworkName" placeholder="请填写作业名称" label="作业名称:" icon="clear" @click-icon="homeworkName = ''"/>
        <van-cell title="开始时间" is-link :value="publishDateFormat" @click="clickShowPupUpDatePickerFun('开始时间')"/>
        <van-cell title="截止时间" is-link :value="endDateFormat" @click="clickShowPupUpDatePickerFun('截止时间')"/>
      </van-cell-group>

      <van-cell value="布置班级" />
      <!-- <div style="width: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    padding: 2.66667vw 4vw;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    line-height: 6.4vw;
    position: relative;
    background-color: #fff;
    color: #333;
    font-size: 3.73333vw;
    overflow: hidden;">布置班级</div> -->
      <van-checkbox-group v-model="result" v-bind:style="classList">
        <van-cell-group>
          <van-cell v-for="item in userInfo.classes" :title="`${item.class_name}`" :key="item.class_id" class="list">
            <van-checkbox :name="item"/>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
      <van-cell title="答案公布时间" is-link :value="answerDateFormat" @click="clickShowPupUpDatePickerFun('答案公布时间类型')"/>
    </div>

    <van-popup v-model="publishDatePickerShow" position="bottom">
      <van-datetime-picker v-if="popUpType !== '答案公布时间类型'" v-model="currentDate" type="datetime" :min-date="minDate" :max-date="maxDate" @cancel="clickCancelTimeFun" @confirm="clickConfirmTimeFun"/>
      <div v-else>
        <div class="anwerTimeType" @click="clickAnswerTimeType('1', '作业提交后')">作业提交后</div>
        <div class="anwerTimeType" @click="clickAnswerTimeType('5', '作业截止时')">作业截止时</div>
        <div class="anwerTimeType" @click="clickAnswerTimeType('4', '作业批改后')">作业批改后</div>
        <div class="anwerTimeType" @click="clickAnswerTimeType('', '自定义时间')">自定义时间</div>
        <div class="anwerTimeType" @click="clickAnswerTimeType('', '取消')">取消</div>
      </div>
    </van-popup>
    <div class="footer-container div-center"><div outline="true" class="yx-green-btn"  @click="surePublishFun">确认布置</div></div>

  </div>

</template>

<script>
import api from "@/module/homework/axios/publishHomeWork.js";
import returnRewriteVue from '../../batchEvaluate/returnRewrite/returnRewrite.vue';
export default {
  name: "homeworkPublishSetting",
  data() {
    return {
      homeworkName: this.$route.query.homeworkName || "暑假作业",
      publishDate: new Date(),
      publishDateFormat: "",
      endDateFormat: "",
      answerDateFormat: "作业提交后",
      minDate: new Date(),
      maxDate: new Date(2020, 12, 30),
      currentDate: new Date(),
      publishDatePickerShow: false,
      popUpType: "",
      answerPublishType: "1",
      viewAnswerTime: "",
      answerTimePopupShow: false,
      userInfo: {},
      result: [],
      classList: {
        "max-height": 300 + 'px',
        "scrollbar-face-color": "#ff6600",
        "overflow-y": "scroll"
      }
    };
  },
  created: function() {
  },
  mounted: function() {
    this.userInfo = this.$store.state.account.userInfo;
    this.result = this.$store.state.account.userInfo.classes;
    this.paramsData = this.$route.params;
    this.chooseSummerHomeworkArray = this.$store.state.homework.chooseSummerHomeworkArray;
    this.publishDateFormat = this.$dayjs(new Date()).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    this.endDateFormat = this.$dayjs(new Date(2018, 7, 31, 23, 59, 59)).format(
      "YYYY-MM-DD HH:mm:ss"
    );
  },
  methods: {
    goSummerHomework() {
      this.$router.back(-1);
    },
    clickShowPupUpDatePickerFun(type) {
      // if (type === '答案公布时间'){
      // this.answerTimePopupShow = true;
      // } else {
      this.publishDatePickerShow = true;
      this.popUpType = type;
      // }
    },
    clickConfirmTimeFun(date) {
      var formatTime = this.$dayjs(date).format("YYYY-MM-DD HH:mm:ss");
      console.log(formatTime)
      if (this.popUpType === "开始时间") {
        this.publishDateFormat = formatTime;
      }
      if (this.popUpType === "截止时间") {
        this.endDateFormat = formatTime;
      }
      if (this.popUpType === "答案公布时间") {
        this.answerDateFormat = formatTime;
        this.viewAnswerTime = formatTime;
      }
      this.publishDatePickerShow = false;
    },
    clickCancelTimeFun() {
      this.publishDatePickerShow = false;
    },
    clickAnswerTimeType(type, name) {
      this.publishDatePickerShow = false;
      if (name !== '取消') {
        this.answerPublishType = type;
        if (name === '自定义时间') {
          this.clickShowPupUpDatePickerFun('答案公布时间');
          // this.minDate = new Date();
        } else {
          this.answerDateFormat = name;
        }
      }
    },
    surePublishFun() {
      var self = this;
      var classIds = "";
      var array = self.result;
      var resourceId = [];
      for (let i = 0; i < array.length; i++) {
        if (i + 1 === array.length) {
          classIds += array[i].class_id;
        } else {
          classIds += array[i].class_id + ",";
        }
      }
      if (!self.$route.query.resource_ids) {
        var array2 = self.chooseSummerHomeworkArray;
        for (let i = 0; i < array2.length; i++) {
          resourceId.push({
            title: array2[i].name,
            selected_all: array2[i].selectAll,
            rids: array2[i].r_ids,
            exam_resource_id: array2[i].resource_id
          });
        }

        if (self.paramsData[0]) {
          resourceId = self.paramsData;
        }
      } else {
        resourceId = [
          {
            title: self.$route.query.homeworkName,
            selected_all: false,
            rids: [...self.$route.query.resource_ids],
            exam_resource_id: ""
          }
        ];
      }

      var regStr = /\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]/ig;
      var testStr = self.homeworkName;
      var result = testStr.replace(regStr, '[表情]');

      var data = {
        user_id: self.userInfo.userid,
        title: result,
        publish_time: self.publishDateFormat,
        deal_time: self.endDateFormat,
        class_ids: classIds,
        resource_id: JSON.stringify(resourceId),
        view_answer_time: self.viewAnswerTime,
        answer_publish_type: self.answerPublishType
      };

      if (data.view_answer_time && (self.$dayjs(data.view_answer_time).isBefore(self.$dayjs(data.publish_time)))) {
        self.$toast({
          message: "答案公布时间不可早于开始时间！",
          duration: 750
        });
        return;
      }

      if (!classIds) {
        self.$toast({
          message: "请选择布置班级！",
          duration: 750
        });
        return;
      }

      if (data.title) {
        self.$toast.loading({
          mask: true,
          message: "加载中...",
          duration: 0
        });
        api.launch(data).then(function(r) {
          self.$toast.clear();
          if (r.msg) {
            self.$toast.clear();
            self.$toast({
              message: r.msg,
              duration: 750
            });
          } else {
            // setTimeout(function() {
            self.$toast({
              message: "发布成功",
              duration: 750
            });
            self.$router.push({
              path: "/homework"
            });
            // }, 500);
          }
          self.$store.dispatch("summerHomeworkResouceId", "");
          self.$store.dispatch("hasChoosePagesArray", []);
          self.$store.dispatch("isOldPackId", "0");
          window.bus.$emit("clearWrongNote");
        });
      } else {
        self.$toast({
          message: "请填写作业名称！",
          duration: 750
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/assets/css/custom.scss";
.list {
  background-color: #f5f7f8;
}
.classList {
  max-height: 300px;
  overflow-y: scroll;
}
.activeTabClass {
  color: #2ec2a9;
}
.cover {
  position: absolute;
  bottom: calc(260px);
  top: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  -webkit-transition: all 0.2s ease-in;
  transition: all 0.2s ease-in;
  // display: none;
  z-index: 30;
}
.answerTimePopup {
  height: 260px;
  position: absolute;
  bottom: 0;
  background: #fff;
  width: 100%;
}
.anwerTimeType {
  text-align: center;
  height: 52px;
  line-height: 52px;
}
</style>
