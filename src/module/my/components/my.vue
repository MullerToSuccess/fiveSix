<template>
  <div id="my">
    <div class="m-background">
      <div class="m-b-content">
        <div class="m-b-photo" @click="show = true">
          <img class="avatar" v-lazy="baseInfo.photo === '' ? imgDefault : baseInfo.photo">
        </div>
        <div class="m-b-text">
          <div class="m-name">{{baseInfo.name}} <span>({{baseInfo.role ===1 ? '店长' : '教师'}})</span></div>
          <div class="m-school">{{baseInfo.schoolName}}</div>
        </div>
      </div>
    </div>
    <div class="details-content">
      <scroll
        ref="scroll"
        :data="data"
      >
        <div>
          <div class="m-lists">
            <div class="phone-box">
              <div class="cell-msg" @click="bindPhone">
                <div class="left-title">手机号</div>
                <div class="right">
                  <div>{{baseInfo.mobile}}</div>
                  <div>
                    <i class="right-icon"></i>
                  </div>
                </div>
              </div>
            </div>
            <div class="class-box" v-show='classLists.length !== 0 && userIdentity.indexOf(2) >=0'>
              <div class="cell-msg">
                <div>班级</div>
              </div>
              <div class="cell-content">
                <div class="m-3-item" v-for="(item,index) in classLists" :key="index" @click="next(item.id)">
                  <div class="left">
                    <div>{{item.className}}</div>
                    <div>({{item.startTime | spaceDate}}~{{item.endTime | spaceDate}})</div>
                  </div>
                  <div class="right">
                    <div>
                      <i class="right-icon"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <cell title="设置" application="select" to="set" @popup="toSet"/>
            <router-link class="phone-box" tag="div" :to="{ name: userIdentity.indexOf(1) >=0?'mAbout':'tAbout'}">
              <div class="cell-msg">
                <div class="left-title">关于我们</div>
                <div class="right">
                  <div>
                    <i class="right-icon"></i>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
          <div class="login-out" @click="loginout">
            <div class="login-out-m">退出</div>
          </div>
        </div>
      </scroll>
    </div>
    <van-popup v-model="show" position="bottom" class="pop-photo" style="width: 93%">
      <div class="pop-top">
        <div class="photo-btn" @click="selectImagesFromLocal">从相册选择</div>
        <div class="photo-btn" @click="capturePhoto">拍照</div>
      </div>
      <div class="photo-btn photo-cancel" @click="show = false">取消</div>
    </van-popup>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import Cell from 'common/components/cell'
import my from '../api/my'
import {mapGetters, mapMutations, mapActions} from 'vuex'
import Scroll from 'common/components/scroll'
import commonAPI from 'common/api/api'
import {Toast} from 'vant'
import * as filters from '@/filter/index'

export default {
  name: 'my',
  data () {
    return {
      data: {},
      show: false,
      imgDefault: require('@/assets/_images/public/my_default.png')
    }
  },
  activated () {
    this._getUserInfo()
  },
  mounted () {
    this.$route.meta.isAndroid = false
    if (window.appPlug) {
      if (window.appPlug.platform === 'android') {
        this.$route.meta.isAndroid = true
      }
      if (this.$store.state.account.isAndroid) {
        window.appPlug.getversion(succ => {
          this.setVersion(succ)
        }, fail => {
          Toast({ position: 'bottom', message: '获取当前版本失败!' })
        })
      }
    } else {
      alert('no window.appPlug')
    }
  },
  computed: {
    ...mapGetters({
      details: 'my/details',
      baseInfo: 'my/baseInfo',
      classLists: 'my/classLists',
      userIdentity: 'account/userIdentity'
    })
  },
  methods: {
    bindPhone () {
      let path = this.userIdentity.indexOf(1) >= 0 ? 'mEditPhone' : 'tEditPhone'
      this.$router.push({
        name: path,
        params: {
          phone: this.baseInfo.mobile
        }
      })
    },
    capturePhoto () {
      window.appPlug.capturePhoto(this.getImagesSuc, this.getImagesFail, true, false, 200, 200)
    },
    selectImagesFromLocal () {
      window.appPlug.getImage(this.getImagesSuc, this.getImagesFail, true, false, 200, 200)
    },
    getImagesSuc (v) {
      let size = filters.showSize(v)
      this.show = false
      if (size <= 500) {
        let file = 'data:image/png;base64,' + v
        commonAPI.uploadByBase64({
          file: file
        }).then(r => {
          my.changePhoto({
            photo: r.filePath
          }).then(r => {
            this.getUserInfo().then(r => {
              Toast(`修改成功`)
            })
          })
        })
      } else {
        Toast(`图片大小不能超过500kb`)
      }
    },
    getImagesFail (e) {
      this.show = false
    },
    next(id) {
      this.setClassId(id)
      this.$router.push({
        name: 'tClassDetails'
      })
    },
    toSet () {
      const path = this.userIdentity.indexOf(1) >= 0 ? 'mSet' : 'tSet'
      this.$router.push({
        name: path
      })
    },
    loginout() {
      if (window.bus.mqtt.client && window.bus.mqtt.client.isConnected()) {
        this.clearMsg()
        window.bus.mqtt.client.disconnect()
      }
      this.doLoginOut();
      this.$router.push({ path: '/login' })
    },
    _getUserInfo () {
      if (this.details === {}) this.getUserInfo()
    },
    ...mapMutations({
      setClassId: 'managerClass/SET_CLASSID',
      setVersion: 'my/SET_VERSION',
      clearMsg: 'news/clearMsg'
    }),
    ...mapActions({
      doLoginOut: 'account/doLoginOut',
      getUserInfo: 'my/getUserInfo'
    })
  },
  components: {
    Cell,
    Scroll
  }
}
</script>

