<template>
  <div class="cube-page cube-view button-view page">

    <header class="header">
      <h1>批量评价</h1>
      <i class="cubeic-back" @click="goHomework">
        <i class="back-up-arrow"></i>
      </i>
    </header>

    <div class="backgroundColor">
      <div class="backgroundColor">
        <div class="correct-rate-btn-all" v-bind:class="{activeTab:rateTypeMin === -1}" @click="clickRateTab(-1, 1)">全部正确率</div>
        <div class="percentNumDiv">
          <div class="correct-rate-btn" v-bind:class="{activeTab:rateTypeMin === 1}" @click="clickRateTab(1, 1)">100%</div>
          <div class="correct-rate-btn" v-bind:class="{activeTab:rateTypeMin === 0.9}" @click="clickRateTab(0.9, 0.999)">90-99%</div>
          <div class="correct-rate-btn" v-bind:class="{activeTab:rateTypeMin === 0.8}" @click="clickRateTab(0.8, 0.899)">80-89%</div>
          <div class="correct-rate-btn" v-bind:class="{activeTab:rateTypeMin === 0.7}" @click="clickRateTab(0.7, 0.799)">70-79%</div>
          <div class="correct-rate-btn" v-bind:class="{activeTab:rateTypeMin === 0.6}" @click="clickRateTab(0.6, 0.699)">60-69%</div>
          <div class="correct-rate-btn" v-bind:class="{activeTab:rateTypeMin === 0}" @click="clickRateTab(0, 0.599)">0-59%</div>
        </div>
      </div>
    </div>

    <div class="correct-rate-div">
      <div class="correct-rate-btn-all" v-bind:class="{activeTab:statusType === ''}" @click="clickEvaluateTab('')">全部状态</div>
      <div class="correct-rate-btn" v-bind:class="{activeTab:statusType === '待评价'}" @click="clickEvaluateTab('待评价')">待评价</div>
      <div class="correct-rate-btn" v-bind:class="{activeTab:statusType === '已评价'}" @click="clickEvaluateTab('已评价')">已评价</div>
      <div class="correct-rate-btn" v-bind:class="{activeTab:statusType === 1}" @click="clickEvaluateTab(1)">待批改</div>
    </div>

    <div class="containerUl">
      <ul v-if="allStudentsArrayFormat.length > 0">
        <li class="list-item" v-for="(item, index) in allStudentsArrayFormat" :key="index" @click="clickStudent(item)">
          <div class="studentLiDiv">
            <span class="spanImg">
              <img class="avatarImg" :src="item.avatar"/>
            </span>
            <div class="bg-class checkbox" v-if="item.selectState">
              <img src="@/assets/images/batchEvaluate/chooseAvator.png" class="imgSize"/>
            </div>
          </div>
          <div class="interact">
            <div class="hascomment" v-if="item.comment"></div>
          </div>
          <div class="studentRealName">{{ item.real_name }}</div>
        </li>
      </ul>

      <div v-if="allStudentsArrayFormat.length === 0" style="text-align: center;margin-top: 30%;">
        没有符合条件的学生<br>
        <!-- (只有批改完成的学生才能发送) -->
      </div>
    </div>

    <div class="chooseAllContainer">
      <div class="list-item chooseAllContainerLeft">
        <span class="bg-class checkboxAll" @click="clickChooseAll">
          <img src="@/assets/images/public/checkunsel.png" v-if="!chooseAllStudentsShow"/>
          <img src="@/assets/images/batchEvaluate/chooseAvator.png" v-if="chooseAllStudentsShow"/>
        </span>
        <span style="chooseAllText">全选</span>
      </div>
      <div class="checkboxGroupDiv">已选择<span class="checkboxGroupNum">{{checkBoxGroup.length}}</span>位同学</div>
      <div style="clear: both;"></div>
    </div>

    <div class="bottom-btn">
      <div class="btn">
        <p @click="goReturnRewrite">退回作业</p>
      </div>
      <div class="btn">
        <p @click="clickPraise"><i class="fa fa-heart-o "></i>表扬</p>
      </div>
      <div class="btn">
        <p @click="writeComments"><i class="fa fa-pencil-square-o"></i>写评语</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/module/batchEvaluate/axios/batchEvaluate.js";
import {mapGetters, mapMutations} from 'vuex'

