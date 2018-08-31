<template>
  <transition name="slide">
    <div id="revise-pwd">
      <header-bar>
        <div slot="title-name" @back="back">修改密码</div>
      </header-bar>
      <div class="pwd-content">
        <yx-field @focus="onfocus" v-model.trim="pwdP" type="password" label="原密码" label-icon="password" placeholder="请输入密码" @click-clear="pwdP = ''"></yx-field>
        <yx-field @focus="onfocus" v-model.trim="pwd" type="password" label="新密码" label-icon="password" placeholder="请输入密码" @click-clear="pwd = ''"></yx-field>
        <yx-field @focus="onfocus" v-model.trim="pwdN" type="password" label="确认密码" label-icon="password" placeholder="请输入密码" @click-clear="pwdN = ''"></yx-field>
      </div>
      <div class="login-btn" @click="sure">
        <div class="login-btn">确定</div>
      </div>
    </div>
  </transition>
</template>

<script>
import HeaderBar from 'common/components/headerBar'
import YxField from 'common/components/yx-field'
import {Toast} from 'vant'
import {mapGetters} from 'vuex'
import my from '../api/my'
import {SHA256} from '@/utils/sha256'
export default {
  name: 'revisePwd',
  data () {
    return {
      pwdP: '',
      pwd: '',
      pwdN: '',
      pattern: /^[a-zA-Z0-9]{6,10}$/
    }
  },
  computed: {
    ...mapGetters({
      password: 'account/password'
    })
  },
  methods: {
    back () {
      this.$router.push({
        name: 'option-m',
        params: {
          component: 'set',
          isSave: false,
          config: ''
        }
      })
    },
    onfocus () {},
    sure () {
      if (this.pwdP !== this.password) {
        Toast('原密码输入错误')
        return false
      }
      if (!this.pattern.test(this.pwd) || !this.pattern.test(this.pwd)) {
        Toast('请输入至少6位数字、字母！')
      } else {
        if (this.pwd === this.pwdN && this.pwd !== '') {
          this.post()
        } else {
          this.pwd = ''
          this.pwdN = ''
          Toast('两次输入密码不一样！')
        }
      }
    },
    post () {
      my.updatePassword({
        password: SHA256(this.pwdP),
        newPassword: SHA256(this.pwd)
      }).then(succ => {
        Toast('密码修改成功')
        this.$store.commit('account/setPassword', this.pwd)
      }).catch(err => {
        Toast({position: 'bottom', message: err.msg})
      })
    }
  },
  components: {
    YxField,
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
  #revise-pwd{
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: #fff;
    .pwd-content{
      margin-top: calc(50px/2);
      padding: 0 calc(50px/2);
    }
    .login-btn{
      width: calc(600px/2);
      height: calc(90px/2);
      margin: 105px auto 0;
      color: #fff;
      text-align: center;
      letter-spacing: calc(8px/2);
      line-height: calc(90px/2);
      border-radius: calc(40px/2);
      font-size: calc(38px/2);
      background: $green-primary-color;
    }
  }
</style>