<style lang="scss" scoped>
  @import "@/style/variable.scss";

  .m-background {
    position: relative;
    height: calc(308px/2);
    background: url('../../../assets/_images/public/my_background.png') no-repeat 0 0;
    background-size: 100%;
    .m-b-content {
      position: absolute;
      display: flex;
      bottom: calc(20px/2);
      align-items: center;
      width: 100%;
      height: calc(200px/2);
      .m-b-photo {
        margin-left: calc(180px/2);
        width: calc(136px/2);
        height: calc(136px/2);
        .avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
        .icon{
          display: inline-block;
          width: calc(136px/2);
          height: calc(136px/2);
          line-height: calc(136px/2);
          font-size: 26px;
          text-align: center;
          border-radius: 50%;
          background: $color-background-y;
          vertical-align: text-bottom;
        }
      }
      .m-b-text {
        margin-left: calc(30px/2);
        letter-spacing: calc(2px/2);
        .m-name {
          font-size: $header-title-s;
          margin-bottom: calc(20px/2);
          span {
            margin-left: calc(8px/2);
          }
        }
        .m-school {
          font-size: $header-list-s;
          color: $color-text-d;
        }
      }
    }
  }
  .details-content {
    position: fixed;
    top: calc(308px/2);
    bottom: calc(110px/2);
    width: 100%;
    .cell-msg{
      display: flex;
      justify-content: space-between;
      height: calc(100px/2);
      line-height: calc(100px/2);
      font-size: $header-list;
      border-bottom: 1px solid $color-line;
      .right {
        display: flex;
        div {
          height: calc(100px / 2);
        }
        .right-icon {
          display: inline-block;
          width: calc(30px / 2);
          height: calc(30px / 2);
          background: url('../../../assets/_images/public/right_arrow.png') no-repeat 0 0;
          background-size: 100% 100%;
          vertical-align: text-bottom;
        }
      }
    }
    .phone-box{
      padding: 0 calc(26px/2);
    }
    .class-box{
      padding: 0 calc(26px/2);
      .cell-content{
        padding: 0 calc(26px/2);
        .m-3-item{
          display: flex;
          height: calc(100px/2);
          line-height: calc(100px/2);
          justify-content: space-between;
          align-items: center;
          letter-spacing:calc(2px/2);
          border-bottom: 1px solid $color-line;
          .left{
            display: flex;
            div:first-child{
              width: 120px;
              margin-right: 30px;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
          }
          .right{
            div{
              display: flex;
              align-items: center;
            }
            .right-icon{
              display: inline-block;
              width: calc(30px/2);
              height: calc(30px/2);
              background: url('../../../assets/_images/public/right_arrow.png') no-repeat 0 0;
              background-size: 100% 100%;
              vertical-align: text-bottom;
            }
          }
        }
      }
    }
    .login-out {
      display: flex;
      padding: calc(50px/2) 0;
      width: 100%;
      background: #fff;
      justify-content: center;
      align-items: center;
      .login-out-m {
        width: calc(420px/2);
        height: calc(90px/2);
        line-height: calc(90px/2);
        text-align: center;
        font-size: calc(34px/2);
        letter-spacing: calc(2px/2);
        color: #fff;
        background: $green-primary-color;
        border-radius: calc(34px/2)/calc(42px/2);
      }
    }
  }
  .pop-photo,.photo-cancel{
    border-radius: calc(16px/2);
    margin: auto;
  }
  .pop-photo{
    font-size: calc(32px/2);
    bottom: calc(20px/2);
    .pop-top{
      div{
        border-bottom: 1px solid $color-line;/*no*/
      }
    }
    .photo-btn{
      height: calc(96px/2);
      line-height: calc(96px/2);
      text-align: center;
    }
    .photo-cancel{
    }
  }
</style>
