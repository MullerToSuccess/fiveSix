<template>
  <div id="c-edit-photo">
    <div class="photo-display" @click="popup">
      <img :src="imgShow ? img : editMsg">
    </div>
    <van-popup v-model="show" position="bottom" class="pop-photo" style="width: 93%">
      <div class="pop-top">
        <div class="photo-btn" @click="selectImagesFromLocal">从相册选择</div>
        <div class="photo-btn" @click="capturePhoto">拍照</div>
      </div>
      <div class="photo-btn photo-cancel" @click="show = false">取消</div>
    </van-popup>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters, mapMutations} from 'vuex'
import commonAPI from 'common/api/api'
import * as filters from '@/filter/index'
import {Toast} from 'vant'

export default {
  name: 'cEditPhoto',
  data () {
    return {
      img: '',
      show: false,
      file: ''
    }
  },
  computed: {
    ...mapGetters({
      editMsg: 'managerCommon/editMsg',
      editMsgKey: 'managerCommon/editMsgKey',
      imgShow: 'managerCommon/imgShow'
    })
  },
  created () {
    this.setImgShow(false)
    this.$store.commit('managerCommon/SET_ISSAVE', true)
  },
  methods: {
    popup () {
      this.show = true
    },
    capturePhoto () {
      window.appPlug.capturePhoto(this.getImagesSuc, this.getImagesFail, true, false, 200, 200)
    },
    selectImagesFromLocal () {
      window.appPlug.getImage(this.getImagesSuc, this.getImagesFail, true, false, 200, 200)
    },
    getImagesSuc (v) {
      let size = filters.showSize(v)
      this.img = 'data:image/png;base64,' + v
      this.setImgShow(true)
      this.show = false
      if (size <= 500) {
        commonAPI.uploadByBase64({
          file: this.img
        }).then(r => {
          this.setFilePath(r.filePath)
          this.setFileUrl(r.fileUrl)
        })
      } else {
        Toast(`图片大小不能超过500kb`)
      }
    },
    getImagesFail (e) {
      this.show = false
    },
    ...mapMutations({
      setEditMsg: 'managerCommon/SET_EDITMSG',
      setTeacherClassLists: 'managerTeacher/SET_CLASSLISTS',
      setFilePath: 'managerCommon/SET_FILEPATH',
      setImgShow: 'managerCommon/SET_IMGSHOW',
      setFileUrl: 'managerCommon/SET_FILEURL'
    })
  }
}
</script>

<style scoped lang="scss">
 @import "@/style/variable.scss";
  .photo-display{
    width: calc(400px/2);
    height: calc(400px/2);
    margin:  0 auto;
    justify-content: center;
    align-items: center;
    padding: calc(100px/2);
    img{
      width: 100%;
      height: 100%;
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