export default {
  name: "batchEvaluate",
  data() {
    return {
      homeworkListArray: [],
      list: [],
      willCorrectStudentsArray: [],
      didCorrectStudents: [],
      didJudgementStudents: [],
      allStudentsArray: [],
      allStudentsArrayFormat: [],
      statusType: "",
      rateTypeMin: -1,
      rateTypeMax: 1,
      checkBoxGroup: [],
      chooseAllStudentsShow: false
    };
  },
  computed: {
    ...mapGetters({
      env: 'runEnv/old'
    })
  },
  activated() {
  },
  mounted: function() {
    this.userInfo = this.$store.state.account.userInfo;
    this.homeworkOneListInfoObj = this.$store.state.homeworkDetail.homeworkInfo;
    this.checkBoxGroup = [];
    this.getStudentsList();
  },
  methods: {
    goHomework() {
      this.$router.go(-1);
    },
    goReturnRewrite() {
      if (this.checkBoxGroup.length === 0) {
        this.$toast({
          message: "请选择学生！",
          duration: 750
        });
        return;
      }
      this.$store.dispatch("chooseBatchEvaluateStudentsArray", this.checkBoxGroup);
      this.$router.push({
        path: "/returnRewrite"
      });
    },
    writeComments() {
      if (this.checkBoxGroup.length === 0) {
        this.$toast({
          message: "请选择学生！",
          duration: 750
        });
        return;
      }
      this.$store.dispatch("chooseBatchEvaluateStudentsArray", this.checkBoxGroup);
      this.$router.push({
        path: "/comments"
      });
    },
    clickStudent(item) {
      this.checkBoxGroup = [];
      this.allStudentsArrayFormat.forEach(arrayOne => {
        if (item.userid === arrayOne.userid) {
          arrayOne.selectState = !arrayOne.selectState;
        }
      });

      this.allStudentsArrayFormat.forEach(item => {
        if (item.selectState) {
          this.checkBoxGroup.push(item);
        }
      });

      if (this.checkBoxGroup.length === this.allStudentsArrayFormat.length) {
        this.chooseAllStudentsShow = true;
      } else {
        this.chooseAllStudentsShow = false;
      }
    },
    clickPraise() {
      var self = this;
      if (self.checkBoxGroup.length === 0) {
        self.$toast({
          message: "请选择学生！",
          duration: 750
        });
        return;
      }

      var array = self.checkBoxGroup;
      var studentIds = "";

      for (let i = 0; i < array.length; i++) {
        if (i + 1 === array.length) {
          studentIds += array[i].userid;
        } else {
          studentIds += array[i].userid + ",";
        }
      }

      var data = {
        publish_id: self.homeworkOneListInfoObj.course_hour_publish_id,
        user_id: studentIds,
        teacher_id: self.userInfo.userid
      };

      api.setPraise(data).then(function(response) {
        self.$toast({
          message: "已表扬！",
          duration: 750
        });
      });
    },
    getStudentsList() {
      var self = this;
      var data = {
        publish_id: self.homeworkOneListInfoObj.course_hour_publish_id
      };

      api.getHomeworkDetailBasic(data).then(function(response) {
        var array = response.student_list;
        var newArray = [];
        array.forEach(item => {
          if (item.status > 0 && item.status < 4) {
            item.selectState = false;
            if (item.avatar.indexOf('http://') === -1) {
              item.avatar = self.env + item.avatar
            }
            newArray.push(item);
          }
        });
        self.allStudentsArray = newArray;
        self.allStudentsArrayFormat = newArray;
      });
    },
    clickEvaluateTab(type) {
      this.statusType = type;
      this.formartAllstudentsArrayFun(this.rateTypeMin, this.rateTypeMax);
    },
    clickRateTab(min, max) {
      this.rateTypeMin = min;
      this.rateTypeMax = max;
      this.formartAllstudentsArrayFun(min, max);
    },
    formartAllstudentsArrayFun(min, max) {
      this.allStudentsArrayFormat = [];
      var array = this.allStudentsArray;
      if (this.statusType === '待评价') {
        array.forEach(item => {
          if (!item.comment && (min <= item.rate) && (item.rate <= max)) {
            this.allStudentsArrayFormat.push(item);
          }
        });
      } else if (this.statusType === '已评价') {
        array.forEach(item => {
          if (item.comment && (min <= item.rate) && (item.rate <= max)) {
            if (item.comment === null) {
              this.allStudentsArrayFormat.push(item);
            } else {
              this.allStudentsArrayFormat.push(item);
            }
          }
        });
      } else if (this.statusType === 1) {
        array.forEach(item => {
          if (item.status === 1 && (min <= item.rate) && (item.rate <= max)) {
            this.allStudentsArrayFormat.push(item);
          }
        });
      } else if (!this.statusType) {
        array.forEach(item => {
          if ((min <= item.rate) && (item.rate <= max)) {
            this.allStudentsArrayFormat.push(item);
          }
        });
      }
    },
    clickChooseAll() {
      this.chooseAllStudentsShow = !this.chooseAllStudentsShow;
      if (this.chooseAllStudentsShow) {
        var array = this.allStudentsArrayFormat;
        array.forEach(item => {
          item.selectState = true;
        });
        this.checkBoxGroup = array;
      } else {
        var array2 = this.allStudentsArrayFormat;
        array2.forEach(item => {
          item.selectState = false;
        });
        this.checkBoxGroup = []
      }
    }
  }
};
</script>

