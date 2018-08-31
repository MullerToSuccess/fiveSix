<template>
  <div id="c-edit-photo">
    <div class="photo-display" @click="show = true">
      <img :src="img">
    </div>
    <van-popup v-model="show" position="bottom" class="pop-photo" style="width: 93%">
      <div class="pop-top">
        <div class="photo-btn">从相册选择</div>
        <div class="photo-btn">拍照</div>
      </div>
      <div class="photo-btn photo-cancel" @click="show = false">取消</div>
    </van-popup>
  </div>
</template>

<script type="text/ecmascript-6">
import img from '@/assets/images/public/audio.jpg'
export default {
  name: 'cEditPhoto',
  data () {
    return {
      img: img,
      show: false
    }
  }
}
</script>

<style scoped lang="scss">
 @import "@/style/variable.scss";
  .photo-display{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 100px;
  }
  .pop-photo,.photo-cancel{
    border-radius: 16px;
    margin: auto;
  }
  .pop-photo{
    font-size: 32px;
    bottom: 20px;
    .pop-top{
      div{
        border-bottom: 1px solid $color-line;/*no*/
      }
    }
    .photo-btn{
      height: 96px;
      line-height: 96px;
      text-align: center;
    }
    .photo-cancel{
    }
  }
</style>
