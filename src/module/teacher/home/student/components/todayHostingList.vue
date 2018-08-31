<template>
  <div id="waiting-management" class="page" style="z-index: 3">

    <div class="van-hairline--bottom">
      <div class="back-btn" @click="goBack">
        <i class="icon-back"></i>
      </div>
      <div class="title-name">
        <div name="title-name">今日托管
        </div>
      </div>
      <div class="right-area">
        <slot name="right-area"></slot>
      </div>
    </div>
    <div class="null-place"></div>

    <van-tabs :active="active" @click="onClick">
      <van-tab v-for="(item1, index1) in classList" :key="index1" :title="item1.className">
        <div class="tab-lists">
          <div class="input-box">
            <i class="login-input-icon" @click="doSearch"></i>
            <input class="login-input" :placeholder="placeholder" v-model="searchVal">
            <i class="clear-icon" @click="deleteVal"></i>
          </div>

          <div class="list-container">
            <div class="s-handle" v-if="submissionList.length > 0">
              <div class="s-number">已提交</div>
            </div>
            <div class="tab-view">
              <div>
                <div class="tab" v-for="(item3, index2) in submissionList" :key="index2" @click="select(item3)">
                  <div class="tab-content">
                    <div class="tab-photo">
                      <img v-lazy="item3.userPhoto" v-if="item3.userPhoto">
                      <span class="icon" v-else>{{item3.userName.trim().slice(-2)}}</span>
                    </div>
                    <div class="tab-text">
                      <div>
                        <span class="name">{{item3.userName}}</span>
                      </div>
                      <div class="checkTime">
                        <span class="course">{{item3.date}}&nbsp;&nbsp;</span>
                        <div class="checkFeedback mode" v-if="item3.isFeedback === 1">
                          查看反馈
                        </div>
                        <div class="checkFeedback not-back-feed" v-else>
                          未反馈
                        </div>
                      </div>
                      <div>
                        <span class="time">共：<span class="homeworkTimes">{{item3.totalWork}}</span>项作业</span>
                      </div>
                    </div>
                    <div class="tab-icon">
                      <i class="right-arrow"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="s-handle" v-if="unSubmissionList.length > 0">
              <div class="s-number-red">未提交</div>
            </div>
            <div class="tab-view">
              <div>
                <div class="tab" v-for="(item, index2) in unSubmissionList" :key="index2">
                  <div class="tab-content-not">
                    <div class="tab-photo">
                      <img v-lazy="item.userPhoto" v-if="item.userPhoto">
                      <span class="icon" v-else>{{item.userName.slice(-2)}}</span>
                    </div>
                    <div class="tab-text">
                      <div>
                        <span class="name">{{item.userName}}</span>
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
  </div>
</template>

<script>
import HeaderBar from 'common/components/headerBar'
import Scroll from 'common/components/scroll'
import hostingHttp from '../api/api'
import {mapGetters, mapActions, mapMutations} from 'vuex'

export default {
  name: 'todayHostingList',
  data () {
    return {
      classList: [],
      active: 0,
      checkboxLists: [],
      searchVal: '',
      activeTab: '',
      submissionList: [],
      unSubmissionList: []
    }
  },
  mounted () {
    this.active = sessionStorage.getItem('tabIndex') || 0
    this.placeholder = '请输入学生姓名';
    this.getClassListFun()
  },
  methods: {
    goBack () {
      this.$router.push({
        path: "homeworkHosting"
      });
    },
    doSearch() {
      this.getTodayListFun()
    },
    deleteVal () {
      this.searchVal = ''
      this.getTodayListFun()
    },
    select (item) {
      this.setStudentInfo(item)
      if (item.isFeedback === 0) {
        this.$router.push({
          path: '/teacher/student/todayHostingName'
        })
      } else {
        this.$router.push({
          path: '/teacher/student/checkEverydayFeedback'
        })
      }
    },
    onClick(index, title) {
      this.activeTab = this.classList[index]
      sessionStorage.setItem('tabIndex', index)
      this.getTodayListFun()
    },
    getClassListFun () {
      let self = this
      self.classList = [];
      hostingHttp.getClassList({}).then(r => {
        self.classList = r
        self.activeTab = self.classList[self.active]
        self.getTodayListFun()
      })
    },
    getTodayListFun () {
      let self = this
      self.setClassInfo(self.activeTab)
      var data = {
        classId: self.activeTab.id,
        userName: self.searchVal
      }
      hostingHttp.getTodayList(data).then(r => {
        for (let i = 0; i < r[0].submissionList.length; i++) {
          r[0].submissionList[i].formatDate = self.$dayjs(r[0].submissionList[i].date).format('YYYY-MM-DD');
        }
        for (let i = 0; i < r[0].unSubmissionList.length; i++) {
          r[0].unSubmissionList[i].formatDate = self.$dayjs(r[0].unSubmissionList[i].date).format('YYYY-MM-DD');
        }
        self.submissionList = r[0].submissionList
        self.unSubmissionList = r[0].unSubmissionList
        if (self.submissionList.length === 0 && self.unSubmissionList.length === 0) {
          self.$toast({
            message: "未搜索到结果",
            duration: 750
          });
        }
      })
    },
    ...mapActions({
      setStudentInfo: 'teacherStudent/studentInfoAction',
      setClassInfo: 'teacherStudent/classInfoAction'
    })
  },
  watch: {
  },
  components: {
    HeaderBar,
    Scroll
  }
}
</script>

