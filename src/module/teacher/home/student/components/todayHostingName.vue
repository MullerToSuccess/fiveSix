<template>
  <div id="todayHostingName" class="page" style="z-index: 4">
    <header-bar>
      <div slot="title-name">作业托管-{{studentInfo.userName}}</div>
      <div slot="right-area" class="right">
        <span @click="goEverday">每日反馈</span>
      </div>
    </header-bar>

    <div class="tab-lists">
      <scroll class="tab-view">
        <div>
          <div class="tab">
            <div class="tab-content">
              <div class="tab-photo">
                <img v-lazy="studentInfo.userPhoto" v-if="studentInfo.userPhoto">
                <span class="icon" v-else>{{studentInfo.userName.slice(-2)}}</span>
              </div>
              <div class="tab-text">
                <div>
                  <span class="name">{{studentInfo.userName}}</span>
                </div>
                <div class="checkTime">
                  <span class="course">{{studentInfo.date}}&nbsp;&nbsp;</span>
                  <div class="checkFeedback">
                    共：<span class="homeworkTimes">{{studentInfo.totalWork}}</span>项作业
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </scroll>
    </div>

    <div class="list-container">

      <div class="homework-list-one" v-for="(item, index) in listsArray" :key="index" @click="select(item)">
        <div class="homework-list-one-title">
          <div class="subject-div">
            <span class="subject">{{item.subjectName}}</span>
          </div>
        <!-- <div> -->
          <span class="task-detail">{{item.taskDetail}}</span>
        <!-- </div> -->
        </div>

        <div class="homework-list-one-img-div">
          <div class="homework-list-one-check-before">
            <img class="check-before-img" src="@/assets/_images/teacher/check-before.png" alt="">
          </div>

          <div class="check-image-container">

            <div class="check-image" v-for="(item2, index2) in listsImageArray[index].beforeCheckImagesView" :key = index2>
              <div class="check-image-upload">
                <img class="check-image-div-img" :src="item2">
              </div>

              <div class="delete-x-div" @click="deletePhoto(item, 'before', index2)">
                <img class="check-image-div-img" src="@/assets/_images/teacher/delete_x.png">
              </div>
            </div>

            <div class="check-image" @click="clickPhoto(item, 'before')">
              <div class="check-image-div">
                <img class="check-image-div-img" src="@/assets/_images/teacher/take-photo.png">
              </div>
            </div>

            <div class="clear-both"></div>
          </div>
        </div>

        <div class="homework-list-one-img-div">
          <div class="homework-list-one-check-before">
            <img class="check-before-img" src="@/assets/_images/teacher/check-after.png" alt="">
          </div>

          <div class="check-image" v-for="(item3, index3) in listsImageArray[index].afterCheckImagesView" :key = index3>
            <div class="check-image-upload">
              <img class="check-image-div-img" :src="item3">
            </div>

            <div class="delete-x-div" @click="deletePhoto(item, 'after')">
              <img class="check-image-div-img" src="@/assets/_images/teacher/delete_x.png">
            </div>
          </div>

          <div class="check-image" @click="clickPhoto(item, 'after')">
            <div class="check-image-div">
              <img class="check-image-div-img" src="@/assets/_images/teacher/take-photo.png">
            </div>
          </div>

          <div class="clear-both"></div>
        </div>
      </div>
    </div>

    <div id="c-edit-photo">
      <van-popup v-model="show" position="bottom" class="pop-photo" style="width: 93%">
        <div class="pop-top">
          <div class="photo-btn" @click="selectImagesFromLocal">从相册选择</div>
          <div class="photo-btn" @click="capturePhoto">拍照</div>
        </div>
        <div class="photo-btn photo-cancel" @click="show = false">取消</div>
      </van-popup>
    </div>

  </div>
</template>

<script>
import HeaderBar from "common/components/headerBar";
import Scroll from "common/components/scroll";
import { mapGetters, mapActions } from "vuex";
import hostingHttp from "../api/api";
import commonAPI from "common/api/api";
import storage from "@/store/stroage";

