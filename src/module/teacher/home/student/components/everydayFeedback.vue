<template>
  <div id="everydayFeedback" class="page" style="z-index: 5">
    <header-bar>
      <div slot="title-name">每日反馈-{{studentInfo.userName}}</div>
      <div slot="right-area" class="right">
        <span @click="sendParents">发送给家长</span>
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
                  <div class="checkFeedback mode">
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
      <div class="teacher-summary">
        教师总结
      </div>

      <van-cell-group class="teacher-summary-textarea">
        <van-field
          v-model="teacherSummaryText"
          type="textarea"
          placeholder="请在此输入..."
          rows="4"
        />
      </van-cell-group>

      <div class="homework-list-one" v-for="(item, index) in studentHostingArray" :key="index">
        <div class="homework-list-one-title">
          <div class="subject-div">
            <span class="subject">{{item.subjectName}}</span>
          </div>
          <span class="task-detail">{{item.taskDetail}}</span>
        </div>

        <div class="mistake-number">
          <span>作业错题数</span>
          <input class="mistake-number-input" v-model="item.wrongNum"/>
          <span>道</span>
        </div>

        <div class="mistake-number">
          <span>薄弱知识点</span>
          <span class="mistake-number-add-btn" @click="goKnowledgePoint(item)">添加</span>
        </div>

        <div class="knowledgeChoose">{{item.weakKpLabels}}</div>

        <div class="homework-list-one-img-div">
          <div class="check-image">
            <div class="check-image-div" @click="goViewImage(item, 'before')">
              <img class="check-image-div-img" src="@/assets/_images/teacher/photo_select_before.png">
              <div class="img-number">{{item.beforeCheckImagesView.length}}张</div>
              <div class="img-view" v-if="item.beforeCheckImagesView.length > 0">
                <img class="img-image" :src="item.beforeCheckImagesView[0]">
              </div>
            </div>
          </div>
        </div>

        <div class="homework-list-one-img-div">
          <div class="check-image">
            <div class="check-image-div" @click="goViewImage(item, 'after')">
              <img class="check-image-div-img" src="@/assets/_images/teacher/photo_select_after.png">
            </div>
            <div class="img-number">{{item.afterCheckImagesView.length}}张</div>
            <div class="img-view" v-if="item.afterCheckImagesView.length > 0">
              <img class="img-image" @click="goViewImage(item, 'after')" :src="item.afterCheckImagesView[0]">
            </div>
          </div>
        </div>

        <div class="clear-both"></div>
      </div>
    </div>

  </div>
</template>

