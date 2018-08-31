<template>
  <div id="waiting-management" class="page" style="z-index: 2">
    <header-bar>
      <div slot="title-name">历史反馈</div>
      <div slot="right-area">
      </div>
    </header-bar>

    <van-tabs v-model="active" @click="onClick">
      <van-tab v-for="(item1,index1) in classList" :key="index1" :title="item1.className">
        <div class="tab-lists">
          <div class="s-handle" v-if="subList.length > 0">
            <div class="s-number">有反馈</div>
          </div>
          <div class="tab-view">
            <div class="tab" v-for="(item2,index) in subList" :key="index" @click="select(item2)">
              <div class="tab-content">
                <div class="tab-photo">
                  <img v-lazy="item2.photo" v-if="item2.photo">
                  <span class="icon" v-else>{{item2.userName.slice(-2)}}</span>
                </div>
                <div class="tab-text">
                  <div>
                    <span class="name">{{item2.userName}}</span>
                  </div>
                  <div>
                    <span>登记次数:</span>
                    <span class="course">{{item2.registrationNum}}&nbsp;&nbsp;</span>
                    <span>反馈次数:</span>
                    <span class="course">{{item2.feedbackNum}}&nbsp;&nbsp;</span>
                  </div>
                </div>
                <div class="tab-icon">
                  <i class="right-arrow"></i>
                </div>
              </div>
            </div>
          </div>

          <div class="s-handle" v-if="unSubList.length > 0">
            <div class="s-number">未反馈</div>
          </div>
          <div class="tab-view">
            <div>
              <div class="tab" v-for="(item,index) in unSubList" :key="index">
                <div class="tab-content-not">
                  <div class="tab-photo">
                    <img v-lazy="item.photo" v-if="item.photo">
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
      </van-tab>
    </van-tabs>

  </div>
</template>

<script>
import HeaderBar from 'common/components/headerBar'
import {tabList} from 'teacherCommon/js/const'
import hostingHttp from '../api/api'
import Scroll from 'common/components/scroll'
import {mapGetters, mapActions, mapMutations} from 'vuex'

export default {
  name: 'historyHosting',
  data () {
    return {
      list: tabList,
      classList: [],
      active: 0,
      checkboxLists: [],
      searchVal: '',
      placeholder: '请输入学生姓名',
      subList: [],
      unSubList: []
    }
  },
  computed: {
    ...mapGetters({
      classInfo: 'teacherStudent/classInfo'
    })
  },
  activated () {
    if (this.$route.params.notKeepAlive) {
      this.getClassListFun()
    }
  },
  methods: {
    deleteVal () {
      this.searchVal = ''
    },
    select (item) {
      this.setStudentInfo(item)
      this.$router.push({
        path: '/teacher/student/historyHostingDetail'
      })
    },
    onClick(index, title) {
      this.activeTab = this.classList[index]
      this.getTodayListFun()
    },
    getClassListFun () {
      let self = this
      self.classList = [];
      hostingHttp.getClassList({}).then(r => {
        self.classList = r
        self.activeTab = self.classList[0]
        self.getTodayListFun()
      })
    },
    getTodayListFun () {
      let self = this
      self.setClassInfo(self.activeTab)
      var data = {
        classId: self.activeTab.id,
        startTime: '',
        endTime: ''
      }
      hostingHttp.getHistoryFeedback(data).then(r => {
        self.subList = r.subList
        self.unSubList = r.unSubList
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
    height: calc(100vh - 110px);
    overflow-y: auto;
    .tab-view{
      overflow: hidden;
      .tab{
        padding: 0 calc(26px/2);
        background: #fff;
        .tab-content{
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
            margin-top: 10px;
            font-size: $header-list-s;
            letter-spacing: calc(2px/2);
            div{
              margin-bottom: 4px;
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
      border-radius: 17px/21px;
    }
  }
</style>