export default {
  name: "todayHostingName",
  data() {
    return {
      listsArray: [],
      listsImageArray: [],
      active: 0,
      checkboxLists: [],
      beforeRouteName: "",
      searchVal: "",
      show: false
    };
  },
  computed: {
    ...mapGetters({
      studentInfo: "teacherStudent/studentDetails",
      studentHostingArray: "teacherStudent/studentHostingArray",
      currentImage: "teacherStudent/currentImage",
      teacherId: "account/userId",
      httpUrl: "runEnv/api56"
    })
  },
  mounted() {
    this.getTrusteeshipFun();
  },
  methods: {
    deleteVal() {
      this.searchVal = "";
    },
    clickPhoto(item, type) {
      this.show = true;
      this.currentList = item;
      this.currentBeforeOrAfterType = type;
    },
    deletePhoto(item, type, index) {
      var self = this;
      // var array = this.listsArray;
      var array = this.listsImageArray;
      this.currentList = item;
      this.currentBeforeOrAfterType = type;
      for (let i = 0; i < array.length; i++) {
        if (array[i].id === this.currentList.id) {
          if (this.currentBeforeOrAfterType === "before") {
            array[i].beforeCheckImages.splice(index, 1);
            array[i].beforeCheckImagesView.splice(index, 1);
          } else if (this.currentBeforeOrAfterType === "after") {
            array[i].afterCheckImages.splice(index, 1);
            array[i].afterCheckImagesView.splice(index, 1);
            array[i].afterCheckTime = Date.parse(new Date()) + "";
          }
        }
      }
      this.setStudentHostingArray(array);
      storage["persistent"].set("hostArray", array);

      let currentArr = storage["persistent"].get("currentArray");
      for (let i = 0; i < currentArr.length; i++) {
        if (currentArr[i].feedbackId === self.studentInfo.feedbackId) {
          currentArr[i].imageArray = array;
        }
      }
      self.setCurrentImageArray(currentArr);
      storage["persistent"].set("currentArray", currentArr);
    },
    goEverday() {
      this.$router.push({
        path: "/teacher/student/everydayFeedback"
      });
    },
    select() {
      this.$router.push({
        path: "/teacher/student/todayHostingName"
      });
    },
    getAuthority() {
      let params = {
        user_id: JSON.parse(localStorage.userinfo).userid
      };
      correction.getAuthority(params).then(r => {
        this.upToken = r.mo_authority_token;
      });
    },
    getTrusteeshipFun() {
      let currentArray = storage["persistent"].get("currentArray")
        ? storage["persistent"].get("currentArray")
        : [];
      // alert("start:" + JSON.stringify(currentArray));
      let hostArray = storage["persistent"].get("hostArray")
        ? storage["persistent"].get("hostArray")
        : [];
      let self = this;

      var data = {
        feedbackId: self.studentInfo.feedbackId,
        date: self.$dayjs(self.studentInfo.date).format("YYYY-MM-DD")
      };
      let havedFlag = false;
      if (currentArray.length > 0) {
        for (let i = 0; i < currentArray.length; i++) {
          if (currentArray[i].feedbackId === self.studentInfo.feedbackId) {
            self.listsImageArray = currentArray[i].imageArray;
            self.listsArray = currentArray[i].imageArray;
            // alert(JSON.stringify(self.listsImageArray));
            havedFlag = true;
            // this.setStudentHostingArray(self.listsImageArray);
            storage["persistent"].set("hostArray", self.listsImageArray);
          }
        }
      }
      // else {
      //   // self.listsImageArray = self.studentHostingArray
      //   self.listsImageArray = storage["persistent"].get("hostArray");
      // }

      if (havedFlag) {
        // debugger;
        // self.listsArray = storage["persistent"].get("hostArray");

        hostingHttp.getTrusteeship(data).then(r => {
          let array = r;
          var imageObj = {
            imageArray: [],
            feedbackId: 0
          };
          var imageArray = r,
            objArr = [];
          for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < self.listsArray.length; j++) {
              if (Number(array[i].id) === self.listsArray[j].depositId) {
                array[i] = self.listsArray[j];
              } else {
                if (array[i].subject === "1") {
                  array[i].subjectName = "语";
                } else if (array[i].subject === "2") {
                  array[i].subjectName = "数";
                } else if (array[i].subject === "3") {
                  array[i].subjectName = "英";
                }

                array[i].wrongNum = 0;
                array[i].weakKpIds = "";
                array[i].weakKpLabels = "";
                array[i].afterCheckTime = Date.parse(new Date()) + "";
                array[i].teacher_user_id = self.teacherId;
                array[i].student_user_id = self.studentInfo.userId;
                array[i].feedbackId = self.studentInfo.feedbackId;
                array[i].depositId = Number(array[i].id);
              }
            }
          }
          self.listsArray = array;
          self.setStudentHostingArray(array);
          storage["persistent"].set("hostArray", array);
          self.listsImageArray = array;

          imageObj.feedbackId = self.studentInfo.feedbackId;
          imageObj.imageArray = imageArray;

          let currentArr = storage["persistent"].get("currentArray");
          for (let i = 0; i < currentArr.length; i++) {
            if (currentArr[i].feedbackId === self.studentInfo.feedbackId) {
              currentArr[i].imageArray = array;
            }
          }

          self.setCurrentImageArray(currentArr);
          storage["persistent"].set("currentArray", currentArr);
        });
      } else {
        // debugger;
        hostingHttp.getTrusteeship(data).then(r => {
          var array = r;
          var imageObj = {
            imageArray: [],
            feedbackId: 0
          };
          var imageArray = r,
            objArr = [];
          for (let i = 0; i < array.length; i++) {
            if (array[i].subject === "1") {
              array[i].subjectName = "语";
            } else if (array[i].subject === "2") {
              array[i].subjectName = "数";
            } else if (array[i].subject === "3") {
              array[i].subjectName = "英";
            }

            array[i].wrongNum = 0;
            array[i].weakKpIds = "";
            array[i].weakKpLabels = "";
            array[i].beforeCheckImages = [];
            array[i].beforeCheckImagesView = [];
            array[i].afterCheckImages = [];
            array[i].afterCheckImagesView = [];
            array[i].afterCheckTime = Date.parse(new Date()) + "";
            array[i].teacher_user_id = self.teacherId;
            array[i].student_user_id = self.studentInfo.userId;
            array[i].feedbackId = self.studentInfo.feedbackId;
            array[i].depositId = Number(array[i].id);
            imageArray[i].beforeCheckImages = [];
            imageArray[i].beforeCheckImagesView = [];
            imageArray[i].afterCheckImages = [];
            imageArray[i].afterCheckImagesView = [];
          }
          imageObj.feedbackId = self.studentInfo.feedbackId;
          imageObj.imageArray = imageArray;
          self.listsArray = array;
          self.listsImageArray = array;
          self.setStudentHostingArray(array);
          storage["persistent"].set("hostArray", array);
          let pushArr = storage["persistent"].get("currentArray")
            ? storage["persistent"].get("currentArray")
            : [];
          pushArr.push(imageObj);
          // alert(JSON.stringify(pushArr));
          storage["persistent"].set("currentArray", pushArr);
          // alert(
          //   "初始化：" +
          //     JSON.stringify(storage["persistent"].get("currentArray"))
          // );
        });
      }
    },
    capturePhoto() {
      window.appPlug.capturePhoto(
        this.getImagesSuc,
        this.getImagesFail,
        true,
        false
      );
    },
    selectImagesFromLocal() {
      window.appPlug.getImage(
        this.getImagesSuc,
        this.getImagesFail,
        true,
        false
      );
    },
    getImagesSuc(v) {
      var self = this;
      self.show = false;
      commonAPI
        .uploadByBase64({
          file: "data:image/png;base64," + v
        })
        .then(r => {
          // var array = self.listsArray;
          var array = self.listsImageArray;
          for (let i = 0; i < array.length; i++) {
            if (array[i].id === self.currentList.id) {
              if (self.currentBeforeOrAfterType === "before") {
                array[i].beforeCheckImages.push(r.filePath);
                array[i].beforeCheckImagesView.push(r.fileUrl);
              } else if (self.currentBeforeOrAfterType === "after") {
                array[i].afterCheckImages.push(r.filePath);
                array[i].afterCheckImagesView.push(r.fileUrl);
                array[i].afterCheckTime = Date.parse(new Date()) + "";
              }
            }
          }
          storage["persistent"].set("hostArray", array);
          let currentArr = storage["persistent"].get("currentArray");
          for (let i = 0; i < currentArr.length; i++) {
            if (currentArr[i].feedbackId === self.studentInfo.feedbackId) {
              currentArr[i].imageArray = array;
            }
          }
          self.setCurrentImageArray(currentArr);
          storage["persistent"].set("currentArray", currentArr);
          // alert("success::" + JSON.stringify(currentArr));
        });
    },
    getFilePath(v) {},
    getImagesFail(e) {
      // alert(e)
    },
    ...mapActions({
      setStudentHostingArray: "teacherStudent/studentHostingArrayAction",
      setCurrentImageArray: "teacherStudent/currentImageArrayAction"
    })
  },
  watch: {},
  components: {
    HeaderBar,
    Scroll
  }
};
</script>

