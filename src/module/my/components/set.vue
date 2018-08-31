<template>
  <transition name="slide">
    <div id="set">
      <header-bar>
        <div slot="title-name">设置</div>
      </header-bar>
      <cell title="清除缓存" :value="cacheInfo" application="select" to="cache" @popup="show=true"/>
      <cell title="修改密码"  application="select" to="revisePwd" @popup="revisePwd"/>
      <cell title="检查更新" :value="'V' + version" application="select" to="update" @popup="check_update"/>
      <i class="icon" v-show="haveNewVersion"></i>
      <van-popup v-model="show" @click-overlay="clickOverlay">
        <div class="cache">
          <div v-if="completeShow" class="complete">
            <div class="img">
              <i></i>
            </div>
            <div style="text-align: center">{{cacheText}}</div>
          </div>
          <div v-else class="init">
            <div class="top">
              <div class="img">
                <i></i>
              </div>
              <div style="text-align: center">是否清除缓存?</div>
            </div>
            <div class="bottom">
              <div class="cancel" @click="show = false">取消</div>
              <div class="sure" @click="clear_cache">确定</div>
            </div>
          </div>
        </div>
      </van-popup>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </transition>
</template>

<script>
import HeaderBar from 'common/components/headerBar'
import Cell from 'common/components/cell'
import {Toast} from 'vant'
import {mapGetters} from 'vuex'
export default {
  name: 'set',
  data () {
    return {
      show: false,
      completeShow: false,
      cacheText: '',
      cache: 0,
      haveNewVersion: false
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name === 'mMy' || from.name === 'tMy') {
        vm.haveNewVersion = false
        if (vm.$store.state.account.isAndroid) {
          let param = [vm.shell_api, vm.updateInfo]
          window.appPlug.checkVersion(param, succ => {
            if (succ.hasNew === true) {
              vm.haveNewVersion = true
            }
          }, fail => {
            Toast(`${fail}`)
            Toast({ position: 'bottom', message: '获取最新版本信息失败!' })
          })
          window.appPlug.getCacheSize(succ => {
            vm.$route.meta.cache = succ
            vm.cache = succ
          }, fail => {
            Toast({ position: 'bottom', message: '获取缓存大小失败!' })
          })
        }
      } else {
        if (vm.$store.state.account.isAndroid) {
          vm.cache = vm.$route.meta.cache
        }
      }
    })
  },
  computed: {
    ...mapGetters({
      version: 'my/version',
      userId: "account/userId",
      shell_api: "runEnv/shell_api"
    }),
    updateInfo() {
      return {
        user_id: this.userId
      }
    },
    cacheInfo() {
      if (this.cache < 1024 * 1024) {
        if (this.cache === 0 || this.cache === '0') {
          return '0KB'
        }
        return Number(this.cache / 1024).toFixed(2) + 'KB'
      } else {
        return Number(this.cache / 1024 / 1024).toFixed(2) + 'MB'
      }
    }
  },
  methods: {
    clickOverlay () {
      setTimeout(() => {
        this.completeShow = false
      }, 500)
    },
    revisePwd () {
      let path
      if (this.$route.name === 'mSet') {
        path = 'mRevisePwd'
      } else if (this.$route.name === 'tSet') {
        path = 'tRevisePwd'
      } else {
        return false
      }
      this.$router.push({
        name: path
      })
    },
    clear_cache() {
      if (this.cache > 0) {
        window.appPlug.clearCache(succ => {
          this.completeShow = true
          this.cacheText = '清除缓存成功'
          this.cache = 0
          this.$route.meta.cache = 0
          this.close_animation()
        }, fail => {
          this.completeShow = true
          this.cacheText = '清除缓存失败，请重试'
          this.close_animation()
        })
      } else {
        this.completeShow = true
        this.cacheText = '清除缓存成功'
        this.close_animation()
      }
    },
    close_animation () {
      setTimeout(() => {
        this.show = false
        setTimeout(() => {
          this.completeShow = false
        }, 500)
      }, 500)
    },
    check_update() {
      if (this.haveNewVersion) {
        let param = [this.shell_api, this.updateInfo, 1]
        window.appPlug.checkUpdate(param, succ => {
          Toast({ position: 'bottom', message: '更新成功' })
          this.haveNewVersion = false
        }, fail => {
          if (fail && fail !== '') {
            Toast({ position: 'bottom', message: fail })
          }
        })
      } else {
        Toast({ position: 'bottom', message: '你已经是最新版本' })
      }
    }
  },
  components: {
    Cell,
    HeaderBar
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
  #set{
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: #fff;
    .cache{
      width: calc(600px/2);
      height: calc(450px/2);
      font-size: $header-title-s;
      .img{
        text-align: center;
        margin-bottom: calc(30px/2);
        i{
          display: inline-block;
          width: calc(88px/2);
          height: calc(106px/2);
          vertical-align: text-bottom;
        }
      }
      .complete{
        .img{margin-top: 65px}
        i{
          background: url('../../../assets/_images/public/cache_complete.png') no-repeat 0 0;
          background-size: 100% 100%;
        }
      }
      .init{
        .top{
          margin: 65px 0 40px 0;
          i{
            background: url('../../../assets/_images/public/cache.png') no-repeat 0 0;
            background-size: 100% 100%;
          }
        }
        .bottom{
          display: flex;
          justify-content: space-around;
          div{
            width: calc(200px/2);
            height: calc(90px/2);
            line-height: calc(90px/2);
            text-align: center;
            border: 2px solid transparent;
            border-radius: 19%/42%;
          }
          .cancel{
            border: 2px solid $green-primary-color;
            color: $green-primary-color;
          }
          .sure{
            background: $green-primary-color;
            color: #fff;
          }
        }
      }

    }
    .icon{
      position: absolute;
      top: calc(340px/2);
      left: calc(150px/2);
      width: calc(82px/2);
      height: calc(36px/2);
      background: url('../../../assets/_images/public/update.png') no-repeat 0 0;
      background-size: 100% 100%;
    }
  }
</style>
