<template>
  <div id="header-bar" class="van-hairline--bottom">
    <div class="back-btn" @click="back">
      <i class="icon-back"></i>
    </div>
    <div class="title-name">
      <slot name="title-name">
      </slot>
    </div>
    <div class="right-area">
      <slot name="right-area"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'HeaderBar',
  data () {
    return {}
  },
  methods: {
    back () {
      this.$emit('back')
    }
  }
}
</script>
<style scoped lang="scss">
.van-hairline--bottom{
  width: 100%;
  height: 45px;
  line-height: 45px;
  padding: 0 13px;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  background-color: #fff;
  .back-btn{
    display: inline-block;
    font-size: 15px;
    width: 80px; //如果修改此值，则.right-area的width也要同步修改一样的值，不然会造成title-name不居中
    color: #4f4f50;
    .icon-back{
      display: inline-block;
      width: 10px;
      height: 17px;
      background: url('../assets/images/public/left.png') no-repeat 0 0;
      background-size: 100% 100%;
      vertical-align: text-bottom;
    }
    span{
      display: inline-block;
    }
  }
  .title-name{
    font-size: 18px;
    max-width: 200px;
    // align-items: center;
  }
  .right-area{
    font-size: 16px;
    width: 80px; //此值应和.back-btn的width保持一致，不然会造成title-name不居中
    text-align: right;
  }
}
</style>
