<template>
  <van-pull-refresh v-model="loading" @refresh="onRefresh">
    <van-list v-model="loading" :finished="finished" @load="onLoad">
      <van-cell v-for="item in list" :key="item" :title="item + ''" />
    </van-list>
  </van-pull-refresh>
</template>
<script>
export default {
  data () {
    return {
      count: 0,
      list: [],
      loading: false,
      finished: false
    }
  },
  methods: {

    onLoad () {
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }
        this.loading = false

        if (this.list.length >= 40) {
          this.finished = true
        }
      }, 500)
    },
    onRefresh () {
      setTimeout(() => {
        this.$toast('刷新成功')
        this.loading = false
        this.count++
      }, 500)
    }
  }
}
</script>
<style>
</style>
