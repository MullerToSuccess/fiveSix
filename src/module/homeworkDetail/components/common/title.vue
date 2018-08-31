<template>
<div class="title border-bottom-1px">
  <van-row>
    <van-col span="3">
      <span
        class="back"
        @click="back"
      >
        <van-icon name="arrow-left"></van-icon>
        </span>
    </van-col>
    <van-col span="18">
      <van-row>
        <van-col
          span="16"
          offset="4"
          class="van-hairline--surround tabs"
        >
          <span class="text van-hairline--right" @click="tabChange('detail')">作业详情</span>
          <span class="text" @click="tabChange('report')">作业报告</span>
    </van-col>
    </van-row>
    </van-col>
    <van-col span="3">...</van-col>
  </van-row>
</div>
</template>

<script>
export default {
  name: 'top',
  methods: {
    back() {
      this.$emit('back')
    },
    tabChange(type) {
      this.$emit('tabChange', type)
    }
  }
}
</script>
<style scoped>
.title {
    text-align: center;
    line-height: 50px;
    height: 50px;
    box-sizing: border-box;
    padding-top: 5px;
  }

.title .back {
    display: inline-block;
    float: left;
  }

.title .tabs {
    font-weight: 600;
    height: 36px;
    line-height: 36px;
    border-radius: 5px;
    box-sizing: border-box;
  }

.title .text {
    display: inline-block;
    height: 100%;
    width: 48%;
  }

</style>
