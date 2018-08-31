<template>
<van-nav-bar :title="title" :left-text="text" left-arrow @click-left="goBack">
   <slot  slot="right"></slot>
</van-nav-bar>
</template>

<script>
export default {
  name: 'home',
  props: ['title', 'text', 'isHome'],
  data: function () {
    return {

    }
  },
  methods: {
    goBack () {
      if (this.isHome) {
        if (window.TeacherUtil) {
          window.TeacherUtil.quitAsk()
        } else {
          this.$router.go(-1)
        }
      } else {
        this.$router.go(-1)
      }
    }
  }

}
</script>

<style>

</style>
