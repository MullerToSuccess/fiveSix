<template>
  <div id="footer-bar">
    <div class="item" :class="{active: activeType === 'home'}" @click="handleTab('home')">
      <i class="icon icon-home"></i>
      <span>首页</span>
    </div>
    <div class="item" :class="{active: activeType === 'my'}" @click="handleTab('my')">
      <i class="icon icon-my"></i>
      <span>我的</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FooterBar',
  props: {
    activeType: {
      type: String,
      default: 'home' // home & my
    }
  },
  data() {
    return {}
  },
  methods: {
    handleTab(type) {
      this.$emit('tabChange', type)
    }
  }
}
</script>
<style lang="scss" scoped>
 @import "@/style/base.scss";
#footer-bar{
  position: absolute;
  bottom:0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 56px;
  background-color: $white;
  display: flex;
  box-sizing: border-box;
  border-top:1px solid $gray6;
  .item{
    flex: 1;
    display: inline-flex;
    flex-direction: column;
    text-align: center;
    justify-content: center;
    align-items: center;
    font-size: 10px;
    box-sizing: border-box;
    .icon{
      width: 25px;
      height: 25px;
      align-items: center;
      margin-bottom: 5px;
      &.icon-home{
        background: url('../assets/images/home/home.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
      &.icon-my{
        transform:scale(1.1);
        background: url('../assets/images/home/my.png') no-repeat 0 0;
        background-size: 100% 100%;
        &.cur{
          background: url('../assets/images/home/my-cur.png') no-repeat 0 0;
        }
      }
    }
    &.active{
      color: #ffa515;
      .icon{
        &.icon-home{
          background: url('../assets/images/home/home-cur.png') no-repeat 0 0;
          background-size: 100% 100%;
        }
        &.icon-my{
          transform:scale(1.1);
          background: url('../assets/images/home/my-cur.png') no-repeat 0 0;
          background-size: 100% 100%;
        }
      }
    }
  }
}
</style>
