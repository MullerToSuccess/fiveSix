<template>
  <transition name="slide">
    <v-touch
      @panstart="onPanStart"
      @panend="onPanEnd"
      @pan="onPan"
      tag="div"
      id="mqtt-details"
      class="touchpan"
    >
      <header-bar :newBack="newBack" @back="back">
        <div slot="title-name">{{nextParams.title}}</div>
      </header-bar>
      <div class="s-lists">
        <scroll
          ref="scroll"
          :data="data"
          :pullDownRefresh="pullDownRefreshObj"
          :pullUpLoad="pullUpLoadObj"
          :pullUpLoadComplete="pullUpLoadComplete"
          :pullDownRefreshComplete="pullDownRefreshComplete"
          @pullingDown="onPullingDown(api, {'channel': nextParams.channel})"
          @pullingUp="onPullingUp(api, {'channel': nextParams.channel})">
          <div>
            <div class="item" v-for="(item,index) in data" :key="index" @click="select(item.moduleParam, item)">
              <div v-if="JSON.parse(item.content).messageTemplateType === 'parentComment'" >
                <div class="top">
                  <img class="photo" v-lazy="JSON.parse(item.content).avatar" alt="">
                  <div class="t-right">
                    <div class="t-r-name">{{JSON.parse(item.content).parentName}}</div>
                    <div class="t-r-time">{{item.createTime}}</div>
                  </div>
                </div>
                <div class="bottom">
                  <div>{{isJSON(item.content) ? JSON.parse(item.content).content.replace('${myName}',userName) : ''}}</div>
                </div>
              </div>
              <div v-else>
                <div class="top">
                  <i class="icon"></i>
                  <div class="t-right">
                    <div class="t-r-name">{{item.fromName}}</div>
                    <div class="t-r-time">{{item.createTime}}</div>
                  </div>
                </div>
                <div class="bottom">
                  <div>{{isJSON(item.content) ? JSON.parse(item.content).content.replace('${myName}',userName) : ''}}</div>
                  <div class="look">点击查看</div>
                </div>
              </div>
            </div>
          </div>
        </scroll>
      </div>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </v-touch>
  </transition>
</template>

<script>
import Scroll from 'common/components/scroll'
import HeaderBar from 'common/components/headerBar'
import news from '../api/news'
import {Mscroll, Mpan} from 'common/js/mixins'
import {mapGetters, mapMutations} from 'vuex'
import {Toast} from 'vant'

export default {
  mixins: [Mscroll, Mpan],
  name: 'mqttDetails',
  data () {
    return {
      data: [],
      api: news.getMessage,
      role: 0,
      title: '',
      channel: 0,
      haveMsg: false,
      content: {}
    }
  },
  computed: {
    ...mapGetters({
      userName: 'my/userName',
      userId: 'account/userId',
      userIdentity: 'account/userIdentity',
      nextParams: 'news/nextParams'
    })
  },
  created () {
    if (this.userIdentity.indexOf(1) >= 0) {
      this.role = 1
    } else {
      this.role = 2
    }
    this._getNews()
  },
  methods: {
    select (jsonStr, item) {
      if (this.role === 1) {
        this.$router.push({
          path: '/manager/student/waitingManagement'
        })
      } else {
        if (this.isJSON(jsonStr)) {
          let code = JSON.parse(jsonStr).code
          let params = JSON.parse(JSON.parse(jsonStr).data)
          let path
          let data = Object.assign({}, params)
          if (code === 'classInsertStudentView') {
            path = 'tSystemNewsStudent'
            this.$router.push({
              name: path,
              params: {
                data: data
              }
            })
          } else if (code === '1012') { // 今日反馈
            data.userPhoto = JSON.parse(jsonStr).url
            data.date = item.createTime
            data.userId = data.userId
            data.userName = data.userName
            data.formatDate = this.$dayjs(item.createTime).format('YYYY-MM-DD')
            data.id = data.classId
            this.setStudentDetails(data)
            this.setClassInfo(data)
            news.checkIsFeedback({
              feedbackId: data.feedbackId
            }).then(r => {
              if (r.data === 0) {
                // 未反馈
                path = 'todayHostingName'
              } else if (r === 1) {
                // 已反馈
                path = 'checkEverydayFeedback'
              }
              this.$router.push({
                name: path,
                params: {
                  data: data
                }
              })
            })
          }
        }
      }
    },
    isJSON(str) {
      if (typeof str === 'string') {
        try {
          let obj = JSON.parse(str);
          return typeof obj === 'object' && obj
        } catch (e) {
          console.log('error：' + str + '!!!' + e);
          return false;
        }
      }
      console.log('It is not a string!')
    },
    _getNews () {
      news.getMessage({
        // roleValue: this.role,
        channel: this.nextParams.channel,
        current: this.CURRENT,
        size: this.SIZE
      }).then(r => {
        this.pullDownRefreshComplete = true
        this.pullUpLoadComplete = true
        if (r.records.length === 0) {
          Toast(`暂时没有消息`)
        }
        this.data = r.records
      })
    },
    ...mapMutations({
      setStudentDetails: 'teacherStudent/SET_STUDENTDETAILS',
      setClassInfo: 'teacherStudent/SET_CLASSINFO'
    })
  },
  components: {
    HeaderBar,
    Scroll
  }
}
</script>

<style scoped lang="scss">
 @import "@/style/variable.scss";
  .slide-enter-active, .slide-leave-active {
    transition: all 0.5s;
  }
  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
  #mqtt-details {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    .s-lists {
      position: fixed;
      z-index: 200;
      top: calc(100px/2);
      bottom: 0;
      width: 100%;
      background: #fff;
      .item{
          padding: calc(20px/2) calc(26px/2);
          border-bottom: 1px solid $color-line;
          .top{
            display: flex;
            padding: calc(10px/2) 0;
            .photo,.icon{
              display: inline-block;
              width: calc(60px/2);
              height: calc(60px/2);
              background-size: 100% 100%;
              vertical-align: text-bottom;
            }
            .icon{
              background: url('../../../assets/_images/news/notice.png') no-repeat 0 0;
              background-size: 100% 100%;
            }
            .t-right{
              margin-left: calc(20px/2);
              .t-r-name{
                font-size: $header-title-s;
              }
              .t-r-time{
                color: $color-text-d;
                font-size: $header-list;
              }
            }
          }
          .bottom{
            margin-top: calc(15px/2);
            .look{
              font-size: calc(28px/2);
              text-decoration:underline;
              color: $green-primary-color;
            }
          }
        }
    }
  }
</style>
