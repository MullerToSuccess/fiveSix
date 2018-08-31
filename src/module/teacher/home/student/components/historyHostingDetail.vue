<template>
  <div id="historyHosting-detail" class="page" style="z-index: 3">
    <header-bar>
      <div slot="title-name">历史反馈</div>
      <div slot="right-area" class="right">
      </div>
    </header-bar>

    <uL>
      <li class="list-group-item">
        <img  class="avatar" v-lazy="studentInfo.photo || studentInfo.userPhoto" v-if="studentInfo.photo || studentInfo.userPhoto">
        <span class="icon" v-else>{{studentInfo.userName.slice(-2)}}</span>
        <span class="name">{{studentInfo.userName}}</span>
        <span class="hostTimes">未反馈：<span class="red">{{historyHostingDetail.noFeedbackNum}}</span>次</span>
      </li>
    </uL>

    <div class="list-container" v-if="studentHistoryFeedbackList.length > 0">
      <div class="listDiv" v-for="(item, index) in studentHistoryFeedbackList" :key="index" @click="select(item)">
        <div class="listBottom">
          <div class="listOne">
            <div>{{item.formatDate}}</div>
            <div><span class="red">{{item.totalWork}}</span>项作业</div>
            <div class="listRight mode" v-if="item.isFeedback === 1">
              <div class="right-text">查看反馈</div>
            </div>
            <div class="listRight" v-else>
              <div class="right-text">未反馈</div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
import HeaderBar from 'common/components/headerBar'
import hostingHttp from '../api/api'
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'historyHostingDetail',
  data () {
    return {
      historyHostingDetail: {},
      familyInfo: [],
      studyInfo: [],
      courseInfo: [],
      gradeClass: '',
      studentHistoryFeedbackList: []
    }
  },
  mounted () {
    this.getStudentHistoryFeedbackFun()
  },
  computed: {
    ...mapGetters({
      studentInfo: 'teacherStudent/studentDetails',
      teacherId: 'account/userId',
      httpUrl: 'runEnv/api56'
    })
  },
  methods: {
    getStudentHistoryFeedbackFun () {
      let self = this
      var data = {
        userId: self.studentInfo.userId
      }
      hostingHttp.getHistoryFeedbackInfo(data).then(r => {
        self.historyHostingDetail = r;
        var array = r.info;
        if (array.length > 0) {
          for (let i = 0; i < array.length; i++) {
            array[i].formatDate = array[i].date ? self.$dayjs(array[i].date).format('YYYY-MM-DD') : '';
            array[i].date = array[i].date;
            array[i].userId = r.userId;
            array[i].userName = r.userName;
            array[i].userPhoto = r.photo;
            array[i].feedbackId = array[i].feedbackId;
            array[i].totalWork = array[i].totalWork;
          }
        }
        self.studentHistoryFeedbackList = array;
      })
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
    ...mapActions({
      setStudentInfo: 'teacherStudent/studentInfoAction'
    })
  },
  components: {
    HeaderBar
  }
}

</script>

<style scoped lang="scss">
@import "@/style/reset.scss";
@import "@/style/variable.scss";
#historyHosting-detail{
  .mode{
    color: $green-primary-color;
  }
  .list-container {
    height: calc(100vh - 110px);
    overflow-y: auto;
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
  .listRight {
    width: 85px;
    text-align: right;
  }
  .red {
    color: red;
  }
  .listDiv {
    padding: 0 calc(13px/2);
    .listBottom {
      border-bottom: 1px solid #e9ecf4;
      .listOne {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        height: calc(100px/2);
        line-height: calc(100px/2);
        font-weight:400;
        padding: 0 calc(20px/2);
      }
    }
  }
  .right-text {
    margin-right: calc(10px/2);
    font-size: 14px;
  }
  .hostTimes {
    position: absolute; right: 5%;
  }
  font-size: $header-list;
  .list-group-item{
    display: flex;
    align-items: center;
    margin: 10px 13px 0 13px;
    padding-bottom: calc(20px/2);
    border-bottom: 1px solid $color-line;
    .avatar{
      width: calc(86px/2);
      height: calc(86px/2);
      border-radius: 50%;
    }
    .name{
      margin-left: calc(20px/2);
      color: $color-text;
      font-size: $header-list;
    }
  }
  .status{
    height: calc(72px/2);
    line-height: calc(72px/2);
    padding: 0 calc(26px/2);
    background:$color-background ;
    .mode{
      color: $green-active-color;
    }
  }
  .details-content{
    position: fixed;
    top: calc(172px/2);
    bottom: calc(115px/2);
    width: 100%;
    border-top: 1px solid $color-line;
    border-bottom: 1px solid $color-line;
    .details-view{
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  }
}

</style>
