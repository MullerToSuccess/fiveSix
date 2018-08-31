<template>
  <div id="setting" class="page">
    <div style="background-color: #fff;flex:0;">
      <header-bar @back="back">
        <span slot="title-name">{{title}}</span>
      </header-bar>
      <van-cell-group class="box">
        <div v-if="isShowCacheAndUpdata" class="item-choice van-hairline--bottom" @click="clear_cache">
          <span>清除缓存</span>
          <span>
            <span class="cl-dec" v-if="!isClearCache">{{cacheInfo}}</span>
            <van-loading v-else style="display: inline-block;top: -2px" slot="right-icon" size="20px" type="spinner" color="black" />
            <van-icon name="arrow" class="cl-mark van-icon"></van-icon>
          </span>
        </div>
        <div class="item-choice van-hairline--bottom" @click="linkTo('password')">
          <span>修改密码</span>
          <span>
            <van-icon name="arrow" class="cl-mark van-icon"></van-icon>
          </span>
        </div>
        <div class="item-choice van-hairline--bottom" @click="linkTo('setting')">
          <span>消息设置</span>
          <span>
            <van-icon name="arrow" class="cl-mark van-icon"></van-icon>
          </span>
        </div>
        <div v-if="isShowCacheAndUpdata" class="item-choice van-hairline--bottom" @click="check_update">
          <span>
            <span>检查更新</span>
            <img v-if="haveNewVersion" src="@/assets/images/usercenter/new.png" style="width: 10vw;vertical-align: middle;position: relative;top: -2px"/>
          </span>
          <span>
            <span class="cl-dec">{{this.version}}</span>
            <van-icon name="arrow" class="cl-mark van-icon"></van-icon>
          </span>
        </div>
      </van-cell-group>
    </div>
    <bottom-button-area :disabled="false" @click="showActionSheet = true;" buttonText="退出" color="red"></bottom-button-area>
    <van-actionsheet v-model="showActionSheet" :actions="actions" cancel-text="取消" />
  </div>
</template>

<script>
import headerBar from '@/components/headerBar.vue'
import BottomButtonArea from '@/module/user-center/components/common/bottomButtonArea'
import { Toast } from 'vant'
import { mapState, mapActions, mapGetters } from 'vuex'
import storage from '@/store/stroage.js'
export default {
  name: 'Setting',
  data() {
    return {
      title: '设置',
      hasBack: true,
      showActionSheet: false,
      cache: 0,
      isShowCacheAndUpdata: false,
      haveNewVersion: false,
      isClearCache: false,
      actions: [
        {
          name: '退出登录',
          callback: this.loginOut,
          className: 'warning'
        }
      ]
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.$store.state.account.isAndroid) {
        vm.isShowCacheAndUpdata = true
      } else {
        vm.isShowCacheAndUpdata = false
      }
      if (from.name === 'userCenter') {
        vm.haveNewVersion = false
        vm.isClearCache = false
        if (vm.$store.state.account.isAndroid) {
          let param = [vm.shell_api, vm.updateInfo]
          window.appPlug.checkVersion(param, succ => {
            if (succ.hasNew === true) {
              vm.haveNewVersion = true
            }
          }, fail => {
            Toast({ position: 'bottom', message: '获取版本信息失败!' })
          })

          window.appPlug.getCacheSize(succ => {
            vm.$route.meta.cache = succ
            vm.cache = succ
          }, fail => {
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
    ...mapState({
      version: state => 'V' + state.userCenter.version
    }),
    ...mapGetters({
      userId: "userCenter/userId",
      shell_api: "runEnv/shell_api"
    }),
    updateInfo() {
      return {
        user_id: this.userId
      }
    },
    cacheInfo() {
      if (this.isClearCache) {
        return ''
      }
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
    ...mapActions({
      doLoginOut: 'account/doLoginOut'
    }),
    linkTo(param) {
      if (param === 'password') {
        this.$router.push({ path: '/modifyPassword' })
      } else {
        this.$router.push({ path: '/msgSetting' })
      }
    },
    clear_cache() {
      if (this.cache > 0) {
        this.$dialog.confirm({
          title: '',
          message: '是否清除缓存？'
        }).then(() => {
          this.isClearCache = true
          window.appPlug.clearCache(succ => {
            Toast({ position: 'bottom', message: '清除缓存成功' })
            this.cache = 0
            this.$route.meta.cache = 0
            this.isClearCache = false
          }, fail => {
            this.isClearCache = false
            Toast({ position: 'bottom', message: '清除缓存失败，请重试' })
          })
        }).catch(() => {
          // on cancel
        });
      } else {
        Toast({ position: 'bottom', message: '清除缓存成功' })
      }
    },
    check_update() {
      if (this.haveNewVersion) {
        let param = [this.shell_api, this.updateInfo, 1]
        window.appPlug.checkUpdate(param, succ => {
          Toast({ position: 'bottom', message: '更新成功' })
          this.isClearCache = false
          this.haveNewVersion = false
        }, fail => {
          if (fail && fail !== '') {
            Toast({ position: 'bottom', message: fail })
          }
        })
      } else {
        Toast({ position: 'bottom', message: '您的版本已经是最新版本' })
      }
    },
    back() {
      this.$router.back(-1)
    },
    loginOut() {
      this.showActionSheet = false
      // localStorage.clear();
      sessionStorage.isShowedBindPhone = false
      if (window.bus.mqtt.client && window.bus.mqtt.client.isConnected()) {
        window.bus.mqtt.client.disconnect()
      }
      this.doLoginOut();
      this.$router.push({ path: '/login?redirect=/' })
    }
  },
  components: {
    headerBar,
    BottomButtonArea
  }
}
</script>

<style scoped>
  #setting {
    height: 100%;
    background-color: #f6f7f9;
    display: flex;
    flex-direction: column;
  }
  .aboutus-van-cell {
    width: 97%;
  }
  .box * {
    font-size: 16px;
  }
  .item-choice{
    display: flex;
    justify-content: space-between;
    height: 50px;
    line-height: 50px;
    padding: 0 15px;
    margin:auto;
    width: 90%;
  }
  .van-icon{
    vertical-align:middle;
    top:-2px;
    margin-left: 2px;
  }
</style>
<style lang="scss">
  .checkup .van-cell__value {
    flex: 1;
    & span {
      white-space: nowrap;
    }
  }
</style>
