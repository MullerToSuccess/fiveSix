<template>
  <div id="user-info" class="page">
    <header-bar @back="back"><span slot="title-name">{{title}}</span></header-bar>
    <div class="box" v-if="userInfo">
      <div class="item-choice-heighter van-hairline--bottom" @click="modifyIcon">
        <span>头像</span>
        <div style="height:100%;display: flex; align-items: center">
          <!--<div style="width: 14vw;height: 14vw; border-radius: 14vw; overflow: hidden">

          </div>-->
          <img :src="userInfo.avatar.indexOf('http://')==-1?this.$store.getters['runEnv/old'] + userInfo.avatar:userInfo.avatar" class="avatar" alt="">
          <van-icon name="arrow" class="cl-mark van-icon"></van-icon>
        </div>
      </div>
      <div class="item-choice van-hairline--bottom">
        <span>账号</span>
        <span class="cl-dec">{{userInfo.loginnm}}</span>
      </div>
      <router-link class="item-choice van-hairline--bottom" tag="div" :to="{path:'/modifyName/' + userInfo.real_name}">
        <span>姓名</span>
        <span><span class="cl-dec">{{userInfo.real_name}}</span><van-icon name="arrow" class="cl-mark van-icon"></van-icon></span>
      </router-link>
      <div class="item-choice van-hairline--bottom">
        <span>学校</span>
        <span class="cl-dec">{{userInfo.school_name}}</span>
      </div>
      <div class="item-choice van-hairline--bottom" @click="link(userInfo.phone)">
        <span>手机号</span>
        <span><span class="cl-dec">{{userInfo.phone || '未绑定'}}</span><van-icon name="arrow" style="vertical-align:middle;top:-2px" class="cl-mark van-icon"></van-icon></span>
      </div>
    </div>
    <van-actionsheet v-model="showActionSheet" :actions="actions" cancel-text="取消" />
    <van-popup v-model="loadingShow" :close-on-click-overlay="false" :overlay-style="popupoverlaystyle">
      <van-loading color="black" />
    </van-popup>
  </div>
</template>

<script>
import api from '@/module/user-center/axios/usercenter'
import headerBar from '@/components/headerBar.vue'
import {mapState, mapMutations} from 'vuex'
export default {
  name: 'Personal',
  data () {
    return {
      showActionSheet: false,
      sexActionSheet: false,
      pickerShow: false,
      title: '个人信息',
      hasBack: true,
      userInfo: null,
      avatarUrl: null,
      loadingShow: false,
      popupoverlaystyle: { backgroundColor: 'rgba(255,255,255,0.5)' },
      actions: [
        {
          name: '拍照',
          callback: this.capturePhoto
        },
        {
          name: '从手机相册选择',
          callback: this.selectImagesFromLocal
        }
      ]
    }
  },
  mounted () {
    api.obtainInfo({
      user_id: this.userId
    }).then(succ => {
      this.userInfo = succ
      Object.assign(this.uInfo, succ)
    })
  },
  computed: {
    ...mapState({
      userId: state => state.account.userInfo.userid,
      uInfo: state => state.account.userInfo
    })
  },
  methods: {
    ...mapMutations({
      setAvatar: 'account/setAvatar',
      setUserName: 'account/setUsername'
    }),
    link (phone) {
      if (phone) {
        this.$router.push({path: `/modifyPhone/${phone}`})
        // this.$router.push({path: '/bindPhone'})
      } else {
        this.$router.push({path: '/bindPhone'})
      }
    },
    modifyIcon () {
      this.showActionSheet = true
    },
    back () {
      this.$router.back(-1)
    },
    capturePhoto () {
      window.appPlug.capturePhoto(this.getImagesSuc, this.getImagesFail, true, false, 200, 200)
      this.loadingShow = true
    },
    selectImagesFromLocal () {
      window.appPlug.getImage(this.getImagesSuc, this.getImagesFail, true, false, 200, 200)
      this.loadingShow = true
    },
    getImagesSuc (v) {
      let formData = new FormData()
      formData.append('code', v)
      let url
      api.uploadImage(
        '/api_dist/index.php?q=json/user/UserAvatar/uploadAvatar&info={"binary":"0"}&userid=' + this.userInfo.userid, formData
      ).then(succ => {
        url = succ.result
        this.modifyAvatar(url)
      })
      this.showActionSheet = false
    },
    getImagesFail (e) {
      this.loadingShow = false
      // alert(e)
    },
    modifyAvatar (url) {
      api.modify({
        user_id: this.userId,
        data: {
          avatar: this.$store.getters['runEnv/old'] + url + '?v=' + new Date().getTime()
        }
      }).then(succ => {
        this.avatarUrl = url + '?v=' + new Date().getTime()
        this.setAvatar(this.avatarUrl)
        this.userInfo.avatar = this.avatarUrl
        this.loadingShow = false
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name === 'modifyName' && from.meta.real_name) {
        to.meta.real_name = from.meta.real_name
        from.meta.real_name = null
      }
    })
  },
  beforeRouteLeave (to, from, next) {
    if (this.showActionSheet) {
      this.showActionSheet = false
      next(false)
    } else {
      if (this.avatarUrl) {
        this.$route.meta.avatarUrl = this.avatarUrl
      }
      next()
    }
  },
  components: {
    headerBar
  }
}
</script>

<style scoped>
  .box * {
    font-size: 16px;
  }
  #user-info .item-choice{
    display: flex;
    justify-content: space-between;
    height: 50px;
    line-height: 50px;
    padding: 0 15px;
  }
  #user-info .item-choice-heighter
  {
    display: flex;
    justify-content: space-between;
    height: 70px;
    line-height: 70px;
    padding: 0 15px;
  }

  #user-info .item-choice .avatar,#user-info .item-choice-heighter .avatar{
    width: 14vw;
    height: 14vw;
    border-radius: 50%;
  }

  .time-picker{
    position: fixed;
    z-index: 2;
    width: 100%;
    bottom: 0;
    left: 0;
  }
  .model{
    width: 100%;
    z-index: 1;
    /*height: calc(100% - 260px);*/
    height: 100%;
    position: fixed;
    top: 0;
    background-color: rgba(0,0,0,.3)
  }
  .item-choice,.item-choice-heighter{
    margin:auto;
    width: 86%;
  }
  .van-icon{
    vertical-align:middle;
    top:-2px;
    margin-left: 10px;
  }
</style>
