<template>
  <div id="nav-bar">
    <van-nav-bar
      :title="title"
      @click-left="onClickLeft"
    >
      <van-icon v-if="hasBack" name="arrow-left" slot="left"> <span style="padding-left:10px;line-height:10px;display:inline-block;vertical-align:text-top">返回</span></van-icon>
    </van-nav-bar>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  props: ['title', 'hasBack'],
  data () {
    return {}
  },
  methods: {
    onClickLeft () {
      this.$emit('historyBack')
    }
  }
}
</script>
<style scoped>
</style>