<style scoped>
.interact {
  height: 16px;
}
.hascomment {
  background: url('../../assets/images/public/comment.png') no-repeat center/100%;
  width: 16px;
  height: 16px;
  display: inline-block;
  vertical-align: middle;
}
.containerUl {
  height: calc(100% - 295px);
  overflow-y: scroll;
  background-color: #fff
}
.imgSize {
  width:100%;
  height:100%
}
.chooseAllContainerLeft {
  float: left;
  position: relative;
  height: 28px;
  line-height: 28px;
}
.backgroundColor {
  background-color: #fff;
}
.correct-rate-div {
  background-color: #fff;
  border-bottom: 1px solid #ededf0;
}
.chooseAllContainer {
  padding: 5px;
  border-top: 1px solid #ededf0;
}
.chooseAllText {
  height: 28px;
  line-height: 28px;
}
.studentRealName {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.avatarImg {
  border-radius: 50%;
  width: 100%;
  height: 100%;
}
.studentLiDiv {
  position: relative;
  margin-bottom:2px;
}
.checkboxGroupDiv {
  float: right;
  height: 28px;
  line-height: 28px;
}
.checkboxGroupNum {
  color: #fe8d16;
  font-size: 20px;
}
.percentNumDiv {
  display: inline-block;
  width: 65%;
}
.correct-rate-btn {
  display: inline-block;
  width: 64px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border: 1px solid #eee;
  border-radius: 10px;
  margin: 0.5rem 0.25rem;
  box-sizing: border-box;
  vertical-align: top;
  background-color: #fff;
  /* display: flex;
    align-items: center;
    justify-content: center;
    float: left; */

}
.correct-rate-btn-all {
  display: inline-block;
  width: 96px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border: 1px solid #eee;
  border-radius: 10px;
  margin: 0.5rem 0.25rem;
  box-sizing: border-box;
  vertical-align: top;
  background-color: #fff;
  /* display: flex;
    align-items: center;
    justify-content: center;
    float: left; */
}
.homework_list {
  margin-top: 1.33333vw;
  padding: 1.86667vw;
  background: #fff;
  width: 91%;
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  position: relative;
}
.listContainerLeft {
  width: 58%;
  display: inline-block;
}
.listContainerRight {
  display: inline-block;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  width: 40%;
}
.select-span {
  width: 60px;
  display: inline-block;
}
.select-span-div {
  padding: 10px;
  border-radius: 2px;
  font-size: 14px;
  line-height: 1.429;
  position: relative;
  box-sizing: border-box;
}
.publishHomeworkBtn {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.publishHomeworkBtnDiv {
  width: 50px;
  height: 50px;
  background-color: #2ec2a9;
  border-radius: 25px;
  position: absolute;
  bottom: 20px;
  right: 20px;
  color: #ffffff;
}
.select-container {
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  border-bottom: 1px solid #ededf0;
}
.homework_list_inline_list {
  line-height: 25px;
}
.listContainer {
  overflow-y: auto;
}
.font-color {
  color: #989ca0;
}
.arrow-right {
  font-size: 36px;
  float: right;
  color: #989ca0;
}
.activeTab {
  background-color: #2ec2a9;
  color: #fff;
}
.bottom-btn {
  position: fixed;
  bottom: 0px;
  width: 100%;
  height: 65px;
  background: #fff;
  padding:7.5px 13px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  border-top:1px solid #e8ebee;
}
.btn {
  flex:1 1 auto;
  background: #06bb9c;
  border-radius: 13px;
  color: #fff;
  height: 50px;
  line-height: 50px;
  margin-right: 15px;
  text-align: center;
  font-size: 17px;
  width:100px;
}
.btn:first-child{
  background: #08b783;
}
.btn:nth-child(2){
  background: #3ea2ff;
}
.btn:last-child{
  background: #2ecbd0;
  margin-right: 0;
}
li {
  display: inline-block;
  width: 20%;
  box-sizing: border-box;
  text-align: center;
  margin-top: 1rem;
  position: relative;
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
  float: left;margin-right: 10px;
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
.spanImg {
  width: 60px;
  height: 60px;
  display: inline-block;
  position: relative;
}
</style>
