<template>
  <div id="teacher" class="page">
    <home :tabs="tabs"></home>
  </div>
</template>

<script>
import Home from 'common/components/home'
import {Tabs} from 'teacher/common/js/const'
import {mapActions} from 'vuex'
export default {
  name: 'teacher',
  data () {
    return {
      tabs: Tabs
    }
  },
  created () {
    this.$store.dispatch('news/connectMqtt')
    this.getUserInfo()
    this.$router.push({
      name: 'tHome'
    })
  },
  methods: {
    ...mapActions({
      getUserInfo: 'my/getUserInfo'
    })
  },
  components: {
    Home
  }
}
</script>

<style scoped>

</style>
