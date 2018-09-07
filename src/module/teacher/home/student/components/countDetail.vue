<template>
  <div id="waiting-management" class="page" style="z-index: 3">

    <div class="van-hairline--bottom">
      <div class="back-btn" @click="goBack">
        <i class="icon-back"></i>
      </div>
      <div class="title-name">
        <div name="title-name">学生详情
        </div>
      </div>
      <div class="right-area">
        <slot name="right-area"></slot>
      </div>
    </div>
    <div class="null-place"></div>
    <van-tabs>
      <van-tab>
        <div class="tab-lists">
          <div class="list-container">
            <div class="tab-view">
              <div>
                <div class="tab">
                    <div class="tab-content-not">
                    <div class="tab-photo">
                        <img v-lazy="this.userPhoto" v-if="this.userPhoto">
                        <span class="icon" v-else>{{this.userName.slice(-2)}}</span>
                    </div>
                    <div class="tab-text">
                        <div>
                        <span class="name">{{this.userName}}</span>
                        <span class="date">{{this.date}}</span>
                        </div>
                    </div>
                    <div class="tab-icon">
                    </div>
                    </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </van-tab>
    </van-tabs>
    <div class="countCalendar">
      <count-calendar></count-calendar>
    </div>
    <div class="countNum">
      <div><span>正常考勤：</span>{{countNormal}}天</div>
      <div><span>未签到：</span>{{countNotNormal}}次({{countNotNormal}}天)</div>
    </div>
    <div class="gap"></div>
    <div class="dayCountDetail">
    <div v-if="haveCount">
      <div class="startClass">上课
        <span v-if="haveStartClass"> 考勤时间 {{startClassTime}} </span>
        <span v-else> 未签到 </span>
      </div>
      <div class="endClass">下课
        <span v-if="haveEndClass"> 考勤时间 {{endClassTime}} </span>
        <span v-else> 未签到 </span>
      </div>
    </div>
    <div v-else>当天休息/暂无考勤</div>
  </div>
  </div>
</template>

<script>
import HeaderBar from "common/components/headerBar";
import Scroll from "common/components/scroll";
import hostingHttp from "../api/api";
import { mapGetters, mapActions, mapMutations } from "vuex";
// import Calendar from "vue-mobile-calendar";
import CountCalendar from "./countCalendar.vue";
export default {
  name: "countDetail",
  data() {
    return {
      classList: [],
      active: 0,
      checkboxLists: [],
      searchVal: "",
      activeTab: "",
      submissionList: [],
      unSubmissionList: [],
      userName: "张三",
      userPhoto: "",
      date: "2018.08.21 星期三",
      countNormal: 15,
      countNotNormal: 3,
      haveCount: true,
      haveStartClass: true,
      haveEndClass: true,
      startClassTime: "16:00",
      endClassTime: "17:00"
      // calendarShow: true
    };
  },
  mounted() {},
  methods: {
    goBack() {
      this.$router.push({
        path: "/teacher/student/attendanceCount"
      });
    }
  },
  watch: {},
  components: {
    HeaderBar,
    Scroll,
    CountCalendar
  }
};
</script>

<style lang="scss" scoped>
@import "@/style/reset.scss";
@import "@/style/variable.scss";
.van-hairline--bottom {
  position: fixed;
  top: 0;
  z-index: 50;
  width: 100%;
  height: calc(100px / 2);
  line-height: calc(100px / 2);
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  background-color: $color-background-y;
  .back-btn {
    display: inline-block;
    font-size: calc(38px / 2);
    width: calc(
      90px / 2
    ); //如果修改此值，则.right-area的width也要同步修改一样的值，不然会造成title-name不居中
    color: $color-text;
    .icon-back {
      display: inline-block;
      width: calc(36px / 2);
      height: calc(36px / 2);
      margin-left: calc(25px / 2);
      background: url("../../../../../assets/_images/public/back.png") no-repeat
        0 0;
      background-size: 100% 100%;
      vertical-align: text-bottom;
    }
    span {
      display: inline-block;
    }
  }
  .title-name {
    font-size: $header-title;
    max-width: 60%;
    // align-items: center;
    div {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .right-area {
    position: relative;
    display: inline-block;
    font-size: calc(38px / 2);
    width: calc(
      90px / 2
    ); //此值应和.back-btn的width保持一致，不然会造成title-name不居中
    text-align: right;
  }
}
.null-place {
  height: 50px;
}
.gap{
  height:calc(20px/2);
  width:100%;
  background: #cccccc
}
.checkTime {
  // display: inline-block;
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
.list-container {
  // height: calc(100vh - 150px);
  overflow-y: auto;
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
.s-handle {
  height: calc(82px / 2);
  padding: 0 calc(26px / 2);
  font-size: $header-list;
  line-height: calc(82px / 2);
  color: $color-text-d;
  background: $color-background;
  .s-number-red {
    color: #ff1503;
  }
}
.tab-lists {
  .tab-view {
    overflow: hidden;
    .tab {
      padding: 0 calc(26px / 2);
      background: #fff;
      .tab-content {
        display: flex;
        justify-content: space-between;
        height: calc(180px / 2);
        border-bottom: 1px solid $color-line;
        .tab-photo {
          width: calc(86px / 2);
          height: calc(86px / 2);
          margin-top: calc(40px / 2);
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        .tab-text {
          width: 76%;
          margin-top: calc(30px / 2);
          font-size: $header-list-s;
          letter-spacing: calc(2px / 2);
          div {
            margin-bottom: 4px;
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
        .tab-icon {
          display: flex;
          align-items: center;
          .right-arrow {
            display: inline-block;
            width: calc(30px / 2);
            height: calc(30px / 2);
            background: url("../../../../../assets/_images/public/right_arrow.png")
              no-repeat 0 0;
            background-size: 100% 100%;
            vertical-align: text-bottom;
          }
        }
      }
      .tab-content-not {
        display: flex;
        justify-content: space-between;
        height: calc(120px / 2);
        border-bottom: 1px solid $color-line;
        .tab-photo {
          width: calc(86px / 2);
          height: calc(86px / 2);
          margin-top: calc(20px / 2);
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        .tab-text {
          width: 76%;
          margin-top: calc(50px / 2);
          font-size: $header-list-s;
          letter-spacing: calc(2px / 2);
          div {
            margin-bottom: calc(20px / 2);
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
        .tab-icon {
          display: flex;
          align-items: center;
          .right-arrow {
            display: inline-block;
            width: calc(30px / 2);
            height: calc(30px / 2);
            background: url("../../../../../assets/_images/public/right_arrow.png")
              no-repeat 0 0;
            background-size: 100% 100%;
            vertical-align: text-bottom;
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
.className {
  float: right;
  margin-right: calc(20px / 2);
}
.content-filter {
  height: calc(90px / 2);
}
.count-data {
  height: calc(400px / 2);
  margin-top: calc(20px / 2);
}
.count-chart {
  height: calc(400px / 2);
  margin-top: calc(20px / 2);
}
.count-title {
  margin-left: calc(20px / 2);
}
.countCalendar {
  height: calc(600px / 2);
  width: calc(100%);
  // border: 1px solid #000000;
}
.countNum {
  width: 100%;
  height: calc(80px / 2);
  line-height: calc(80px / 2);
  div {
    text-align: center;
    display: inline-block;
    width: calc(90% / 2);
  }
}
.dayCountDetail{
  .startClass, .endClass{
    height: calc(80px / 2);
    line-height: calc(80px / 2);
    border-bottom: 1px solid #000000
  }
}
</style>
