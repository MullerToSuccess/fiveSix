<template>
<div class="correction">
  <div class="title">
     <header-bar @back="goBack">
        <div slot="title-name">
          <div>纠错</div>
        </div>
      </header-bar>
  </div>
  <div class="wrapper">
     <div class="classify">
    <div>
      <span v-for="(item,index) in classify" :key="index" :class="{'checked':isChecked(index)}" @click="checkItem(index)">
        {{item}}
      </span>
    </div>
  </div>
  <div class="describe">
    <textarea name="describe" v-model="msg" placeholder="请描述错误内容，我们会尽快处理" :maxlength=maxLength></textarea>
  </div>
  <div class="upload">
    <div class="total">
      <div>
        上传问题截图<span class="num">（<b style="color:#4e4e50;">{{imgs.length}}</b>/8）</span>
      </div>
    </div>
    <div class="container">
      <div class="item" v-for="(img,index) in imgs" :key="index">
        <span class="close" @click="remove(index)"></span>
        <img :src="img" alt="" width="100%" height="100%">
      </div>
      <div class="item upload" @click="togglePopup" v-show="this.imgs.length<maxImageNum">
        <img class="up" src="../../../assets/images/correction/up.png"/>
        <p>
          <template v-if="imgs.length===0">点击上传</template>
          <template v-else-if="imgs.length>0">继续上传</template>
        </p>
      </div>
    </div>
  </div>
  </div>

  <van-popup type="my-popup" position="bottom" v-model="showPopup" class="popup">
    <div class="popupWrapper">
      <div class="popupItem" @click="capturePhoto">拍照</div>
      <div class="popupItem" @click="selectImagesFromLocal">从相册获取</div>
      <div class="popupItem" @click="togglePopup">取消</div>
</div>

</van-popup>
  <div class="submitBtn" @click="commit" :class="{disable:!checked.length&& !msg.length}">
    <!-- <van-button type="primary" bottom-action>提交</van-button> -->
     <template v-if="loading">
      <van-loading type="spinner" color="black" class="loading"/>
      提交中
    </template>
    <template v-else>
      提交
    </template>
  </div>
</div>
</template>

<script>
import headerBar from '@/components/headerBar.vue'
import correction from '../axios/correction.js'
import { Toast } from 'vant'
export default {
  name: 'correction',
  data () {
    return {
      maxImageNum: 8,
      msg: '',
      imgs: [],
      imgUrl: [],
      classify: {
        10: '内容超纲',
        11: '答案错误',
        12: '题干错误',
        13: '题目过时',
        14: '解析错误',
        15: '知识点不符',
        16: '其他'
      },
      checked: [],
      loading: false,
      showPopup: false,
      maxLength: 100
    }
  },
  created () {
    this.imgs = []
    this.msg = ""
    this.imgUrl = []
    this.getAuthority()
    this.checked = []
  },
  computed: {},
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    togglePopup () {
      this.showPopup = !this.showPopup
    },
    isChecked (index) {
      return this.checked.indexOf(index) >= 0
    },
    checkItem (index) {
      if (this.checked.indexOf(index) < 0) {
        this.checked.push(index)
      } else {
        this.checked.splice(this.checked.indexOf(index), 1)
      }
    },
    remove (index) {
      this.imgs.splice(index, 1)
    },
    getAuthority () {
      let params = {
        user_id: JSON.parse(localStorage.userinfo).userid
      }
      correction.getAuthority(params).then(r => {
        this.upToken = r.mo_authority_token
      })
    },
    commit () {
      if (!this.checked.length && !this.msg.length) {
        return false
      }
      this.loading = true
      let params = {
        user_id: JSON.parse(localStorage.userinfo).userid,
        rsid: this.$route.params.rsid,
        type: this.checked,
        content: this.msg,
        images: this.imgUrl
      }
      correction.create(params).then(r => {
        this.loading = false
        Toast('提交成功！感谢您的参与，我们会尽快审核')
        setTimeout(() => {
          this.goBack()
        }, 2000)
      })
    },
    capturePhoto () {
      window.appPlug.capturePhoto(this.getImagesSuc, this.getImagesFail, true, false)
    },
    selectImagesFromLocal () {
      window.appPlug.getImage(this.getImagesSuc, this.getImagesFail, true, false)
    },
    getImagesSuc (v) {
      this.imgs.unshift('data:image/png;base64,' + v)
      this.togglePopup()
      let param = {
        user_id: JSON.parse(localStorage.userinfo).userid,
        mo_authority_token: this.upToken,
        image: 'data:image/png;base64,' + v
      }
      // this.imgs.unshift('data:image/png;base64,' + v)
      // if (this.imgs.length >= this.maxImageNum) {
      //   this.togglePopup()
      // }
      correction.upload(param).then(r => {
        console.log(r)
        // this.imgs.unshift(r.host_static + r.path_physical)
        this.imgUrl.unshift(r.path_physical)
        if (this.imgs.length >= this.maxImageNum) {
          this.togglePopup()
        }
      })
    },
    getImagesFail (e) {
      alert(e)
    }
  },
  components: {
    headerBar
  }
}
</script>

