<template>
  <transition name="slide">
    <div id="edit-phone">
      <header-bar>
        <div slot="title-name">手机号修改</div>
      </header-bar>
      <bind-phone></bind-phone>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </transition>
</template>

<script>
import HeaderBar from 'common/components/headerBar'
import bindPhone from 'common/components/bindPhone'
export default {
  name: 'editPhone',
  created () {
  },
  activated () {
  },
  components: {
    HeaderBar,
    bindPhone
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

  #edit-phone {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: #fff;
  }
</style>