<script>
import HeaderBar from 'common/components/headerBar'
import {tabList} from 'teacherCommon/js/const'
import Scroll from 'common/components/scroll'
import hostingHttp from '../api/api'
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'everydayFeedback',
  data () {
    return {
      list: tabList,
      active: 0,
      checkboxLists: [],
      searchVal: '',
      newBack: true,
      isCache: false,
      teacherSummaryText: sessionStorage.getItem('teacherNote')
    }
  },
  mounted () {
  },
  computed: {
    ...mapGetters({
      studentInfo: 'teacherStudent/studentDetails',
      studentHostingArray: 'teacherStudent/studentHostingArray',
      classInfo: 'teacherStudent/classInfo'
    })
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "todayHostingList") {
      to.meta.isUseCache = !this.isCache
      next()
    } else {
      next()
    }
  },
  methods: {
    deleteVal () {
      this.searchVal = ''
    },
    sendParents () {
      let self = this
      var array = self.studentHostingArray
      var newArray = [];
      for (let i = 0; i < array.length; i++) {
        var obj = {};
        obj.depositId = array[i].depositId;
        obj.beforeCheckImages = array[i].beforeCheckImages;
        obj.afterCheckImages = array[i].afterCheckImages;
        obj.afterCheckTime = array[i].afterCheckTime;
        obj.wrongNum = array[i].wrongNum ? Number(array[i].wrongNum) : 0;
        obj.weakKpIds = array[i].weakKpIds;
        obj.teacher_user_id = array[i].teacher_user_id;
        obj.student_user_id = array[i].student_user_id;
        newArray.push(obj)
      }
      var data = {
        studentId: self.studentInfo.userId,
        feedbackId: self.studentInfo.feedbackId,
        contents: self.teacherSummaryText,
        schoolId: self.classInfo.schoolId,
        classId: self.classInfo.id,
        studentWorkDepositChecks: newArray
      }

      if (!data.contents) {
        self.$toast({
          message: "教师内容不为空",
          duration: 750
        });
        return;
      }

      hostingHttp.addFeedback(data).then(r => {
        sessionStorage.removeItem('teacherNote');
        self.$toast({
          message: r,
          duration: 3000
        });
        setTimeout(function(r) {
          // self.$router.push({
          //   path: '/teacher/student/todayHostingList'
          // })
          self.$router.go(-2)
        }, 1000)
      })
    },
    goKnowledgePoint (item) {
      this.setCurrentTrusteeship(item)
      this.$router.push({
        name: "knowledgePoint",
        path: '/teacher/student/knowledgePoint',
        params: {
          allKpIds: item.allKpIds ? item.allKpIds : [],
          weakKpIds: item.weakKpIds ? item.weakKpIds : []
        }
      })
    },
    goViewImage (item, type) {
      item.type = type;
      this.setCurrentImageArray(item)
      if (type === 'before' && item.beforeCheckImagesView.length === 0) {
        this.$toast({
          message: "没有照片",
          duration: 750
        });
        return;
      }
      if (type === 'after' && item.afterCheckImagesView.length === 0) {
        this.$toast({
          message: "没有照片",
          duration: 750
        });
        return;
      }
      this.$router.push({
        name: "viewImage",
        path: '/teacher/student/viewImage'
      })
    },
    ...mapActions({
      setCurrentTrusteeship: 'teacherStudent/currentTrusteeshipAction',
      setCurrentImageArray: 'teacherStudent/currentImageArrayAction'
    })
  },
  watch: {
    teacherSummaryText: function(val, oldVal) {
      sessionStorage.setItem('teacherNote', val)
    }
  },
  components: {
    HeaderBar,
    Scroll
  }
}
</script>

<style lang="scss" scoped>
// @import "@/style/reset.scss";
 @import "@/style/variable.scss";
  input {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font-weight: normal;
    vertical-align: baseline;
  }
  .img-view {
    width: 60px;
    height: 60px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -30px;
    margin-left: -30px;
    overflow: hidden;
  }
  .img-image {
    width: 100%;
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
  #everydayFeedback {
    height: 100%;
    background: #f5f5f7;
  }
  .img-number {
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 14px;
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
  .clear-both {
    clear: both;
  }
  .subject {
    padding: calc(10px/2);
    border-radius: calc(8px/2);
    border: 1px solid #1fd467;
    color: #1fd467;
  }
  .list-container {
    height: calc(100vh - 115px);
    overflow-y: auto;
    background-color: #f5f5f7;
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
    left: -40px;
    top: 0;
    span{
      font-size: $header-list-s;
    }
  }
  .check-image-div {
    position: relative;
    // width: calc(80px/2);
    // height: calc(80px/2);
  }
  .homework-list-one-img-div {
    border-bottom: 1px solid #f5f5f7;
  }
  .check-image-div-img {
    width: 100%;
  }
  .homework-list-one-check-before {
    width: calc(110px/2);
  }
  .knowledgeChoose {
    color: #949498;
    margin-bottom: calc(20px/2);
  }
  .check-image {
    width: calc(240px/2);
    height: calc(240px/2);
    border-radius: calc(12px/2);
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
    margin-bottom: calc(20px/2);
    padding: 0 calc(26px/2);
  }
  .homework-list-one-title {
    // height: calc(80px/2);
    line-height: calc(80px/2);
    border-bottom: 1px solid #f5f5f7;
  }
  .mistake-number {
    height: calc(80px/2);
    line-height: calc(80px/2);
    font-size: calc(28px/2);
  }
  .mistake-number-input {
    border-bottom: 2px solid #a7a7af;
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
          border-bottom: 1px solid #949498;
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
      border-radius: 34px/calc(42px/2);
    }
  }
  .homework-list-one-title span{
    white-space:normal
  }
</style>
