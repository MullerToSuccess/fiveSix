<template>
  <div id="student-score-table">
    <div v-show="from === 'classScore'" class="title van-hairline--bottom">学生成绩表</div>
    <div class="content">
      <div class="table-title van-hairline--bottom">
        <div class="table-cell name" @click="sortList(1)">
          <span>姓名</span>
          <span class="caret">
            <i class="fa fa-caret-up" :class="{active: sortRule.name.up}"></i>
            <i class="fa fa-caret-down" :class="{active: sortRule.name.down}"></i>
          </span>
        </div>
        <div class="table-cell" @click="sortList(2)">
          <span>正确率</span>
          <span class="caret">
            <i class="fa fa-caret-up" :class="{active: sortRule.correctPer.up}"></i>
            <i class="fa fa-caret-down" :class="{active: sortRule.correctPer.down}"></i>
          </span>
        </div>
        <div class="table-cell" @click="sortList(3)">
          <span>错题攻克</span>
          <span class="caret">
            <i class="fa fa-caret-up" :class="{active: sortRule.cuoti.up}"></i>
            <i class="fa fa-caret-down" :class="{active: sortRule.cuoti.down}"></i>
          </span>
        </div>
        <div class="table-cell time-length" @click="sortList(4)">
          <span>用时</span>
          <span class="caret">
            <i class="fa fa-caret-up" :class="{active: sortRule.time.up}"></i>
            <i class="fa fa-caret-down" :class="{active: sortRule.time.down}"></i>
          </span>
        </div>
      </div>
      <div class="table-body">
        <transition-group name="flip-list" tag="ul">
          <li class="table-row van-hairline--bottom" v-for="stu in studentInfo" :key="stu.userid" @click="linkTo(stu)">
            <div class="table-cell name">
              <div class="stu-name">
                <span>{{stu.real_name}}</span>
              </div>
            </div>
            <div class="table-cell" >
              <div class="correct-per">
                <span v-if="stu.status == 0 && stu.time === ''">未提交</span>
                <span v-else>{{stu.rate | percent}}</span>
              </div>
            </div>
            <div class="table-cell">
              <div class="cuoti">
                <span>{{stu.correct_num}}</span>
                <!-- <span v-if="stu.status == 0">--</span> -->
              </div>
            </div>
            <div class="table-cell time-length ellipsis" :class="{times:stu.create_time}">
              <span v-if="stu.time">
                <span class="length">{{stu.time / 1000 | timeFormatSecond}}</span>
                <br/>
                <span class="creat_time">{{stu.create_time ? stu.create_time + ' 完成' : ''}}</span>
              </span>
              <span v-else>--</span>
            </div>
            <div class="arrow" v-show="stu.status == 3 || stu.status == 1 || stu.status == 4">
              <i class="fa fa-angle-right"></i>
            </div>
          </li>
        </transition-group>
      </div>
    </div>
  </div>
</template>
<script>
// 全班成绩 ==> 学生成绩表
import { mapGetters, mapState } from "vuex";
export default {
  name: "StudentScoreTable",
  props: ["from"],
  data() {
    return {
      sortRule: {
        name: {
          up: false,
          down: false
        },
        correctPer: {
          up: false,
          down: true
        },
        cuoti: {
          up: false,
          down: false
        },
        time: {
          up: false,
          down: false
        }
      },
      sortParam: "correct_down"
    };
  },
  computed: {
    ...mapGetters({
      studentList: "homeworkDetail/getStudentInfo"
    }),
    ...mapState({
      homeworkInfo: state => state.homeworkDetail.homeworkInfo
    }),
    studentInfo() {
      return this.studentList(this.sortParam);
    }
  },
  methods: {
    // 转换排序规则
    switchSort(type) {
      if (!this.sortRule[type]["up"] && !this.sortRule[type]["down"]) {
        for (let key in this.sortRule) {
          for (let inner in this.sortRule[key]) {
            this.sortRule[key][inner] = false;
          }
        }
        this.sortRule[type]["down"] = true;
      } else if (this.sortRule[type]["up"]) {
        this.sortRule[type]["up"] = false;
        this.sortRule[type]["down"] = true;
      } else {
        this.sortRule[type]["up"] = true;
        this.sortRule[type]["down"] = false;
      }
    },
    // 点击排序
    sortList(type) {
      switch (type) {
        case 1:
          this.sortByName();
          break;
        case 2:
          this.sortByCorrect();
          break;
        case 3:
          this.sortByCuoti();
          break;
        case 4:
          this.sortByTime();
          break;
      }
    },
    sortByName() {
      this.switchSort("name");
      this.sortParam = this.sortRule.name.up ? "name_up" : "name_down";
    },
    sortByCorrect() {
      this.switchSort("correctPer");
      this.sortParam = this.sortRule.correctPer.up
        ? "correct_up"
        : "correct_down";
    },
    sortByCuoti() {
      this.switchSort("cuoti");
      this.sortParam = this.sortRule.cuoti.up ? "cuoti_up" : "cuoti_down";
    },
    sortByTime() {
      this.switchSort("time");
      this.sortParam = this.sortRule.time.up ? "time_up" : "time_down";
    },
    linkTo(stuInfo) {
      if (stuInfo.time === "") {
        return false;
      } else {
        if (this.from === "personalized") {
          this.$emit("personalizedLink", {
            userid: stuInfo.userid,
            username: stuInfo.real_name
          });
          return false;
        }
        this.$router.push({
          path: `/studentHomework/${stuInfo.userid}/${
            this.homeworkInfo.course_hour_publish_id
          }/${stuInfo.real_name}`
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#student-score-table {
  .title {
    height: 45px;
    line-height: 45px;
    color: #1e1e1e;
    padding: 0 13px;
    font-size: 15px;
  }
  .content {
    .table-title,
    .table-row {
      display: flex;
      font-size: 14px;
    }
    .table-title {
      padding: 0 13px;
      height: 45px;
      line-height: 45px;
      text-align: center;
      color: #c7cac9;
    }
    .table-cell {
      flex: 1;
      &.name {
        flex: 0 0 75px;
      }
      &.time-length {
        font-size: 14px;
        flex: 0 0 120px;
        &.times{
         line-height: 20px;
          margin-top:7.5px;
          span.creat_time{
            font-size: 10px;
          }
        }
      }
    }
    .caret {
      display: inline-flex;
      flex-direction: column;
      font-size: 10px;
      justify-content: center;
      position: relative;
      top: -3px;
      i {
        height: 6px;
        &.active {
          color: #4e4e4e;
        }
      }
    }
    .table-body {
      padding: 0 13px;
      .table-row {
        width: 100%;
        color: #1e1e1e;
        display: flex;
        height: 55px;
        line-height: 55px;
        text-align: center;
      }
    }
    .stu-name {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 75px;
      span {
        flex: 0 0 75px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
.flip-list-move {
  transition: transform 0.5s;
}
</style>
