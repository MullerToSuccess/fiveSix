<template>
  <div id="bing-phone" class="page">
    <div class="bindphonediv">
      <header-bar @back="back"><span slot="title-name">{{title}}</span></header-bar>
      <span class="cl-mark ft13" style="padding-left: 26px; padding-top: 30px; align-self: flex-start">手机号</span>
      <div class="mobilephonefield">
        <img src="@/assets/images/usercenter/mobilephoneicon.png" class="halfscaleelement"/>
        <span class="ft15">+86&nbsp;&nbsp;&nbsp;<span class="cl-bd">|</span></span>
        <van-field class="textfield ft15" v-model.trim="phone" placeholder="请输入手机号" icon="clear" @click-icon="phone = ''" :error-message="validPhone"/>
      </div>
      <div class="van-hairline--bottom" style="width: 90%"> </div>
      <span class="cl-mark ft13" style="padding-left: 26px; padding-top: 30px; align-self: flex-start">验证码</span>
      <div class="mobilephonefield">
        <img src="@/assets/images/usercenter/yanzhengmai.png" class="halfscaleelement"/>
        <van-field class="textfield ft15" v-model.trim="sms" :disabled="isInput" placeholder="请输入验证码" icon="clear" @click-icon="sms = ''"  :error-message="validsms"/>
        <van-button size="small" type="primary" :disabled="smsUseable" @click="sendsms" :class="{greenButton:!smsUseable}" style="border:none;border-radius: 9px;width: 100px; height: 40px">{{content}}</van-button>
      </div>
      <div class="van-hairline--bottom" style="margin-top:3px;width: 90%"> </div>
      <yx-login-btn :disabled="isDisabled" @click="bind" text="绑定手机" class="login-btn"></yx-login-btn>
      <img src="@/assets/images/usercenter/bottomimage.png" style="width: 100%;position: absolute;bottom: 0px"/>
    </div>
    <div v-if="loadingShow" style="position:absolute;top:0px;display: flex;flex-direction:column;justify-content: center;align-items:center;width: 100%;height:100%;background-color: rgba(0,0,0,0.5);">
      <div style="display: flex; flex-direction: column;justify-content: center; align-items: center;padding: 40px;width:60%; height:30%; border-radius:10px; background-color:#fff">
        <img src="@/assets/images/usercenter/bindsucicon.png"/>
        <span style="margin-top: 15px">手机号绑定成功&nbsp;&nbsp;&nbsp;</span>
      </div>
    </div>
  </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex'
import api from '@/module/user-center/axios/usercenter'
import headerBar from '@/components/headerBar.vue'
import {Toast} from 'vant'
import YxLoginBtn from "../../account/components/yx-next-btn";

export default {
  name: 'BindPhone',
  data () {
    return {
      title: '绑定手机号',
      phone: '',
      sms: '',
      validPhone: '',
      smsUseable: true,
      content: '获取验证码',
      validsms: '',
      timer: null,
      timeLen: 60,
      isInput: true,
      loadingShow: false,
      isDisabled: true
    }
  },
  computed: {
    ...mapGetters({
      userId: 'userCenter/userId'
    })
  },
  watch: {
    phone (value) {
      if (value.match(/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57]|19[89])[0-9]{8}$/) && !this.timer) {
        this.smsUseable = false
      } else {
        this.smsUseable = true
      }
    },
    sms (value) {
      if (value && this.phone && !this.isInput) {
        this.isDisabled = false
      } else {
        this.isDisabled = true
      }
    }
  },
  methods: {
    ...mapMutations({
      setPhone: 'account/setPhone'
    }),
    sendsms () {
      this.smsUseable = true
      this.captcha()
      this.timer = setInterval(() => {
        if (this.timeLen < 0) {
          this.clear_interval(this.timer)
          this.content = '发送验证码'
          this.smsUseable = false
          this.timeLen = 60
          return false
        }
        this.content = `${this.timeLen}s`
        this.timeLen--
      }, 1000)
    },
    back () {
      this.$router.back(-1)
    },
    captcha () {
      console.log('captcha')
      this.isInput = false
      api.captcha({
        user_id: this.userId,
        phone: this.phone
      }).then(succ => {
        if (succ.id) {
          Toast({position: 'bottom', message: '验证码发送成功'})
        }
      }).catch((err) => {
        this.clear_interval(this.timer)
        this.content = '发送验证码'
        this.smsUseable = false
        this.timeLen = 60
        this.isInput = true
        this.sms = ''
        Toast({position: 'bottom', message: err.msg})
      })
    },
    clear_interval () {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    routerBack() {
      setTimeout(() => {
        this.loadingShow = false;
        this.$router.back()
        return null
      }, 1000)
    },
    bind () {
      api.bind({
        user_id: this.userId,
        phone: this.phone,
        captcha: this.sms
      }).then(succ => {
        console.log(succ)
        // Toast('绑定成功')
        if (this.timer) {
          this.clear_interval(this.timer)
          this.content = '发送验证码'
          this.smsUseable = false
          this.timeLen = 60
        }
        this.loadingShow = true;
        this.routerBack()
      }, (err) => {
        console.log(err)
        if (err && err.msg) { Toast('绑定失败:' + err.msg) } else { Toast('接口错误') }
      })
    }
  },
  components: {
    YxLoginBtn,
    headerBar
  }
}
</script>
<style scoped>
  .bindphonediv
  {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .login-btn{
    width: 80% !important;
    margin:0 auto;
    margin-top: 60px;
  }
  .mobilephonefield{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 91%;
  }

  .textfield{
    width: 70%;
  }

  .greenButton{
    background-color:#09B784;
  }

  .van-button--disabled
  {
    color: #ffffff;
  }
  .textfield.van-hairline::after {
    border:none;
  }
</style>