<style lang="scss" scoped>
@import "@/style/reset.scss";
@import "@/style/variable.scss";
#todayHostingName {
  height: 100%;
  background: #f5f5f7;
}
.subject-div {
  display: inline-block;
  vertical-align: text-bottom;
}
.task-detail {
  display: inline-block;
  width: 80%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: top;
}
.icon {
  display: inline-block;
  width: calc(86px / 2);
  height: calc(86px / 2);
  line-height: calc(86px / 2);
  text-align: center;
  border-radius: 50%;
  background: $color-background-y;
  vertical-align: text-bottom;
}
.clear-both {
  clear: both;
}
.check-image-container {
  width: 100%;
  overflow-x: auto;
}
.subject {
  padding: calc(10px / 2);
  border-radius: calc(8px / 2);
  border: 1px solid #1fd467;
  color: #1fd467;
}
.list-container {
  height: calc(100vh - 125px);
  overflow-y: auto;
}
.right {
  position: absolute;
  width: calc(200px / 2);
  display: flex;
  left: -30px;
  top: 0;
  span {
    font-size: $header-list-s;
  }
}
.check-image-div {
  width: calc(70px / 2);
  height: calc(70px / 2);
}
.delete-x-div {
  width: calc(40px / 2);
  height: calc(40px / 2);
  position: absolute;
  bottom: -5px;
  right: -5px;
}
.check-image-upload {
  width: calc(200px / 2);
  height: calc(200px / 2);
  overflow: hidden;
  border-radius: calc(10px / 2);
}
.homework-list-one-img-div {
  border-bottom: 1px solid #f5f5f7;
}
.check-image-div-img {
  width: 100%;
  border-radius: calc(10px / 2);
}
.homework-list-one-check-before {
  width: calc(110px / 2);
}
.check-image {
  background-color: #f5f5f7;
  width: calc(200px / 2);
  height: calc(200px / 2);
  border-radius: calc(12px / 2);
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 20px 20px 0;
  float: left;
  position: relative;
}
.check-before-img {
  width: 100%;
}
.homework-list-one {
  background-color: #ffffff;
  margin-bottom: 4px;
  padding: 0 calc(26px / 2);
}
.homework-list-one-title {
  // height: calc(80px/2);
  line-height: calc(80px / 2);
  border-bottom: 1px solid #f5f5f7;
}
.checkTime {
  // display: inline-block;
}
.homeworkTimes {
  color: red;
}
.checkFeedback {
  display: inline-block;
  float: right;
}
.input-box {
  height: calc(82px / 2);
  line-height: calc(82px / 2);
  padding: 0 calc(26px / 2);
  .login-input-icon {
    display: inline-block;
    width: calc(38px / 2);
    height: calc(38px / 2);
    margin-right: calc(20px / 2);
    background: url("../../../../../assets/_images/public/search.png") no-repeat
      0 0;
    background-size: 100% 100%;
    vertical-align: text-bottom;
  }
  input {
    font-size: $header-list;
    letter-spacing: calc(2px / 2);
  }
  .clear-icon {
    display: inline-block;
    width: calc(18px / 2);
    height: calc(18px / 2);
    margin-left: calc(220px / 2);
    background: url("../../../../../assets/_images/public/search_delete.png")
      no-repeat 0 0;
    background-size: 100% 100%;
    vertical-align: text-bottom;
  }
}
.van-tabs--line {
  padding-top: 13.33333vw;
}
.s-search {
  height: calc(82px / 2);
  padding: 0 calc(26px / 2);
  font-size: $header-list;
  line-height: calc(82px / 2);
  color: $color-text-d;
  background: #ffffff;
  .s-number-red {
    color: #ff1503;
  }
}
.tab-lists {
  margin-bottom: calc(20px / 2);
  .tab-view {
    height: 100%;
    overflow: hidden;
    .tab {
      padding: 0 calc(26px / 2);
      background: #fff;
      .tab-content {
        display: flex;
        justify-content: space-between;
        height: calc(130px / 2);
        .tab-photo {
          width: calc(86px / 2);
          height: calc(86px / 2);
          margin-top: calc(25px / 2);
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        .tab-text {
          width: 76%;
          margin-top: 10px;
          font-size: $header-list-s;
          letter-spacing: calc(2px / 2);
          div {
            margin-bottom: 8px;
          }
          div:last-child {
            // margin-right: calc(70px/2);
          }
          .user,
          .course,
          .time {
            color: $color-text-d;
          }
          .mode {
            color: $green-primary-color;
          }
        }
      }
    }
  }
}
.btn {
  display: flex;
  position: fixed;
  width: 100%;
  height: calc(115px / 2);
  bottom: 0;
  background: #fff;
  justify-content: center;
  align-items: center;
  .btn-m {
    width: calc(420px / 2);
    height: calc(90px / 2);
    line-height: calc(90px / 2);
    text-align: center;
    font-size: calc(34px / 2);
    letter-spacing: calc(2px / 2);
    color: #fff;
    background: $green-primary-color;
    border-radius: 34px / calc(42px / 2);
  }
}
.photo-display {
  width: calc(400px / 2);
  height: calc(400px / 2);
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  padding: calc(100px / 2);
  img {
    width: 100%;
    height: 100%;
  }
}
.pop-photo,
.photo-cancel {
  border-radius: calc(16px / 2);
  margin: auto;
}
.pop-photo {
  font-size: calc(32px / 2);
  bottom: calc(20px / 2);
  .pop-top {
    div {
      border-bottom: 1px solid $color-line; /*no*/
    }
  }
  .photo-btn {
    height: calc(96px / 2);
    line-height: calc(96px / 2);
    text-align: center;
  }
  .photo-cancel {
  }
}
.homework-list-one-title span {
  white-space: normal;
}
</style>