<style lang="scss" scoped>
@import "@/style/reset.scss";
@import "@/style/variable.scss";
.van-hairline--bottom{
  position: fixed;
  top: 0;
  z-index: 50;
  width: 100%;
  height: calc(100px/2);
  line-height: calc(100px/2);
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  background-color: $color-background-y;
  .back-btn{
    display: inline-block;
    font-size: calc(38px/2);
    width: calc(90px/2); //如果修改此值，则.right-area的width也要同步修改一样的值，不然会造成title-name不居中
    color: $color-text;
    .icon-back{
      display: inline-block;
      width: calc(36px/2);
      height: calc(36px/2);
      margin-left:calc(25px/2);
      background: url('../../../../../assets/_images/public/back.png') no-repeat 0 0;
      background-size: 100% 100%;
      vertical-align: text-bottom;
    }
    span{
      display: inline-block;
    }
  }
  .title-name{
    font-size: $header-title;
    max-width: 60%;
    // align-items: center;
    div {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .right-area{
    position: relative;
    display: inline-block;
    font-size: calc(38px/2);
    width: calc(90px/2); //此值应和.back-btn的width保持一致，不然会造成title-name不居中
    text-align: right;
  }
}
.null-place{
  height: 50px;
}
.checkTime {
  // display: inline-block;
}
.icon{
  display: inline-block;
  width: calc(86px/2);
  height: calc(86px/2);
  line-height: calc(86px/2);
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
.input-box{
  height: calc(82px/2);
  line-height: calc(82px/2);
  padding: 0 calc(26px/2);
  position: relative;
  .login-input {
    width: 80%;
  }
  .login-input-icon{
    display: inline-block;
    width: calc(38px/2);
    height: calc(38px/2);
    margin-right: calc(20px/2);
    background: url('../../../../../assets/_images/public/search.png') no-repeat 0 0;
    background-size: 100% 100%;
    vertical-align: text-bottom
  }
  input{
    font-size: $header-list;
    letter-spacing: calc(2px/2);
  }
  .clear-icon{
    display: inline-block;
    width: calc(18px/2);
    height: calc(18px/2);
    margin-left: calc(220px/2);
    background: url('../../../../../assets/_images/public/search_delete.png') no-repeat 0 0;
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
.s-search{
height: calc(82px/2);
padding: 0 calc(26px/2);
font-size:$header-list;
line-height: calc(82px/2);
color: $color-text-d;
background: #ffffff;
.s-number-red{
  color: #ff1503;
}
}
.s-handle{
height: calc(82px/2);
padding: 0 calc(26px/2);
font-size:$header-list;
line-height: calc(82px/2);
color: $color-text-d;
background: $color-background;
.s-number-red{
  color: #ff1503;
}
}
.tab-lists{
.tab-view{
  overflow: hidden;
  .tab{
    padding: 0 calc(26px/2);
    background: #fff;
    .tab-content{
      display: flex;
      justify-content: space-between;
      height: calc(180px/2);
      border-bottom: 1px solid $color-line;
      .tab-photo{
        width: calc(86px/2);
        height: calc(86px/2);
        margin-top: calc(40px/2);
        img{
          width: 100%;
          height: 100%;
          border-radius:50% ;
        }
      }
      .tab-text{
        width: 76%;
        margin-top: calc(30px/2);
        font-size: $header-list-s;
        letter-spacing: calc(2px/2);
        div{
          margin-bottom: 4px;
        }
        div:last-child{
          // margin-right: calc(70px/2);
        }
        .user,.course,.time{
          color: $color-text-d;
        }
        .mode{
          color: $green-primary-color;
        }
      }
      .tab-icon{
        display: flex;
        align-items: center;
        .right-arrow {
          display: inline-block;
          width: calc(30px/2);
          height: calc(30px/2);
          background: url('../../../../../assets/_images/public/right_arrow.png') no-repeat 0 0;
          background-size: 100% 100%;
          vertical-align: text-bottom;
        }
      }
    }
    .tab-content-not{
      display: flex;
      justify-content: space-between;
      height: calc(120px/2);
      border-bottom: 1px solid $color-line;
      .tab-photo{
        width: calc(86px/2);
        height: calc(86px/2);
        margin-top: calc(20px/2);
        img{
          width: 100%;
          height: 100%;
          border-radius:50% ;
        }
      }
      .tab-text{
        width: 76%;
        margin-top: calc(50px/2);
        font-size: $header-list-s;
        letter-spacing: calc(2px/2);
        div{
          margin-bottom: calc(20px/2);
        }
        div:last-child{
          // margin-right: calc(70px/2);
        }
        .user,.course,.time{
          color: $color-text-d;
        }
        .mode{
          color: $green-primary-color;
        }
      }
      .tab-icon{
        display: flex;
        align-items: center;
        .right-arrow {
          display: inline-block;
          width: calc(30px/2);
          height: calc(30px/2);
          background: url('../../../../../assets/_images/public/right_arrow.png') no-repeat 0 0;
          background-size: 100% 100%;
          vertical-align: text-bottom;
        }
      }
    }
  }
}
}
.btn{
  display: flex;
  position: fixed;
  width: 100%;
  height: calc(115px/2);
  bottom: 0;
  background: #fff;
  justify-content: center;
  align-items: center;
.btn-m{
  width: calc(420px/2);
  height: calc(90px/2);
  line-height: calc(90px/2);
  text-align: center;
  font-size: calc(34px/2);
  letter-spacing: calc(2px/2);
  color: #fff;
  background:$green-primary-color ;
  border-radius: 34px/calc(42px/2);
}
}
</style>
