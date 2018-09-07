<template>
  <div id="waiting-management" class="page" style="z-index: 3">

    <div class="van-hairline--bottom">
      <div class="back-btn" @click="goBack">
        <i class="icon-back"></i>
      </div>
      <div class="title-name">
        <div name="title-name">考勤统计
        </div>
      </div>
      <div class="right-area">
        <slot name="right-area"></slot>
      </div>
    </div>
    <div class="null-place"></div>
    <van-tabs v-model="active" sticky>
      <van-tab  title='按日统计'>
        <div class="content-filter">
          <div class="filterDate" @click="pickDate">{{ selDate }}</div>
          <div class="filterUpOrDown" @click="pickUpDown">{{ selUpDown }}</div>
          <div class="className">{{ className }}</div>
        </div>
        <div class="content-count">
            <span class="count-title">本日概况</span><br>
            <div class="count-data">
              <CountChart></CountChart>
            </div>
            <span class="count-title">近七日出勤率</span><br>
            <div class="count-chart">
              <CountEchart></CountEchart>
            </div>
        </div>
      </van-tab>
      <van-tab  title='按月统计'>
        <div class="content-filter">
          <div class="filterDate" @click="pickDate">{{ selDate }}</div>
          <div class="className">{{ className }}</div>
        </div>
        <div class="content-count">
          <span class="count-title">本月概况</span>
          <div class="count-data">
            <CountChart></CountChart>
          </div>
          <span class="count-title">异常统计</span><br>
          <div class="count-chart">
            <CountChart></CountChart>
            </div>
        </div>
      </van-tab>
    </van-tabs>
    <van-popup v-model="datePickShow" position="bottom" :overlay="false">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :formatter="formatter"
        @cancel='cancelDateShow'
        @confirm='selectDate'
      />
    </van-popup>
    <van-actionsheet
      v-model="upDownShow"
      :actions="actions"
      @select="onSelect"
    />
  </div>
</template>

<script>
import HeaderBar from "common/components/headerBar";
import Scroll from "common/components/scroll";
import hostingHttp from "../api/api";
import { mapGetters, mapActions, mapMutations } from "vuex";
import CountChart from "./countChart";
import CountEchart from "./countEchart";
export default {
  name: "todayHostingList",
  data() {
    return {
      classList: [],
      active: 0,
      checkboxLists: [],
      searchVal: "",
      activeTab: "",
      submissionList: [],
      unSubmissionList: [],
      className: "作业托管1班",
      datePickShow: false,
      upDownShow: false,
      currentDate: new Date(),
      selDate: "2018-08-26",
      selUpDown: "上课考勤",
      actions: [
        {
          name: "上课考勤"
        },
        {
          name: "下课考勤"
        }
      ]
    };
  },
  mounted() {
    // this.active = sessionStorage.getItem("tabIndex") || 0;
    // this.placeholder = "请输入学生姓名";
    // this.getClassListFun();
  },
  methods: {
    goBack() {
      this.$router.push({
        path: "homeworkHosting"
      });
    },
    pickDate() {
      this.datePickShow = true;
    },
    selectDate(v) {
      let endvalue = new Date(v);
      let Y = endvalue.getFullYear();
      let M =
        endvalue.getMonth() < 10
          ? "0" + endvalue.getMonth()
          : endvalue.getMonth();
      let D =
        endvalue.getDate() < 10 ? "0" + endvalue.getDate() : endvalue.getDate();
      this.selDate = Y + "-" + M + "-" + D;
      console.log(Y + "-" + M + "-" + D);
    },
    cancelDateShow() {
      this.datePickShow = false;
    },
    formatter(type, value) {
      return value + "xxx";
    },
    pickUpDown() {
      this.upDownShow = true;
    },
    selectUpDown(item) {
      this.upDownShow = false;
      // this.selUpDown = item.name;
    },
    onSelect(item) {
      // 点击选项时默认不会关闭菜单，可以手动关闭
      this.show = false;
      console.log(item);
      // Toast(item.name);
    },
    cancelSelect() {
      this.upDownShow = false;
    }
    // ...mapActions({
    //   setStudentInfo: "teacherStudent/studentInfoAction",
    //   setClassInfo: "teacherStudent/classInfoAction"
    // })
  },
  watch: {},
  components: {
    HeaderBar,
    Scroll,
    CountChart,
    CountEchart
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
  height: calc(100vh - 150px);
  overflow-y: auto;
}
.not-back-feed {
  color: #888888;
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
  position: relative;
  .login-input {
    width: 80%;
  }
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
    position: absolute;
    bottom: 15px;
    right: 18px;
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
.filterUpOrDown {
  width: calc(50% / 2);
}
.filterDate {
  width: calc(50% / 2);
}
.content-filter {
  div {
    display: inline-block;
  }
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
</style>
