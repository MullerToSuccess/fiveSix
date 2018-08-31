<template>
  <div id="checkEverydayFeedback" class="page" style="z-index: 7">
    <header-bar>
      <div slot="title-name">每日反馈-{{studentInfo.userName}}</div>
      <div slot="right-area" class="right">
        <span @click="shareTo">微信分享</span>
      </div>
    </header-bar>

    <div class="list-container">
      <iframe name="studyFrame" allowtransparency="true" :src="url" width="100%" height="100%" id="studyManageIframe" style="border: none;"></iframe>
    </div>

  </div>
</template>

<script>
import HeaderBar from 'common/components/headerBar'
import Scroll from 'common/components/scroll'
import {Toast} from 'vant'
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'checkEverydayFeedback',
  data () {
    return {
      url: '',
      active: 0,
      checkboxLists: [],
      searchVal: '',
      teacherSummaryText: '我们建议'
    }
  },
  mounted () {
    this.getTodyFeedback()
  },
  computed: {
    ...mapGetters({
      studentInfo: 'teacherStudent/studentDetails',
      classInfo: 'teacherStudent/classInfo',
      teacherId: 'account/userId',
      httpUrl: 'runEnv/apishare',
      apihost: 'runEnv/api56',
      details: 'my/details',
      baseInfo: 'my/baseInfo',
      classLists: 'my/classLists',
      userIdentity: 'account/userIdentity'
    })
  },
  methods: {
    deleteVal () {
      this.searchVal = ''
    },
    // 分享
    shareTo() {
      let description =
        this.baseInfo.name +
        "老师对" +
        this.studentInfo.userName +
        "同学的作业反馈已经生成，快去看看。";
      // let urlparam = {
      //   course_hour_publish_id: this.params.course_hour_publish_id,
      //   course_resource_id: this.params.course_resource_id,
      //   dcom_entity_id: this.params.dcom_entity_id,
      //   user_id: this.params.user_id,
      //   domain: HW.$store.getters["runEnv/old"]
      // };
      // let url =
      //   HW.$store.getters["runEnv/old"] +
      //   "static/share/student_qti/index.php" +
      //   "?param=" +
      //   encodeURI(JSON.stringify(urlparam));

      let imgOption = {
        title: '每日反馈-' + this.studentInfo.userName,
        description: description,
        iconName: "",
        shareContent: this.url
      };

      try {
        cordova.exec(
          function(message) {
            console.log(
              "shareUrl : success = " +
                message.versionCode +
                ";" +
                message.hasNew
            );
          },
          function(message) {
            console.log("index.js : fail11 = " + message);
            Toast(message);
          },
          "Share",
          "shareUrl",
          [imgOption]
        );
      } catch (error) {
        Toast("分享失败" + error);
      }
    },
    getTodyFeedback () {
      let token = localStorage.getItem('token').replace(/"/g, "");
      this.url = this.httpUrl + 'feedback.html?feedbackId=' + this.studentInfo.feedbackId + '&studentId=' + this.studentInfo.userId + '&schoolId=' + this.classInfo.schoolId + '&classId=' + this.classInfo.id + '&token=' + token + '&api=' + this.apihost + '&time=' + this.studentInfo.formatDate + '&from=teacher';
      console.log(this.url)
    }
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
  #checkEverydayFeedback {
    height: 100%;
    background: #f5f5f7;
  }
  .list-container {
    height: calc(100vh - 50px);
    overflow-y: auto;
  }
  .teacher-summary {
    background-color: #f5f5f7;
    height: calc(90px/2);
    line-height: calc(90px/2);
    font-weight: 700;
    padding-left: calc(26px/2);
  }
  .teacher-summary-textarea {
    margin-bottom: calc(20px/2);
  }
  .mistake-number-add-btn {
    color: #25d6e3;
    float: right;
  }
  .right{
    position: absolute;
    width: calc(200px/2);
    display: flex;
    left: -30px;
    top: 0;
    span{
      font-size: $header-list-s;
    }
  }
  .check-image-div {
    // width: calc(80px/2);
    // height: calc(80px/2);
  }
  .homework-list-one-img-div {
    border-bottom: 1px solid #f5f5f7;
  }
  .check-image {
    margin: 20px 0;
  }
  .check-image-div-img {
    width: 100%;
  }
  .homework-list-one-check-before {
    width: calc(110px/2);
  }
  .check-image {
    // background-color: #f5f5f7;
    width: calc(240px/2);
    height: calc(240px/2);
    border-radius: calc(12px/2);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: calc(20px/2);
  }
  .check-before-img {
    width: 100%;
  }
  .homework-list-one {
    background-color: #ffffff;
    margin-bottom: calc(20px/2);
    padding: 0 calc(26px/2);
  }
  .homework-list-one-title {
    height: calc(80px/2);
    line-height: calc(80px/2);
    border-bottom: 1px solid #f5f5f7;
  }
  .mistake-number {
    height: calc(80px/2);
    line-height: calc(80px/2);
    font-size: calc(28px/2);
  }
  .mistake-number-input {
    border-bottom: 1px solid #f5f5f7;
    width: calc(200px/2);
    text-align: center;
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
  .input-box{
    height: calc(82px/2);
    line-height: calc(82px/2);
    padding: 0 calc(26px/2);
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
      vertical-align: text-bottom
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
  .tab-lists{
    // margin-bottom: calc(20px/2);
    .tab-view{
      height: 100%;
      overflow: hidden;
      .tab{
        padding: 0 calc(26px/2);
        background: #fff;
        .tab-content{
          display: flex;
          justify-content: space-between;
          height: calc(130px/2);
          .tab-photo{
            width: calc(86px/2);
            height: calc(86px/2);
            margin-top: calc(25px/2);
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
      border-radius: calc(34px/2)/calc(42px/2);
    }
  }
</style>
