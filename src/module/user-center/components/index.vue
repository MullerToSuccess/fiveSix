<template>
  <div id="user-center" class="page">
    <div class="box">
      <div>
        <!-- <div style="position:absolute;left:0;top:0;z-index:100;font-size: 10px;">
          代码:【{{location_now.split('#')[0]}}】<br>
          版本:【{{version}}】<br>
          环境:【{{this.$store.getters['runEnv/old']}}】<br>
          (正式环境不会显示本行)
        </div> -->
        <img :style="greenbackStyle" @load="greenbackLoaded" :src="greenbackBase64" width="100%"  alt="">
        <div class="user-center-header">
          <img src="@/assets/images/usercenter/bg-white.png" width="100%" alt="">
          <div class="div-img">
            <router-link :to="{path:'/personal'}">
              <div style="width: 20vw;height: 20vw; border-radius: 50%; overflow: hidden;border: 0.5vw solid #ffffff;display: inline-block;">
                <img :src="avatar" alt="..." class="avatar">
              </div>
            </router-link>
          </div>
          <img class="img-edit" @click="gotoperson" src="@/assets/images/usercenter/edit.png" alt="">
          <p class="person-data person-name">{{userName}}</p>
          <p class="person-data person-school">{{school_name}}</p>
          <!-- <p class="person-data person-phone">{{phone}}</p> -->
        </div>
      </div>
      <div class="scroll">
        <van-cell is-link border class="indexvancell">
          <router-link class="item-choice" tag="div" :to="{path:'/myClass'}"><img src="@/assets/images/usercenter/persionindexlisticon_01.png" class="item-choice-icon item-icon"/>我的班级</router-link>
        </van-cell>
        <van-cell is-link border class="indexvancell">
          <router-link class="item-choice" tag="div" :to="{path:'/feedback'}"><img src="@/assets/images/usercenter/persionindexlisticon_02.png" class="item-choice-icon item-icon"/>意见反馈</router-link>
        </van-cell>
        <van-cell is-link border class="indexvancell">
          <router-link class="item-choice" tag="div" :to="{path:'/setting'}"><img src="@/assets/images/usercenter/persionindexlisticon_03.png" class="item-choice-icon item-icon"/>设置</router-link>
        </van-cell>
        <van-cell is-link border class="indexvancell">
          <router-link class="item-choice" tag="div" :to="{path:'/aboutUs'}"><img src="@/assets/images/usercenter/persionindexlisticon_04.png" class="item-choice-icon item-icon"/>关于我们</router-link>
        </van-cell>
      </div>
    </div>
    <footer-bar activeType="my" @tabChange="tabChange"></footer-bar>
  </div>
</template>

<script>
import footerBar from '@/components/footerBar'
import {mapState} from 'vuex'
import api from '@/module/user-center/axios/usercenter'
export default {
  name: 'UserCenter',
  data () {
    return {
      active: 1,
      hasBack: false,
      version: window.version,
      greenbackHeight: document.documentElement.clientWidth / 750 * 305 + 'px',
      greenbackDisplay: 'inline-block',
      greenbackBase64: window.greenbackBase64,
      location_now: window.location.href,
      animateConfig: {
        disable: true
      }
    }
  },
  created () {
    if (window.greenbackBase64) return
    let image = new Image()
    image.src = require("@/assets/images/usercenter/bg-green.jpg")
    image.onload = () => {
      window.greenbackBase64 = this.getBase64Image(image)
      this.greenbackBase64 = window.greenbackBase64
    }
  },
  mounted () {
    api.obtainInfo({
      user_id: this.userInfo.userid
    }).then(succ => {
      Object.assign(this.userInfo, succ)
    })
    this.$route.meta.isAndroid = false
    if (window.appPlug) {
      if (window.appPlug.platform === 'android') {
        this.$route.meta.isAndroid = true
      }
      window.appPlug.getversion(succ => {
        this.$store.commit('userCenter/setVersion', succ)
      }, fail => {
        setTimeout(() => {
          window.appPlug.getversion(succ => {
            this.$store.commit('userCenter/setVersion', succ)
          }, fail => {})
        }, 1000)
      })
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.account.userInfo
    }),
    avatar () {
      return this.userInfo.avatar.indexOf('http://') === -1 ? this.$store.getters['runEnv/old'] + this.userInfo.avatar : this.userInfo.avatar
    },
    userName () {
      return this.userInfo.real_name
    },
    school_name () {
      return this.userInfo.school_name
    },
    phone () {
      return this.userInfo.phone
    },
    greenbackStyle () {
      return {
        height: this.greenbackHeight,
        display: this.greenbackDisplay
      }
    }
  },
  methods: {
    greenbackLoaded () {
      this.greenbackHeight = 'auto'
      this.greenbackDisplay = 'inline'
    },
    tabChange (type) {
      if (type === 'my') {
        return false
      }
      this.$router.back(-1)
    },
    gotoperson () {
      this.$router.push({path: '/personal'})
    },
    getBase64Image(img) {
      let canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      let ctx = canvas.getContext("2d")
      ctx.drawImage(img, 0, 0, img.width, img.height)
      let ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase()
      let dataURL = canvas.toDataURL("image/" + ext)
      canvas = null
      img = null
      return dataURL
    }
  },
  components: {
    footerBar
  }
}
</script>

<style scoped>
  .box *{
    font-size: 16px;
  }
  .scroll *{
    font-size: 16px;
  }
  .scroll{
    height: calc( 100vh - 310px );
    overflow-y: auto;
    overflow-x: hidden;
  }
  #user-center .item-choice{
    line-height: 50px;
    height: 50px;
    padding: 0 15px;
  }
  .user-center-header{
    margin-top: -60px;
    margin-left: 10px;
    margin-right: 10px;
    height: 160px;
  }
  .item-icon{
    width: 5.2vw;
  }
  .div-img{
    position: relative;
    text-align: center;
    top: -80px;
    width: 30%;
    margin: 0 auto;
  }
  .avatar{
    width: 20vw;
    height: 20vw;
  }
  .div-edit{
    height:30px;
    width:30px;
    display: inline-block;
    position: absolute;
    right: 30px;
    top: 140px;
  }
  .img-edit{
    height:30px;
    display: inline-block;
    position: absolute;
    right: 30px;
    top: 140px;
  }
  .person-data{
    position: relative;
    text-align: center;
    top: -70px;
  }
  .person-name{

  }
  .person-school{
    margin-top: 6px;
    color: #c8c9c9;
  }
  .person-phone{
    margin-top: 12px;
  }
  #user-center .item-choice{
    padding: 0 5px;
    display: flex;
    align-items: center;
    height: 30px;
  }
  .item-choice-icon{
    padding-right: 10px;
  }
  indexvancell
  {
    width:99%;
  }
</style>