<style scoped>
.correction {
  height: 100vh;
}
.wrapper {
  height: calc(100% - 112px);
  overflow-y: auto;
  border-bottom: 1px solid #e8ebee;
}
.correction .classify {
  text-align: center;
  padding: 20px 13px 0px;
}

.correction .classify > div {
  display: flex;
  flex-wrap: wrap;
}
.correction .classify > div > span {
  display: inline-block;
  width: 110px;
  height: 40px;
  flex: 0 1 auto;
  line-height: 40px;
  border-radius: 5px;
  background: #f5f7f8;
  font-size: 17px;
  margin-right: 9.5px;
  margin-bottom: 10px;
}
.correction .classify > div > span:nth-child(3),
.correction .classify > div > span:nth-child(6) {
  margin-right: 0px;
}
.correction .classify > div > span.checked {
  background: #08b783;
  color: #fff;
}
.correction .describe {
  padding: 0 13px;
  margin-bottom: 10px;
}
.correction .describe textarea {
  width: 100%;
  height: 148px;
  resize: none;
  border-radius: 5px;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #e8ebee;
}

.correction .describe ::placeholder {
  color: #ccc;
}
.correction .upload {
  padding: 0 13px;
  box-sizing: border-box;
  margin-bottom: 7px;
}
.correction .upload > .total {
  margin: 8px 0;
}

.correction .upload > .total b {
  font-weight: normal;
}
.correction .upload > .total span.num {
  color: rgb(128, 129, 131);
}
.correction .upload > .container {
  display: flex;
  flex-wrap: wrap;
}
.correction .upload > .container > .item {
  flex: 0 1 auto;
  width: 100px;
  height: 100px;
  text-align: center;
  vertical-align: middle;
  background: #f5f7f8;
  padding: 15px;
  box-sizing: border-box;
  margin-right: 18px;
  margin-top: 15px;
  position: relative;
}
.correction .upload > .container > .item:nth-child(3),
.correction .upload > .container > .item:nth-child(6),
.correction .upload > .container > .item:nth-child(9) {
  margin-right: 0;
}
.correction .upload > .container > .item > img.up {
  margin-top: 5px;
  margin-bottom: 10px;
}
.correction .upload > .container > .item span.close {
  display: inline-block;
  width: 18px;
  height: 18px;
  background-image: url("../../../assets/images/public/deleteselectedimage.png");
  background-size: 100% 100%;
  background-position: center center;
  background-repeat: no-repeat;
  position: absolute;
  right: 0;
  top: 0;
  transform: translate(30%, -30%);
}
.correction .upload > .container > .item.upload p {
  color: #c8c9c9;
  font-size: 14px;
}
.correction .popup{
  background-color: transparent;
}
.correction .popupWrapper {
  margin: 0 13px 8px;
  font-size: 16px;
  color: #1e1e1e;
}
.correction .popupItem {
  background: #fff;
  line-height: 48px;
  height: 48px;
  box-sizing: border-box;
  text-align: center;
  border-bottom: 1px solid #e8ebee;
}
.correction .popupItem:first-child {
  border-top-left-radius: 13px;
  border-top-right-radius: 13px;
}
.correction .popupItem:nth-child(2) {
  border-bottom-left-radius: 13px;
  border-bottom-right-radius: 13px;
}
.correction .popupItem:last-child {
  margin-top: 15px;
  border-radius: 13px;
}
.correction .submitBtn {
  position: fixed;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 180px;
  border-radius: 13px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background: #08b783;
  color: #fff;
  font-size: 17px;
}
.correction > .submitBtn.disable {
  opacity: 0.5;
}
.loading{
  display: inline-block;
  width:20px;
  height: 20px;
  position: relative;
  top:-3px;
}
</style>
