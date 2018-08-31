<template>
  <div id="tongji-tab">
    <span class="tab-item" :class="{active: tabType === 1}" @click="tabChange(1)">按题目</span>
    <span class="tab-item" :class="{active: tabType === 2}" @click="tabChange(2)">按学生</span>
  </div>
</template>
<script>
export default {
  name: 'TongjiTab',
  props: ['tabType'],
  data() {
    return {}
  },
  methods: {
    tabChange(type) {
      this.$emit('tabChange', type)
    }
  }
}
</script>
<style lang="scss" scoped>
#tongji-tab{
  box-sizing: border-box;
  width: 100%;
  height: 45px;
  line-height: 45px;
  display: flex;
  justify-content: space-around;
  padding: 0 13px;
  .tab-item{
    color: #4f4f50;
    font-size: 16px;
    &.active{
      color: #08b884;
      border-bottom: 2px solid #08b884;
    }
  }
}
</style>
