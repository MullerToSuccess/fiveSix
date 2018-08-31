<template>
  <div id="uc-close-btn" @click="$emit('click')" @touchstart="changeIsMouseDown(true)" @touchend="changeIsMouseDown(false)">
    <img class="close-button halfscaleelement" src="@/assets/images/public/deleteselectedimage.png" v-if="!isMouseDown"/>
    <img class="close-button halfscaleelement" src="@/assets/images/public/deleteselectedimagedown.png" v-if="isMouseDown"/>
  </div>
</template>
<script>
export default {
  name: 'uc-close-btn',
  data () {
    return {isMouseDown: false}
  },
  methods: {
    changeIsMouseDown (v) {
      this.isMouseDown = v
    }
  }
}
</script>
<style lang="scss" scoped>
.close-button{
  outline:none;
  border:none;
}
</style>
