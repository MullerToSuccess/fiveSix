<template>
  <div id="afterQRscan" class="page">
    <header-bar @back="$router.back(-1)">
      <div slot="title-name">二维码扫描</div>
    </header-bar>
    <div class="content">
      <div class="succ-qr" v-if="$route.params.status === '1'">
        <div class="icon icon-succ"></div>
        <p>即将在电脑端登录优学派智慧教育平台</p>
      </div>
      <div class="err-qr" v-else-if="$route.params.status === '-402'">
        <div class="icon icon-err"></div>
        <p>登录确认已失效，请重新扫码登录</p>
      </div>
      <div class="err-qr" v-else-if="$route.params.status === '-400'">
        <div class="icon icon-err"></div>
        <p>二维码已失效,请刷新PC端二维码,重新扫码</p>
      </div>
      <div class="err-qr" v-else-if="$route.params.status === '-500'">
        <div class="icon icon-err"></div>
        <p>接口参数错误,请联系管理员</p>
      </div>
      <div v-else class="err-qr">
        <div class="icon icon-err"></div>
        <p>二维码无效，请在电脑端打开优学派智慧教育平台并扫码登录</p>
      </div>
      <div class="login-btn" v-if="$route.params.status === '1'" @click="login">确认登录</div>
      <div class="login-btn" v-else @click="reScan">重新扫码登录</div>
    </div>
  </div>
</template>
<script>
import headerBar from '@/components/headerBar'
import homeApi from "@/module/home/axios/home"
import {mapGetters} from "vuex"
import {Toast} from "vant"
export default {
  name: 'afterScan',
  computed: {
    ...mapGetters({
      userId: "userCenter/userId"
    })
  },
  methods: {
    login() {
      homeApi.qrcode({
        token: this.userId,
        uuid: this.$route.params.uuid,
        action: 'login'
      }).then(succ => {
        this.$router.replace({path: '/afterQRscan/1/' + uuid})
      }, fail => {
        if (fail.status === -400) {
          Toast('二维码失效！')
          this.$router.replace({path: '/afterQRscan/-400/' + uuid})
        } else if (fail.status === -402) {
          Toast('登录确认已失效！')
          this.$router.replace({path: '/afterQRscan/-402/' + uuid})
        } else if (fail.status === -500) {
          Toast('接口请求参数错误！')
          this.$router.replace({path: '/afterQRscan/-500/' + uuid})
        } else if (fail.status === 2) {
          Toast('登录成功')
          this.$router.back(-1)
        } else {
          Toast(fail.msg);
        }
      })
    },
    reScan() {
      window.appPlug.scanQRCode((info) => {
        let reg = /\?(.*)/
        let match
        let uuid = (match = reg.exec(info)) && match[1];
        if (match && uuid) {
          // 扫描后获取参数成功
          homeApi.qrcode({
            token: this.userId,
            uuid: uuid,
            action: 'scan'
          }).then(succ => {
            this.$router.replace({path: '/afterQRscan/1/' + uuid})
          }, fail => {
            if (fail.status === -400) {
              Toast('二维码失效！')
              this.$router.replace({path: '/afterQRscan/-400/' + uuid})
            } else if (fail.status === -402) {
              Toast('登录确认已失效！')
              this.$router.replace({path: '/afterQRscan/-402/' + uuid})
            } else if (fail.status === -500) {
              Toast('接口请求参数错误！')
              this.$router.replace({path: '/afterQRscan/-500/' + uuid})
            } else if (fail.status === 2) {
              Toast('登录成功')
              this.$router.back(-1)
            } else {
              Toast(fail.msg);
            }
          })
        } else {
          this.$router.replace({path: '/afterQRscan/-1000/1000'})
        }
      }, (err) => {
        Toast(err)
      })
    }
  },
  components: {
    headerBar
  }
}
</script>
<style lang="scss" scoped>
#afterQRscan{
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  font-size: 16px;
  .content{
    width: 100%;
    height: calc(100% - 45px);
    overflow: hidden;
    position: relative;
    padding: 0 13px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    .icon{
      display: inline-block;
      width: 160px;
      height: 159px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: 0 0;
      margin-bottom: 20px;
    }
    .succ-qr{
      text-align: center;
      flex: 1;
      margin-top: 30%;
      .icon-succ{
        background-image: url('../../../assets/images/home/qrcode-success.png')
      }
      p{
        color: #666
      }
    }
    .err-qr{
      text-align: center;
      flex: 1;
      margin-top: 30%;
      .icon-err{
        background-image: url('../../../assets/images/home/qrcode-fail.png')
      }
      p{
        color: #666
      }
    }
    .login-btn{
      position: absolute;
      bottom: 30px;
      left: 13px;
      width: calc(100% - 26px);
      height: 45px;
      line-height: 45px;
      text-align: center;
      background: linear-gradient(to right, #08b884 ,#12d198);
      color: #fff;
      border-radius: 10px;
    }
  }
}
</style>
