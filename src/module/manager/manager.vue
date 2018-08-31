<template>
  <div id="manager" class="page">
    <home :tabs="tabs"></home>
  </div>
</template>

<script>
import Home from 'common/components/home'
import {Tabs} from 'manager/common/js/const'
import {mapMutations, mapActions} from 'vuex'

export default {
  name: 'manager',
  data () {
    return {
      tabs: Tabs
    }
  },
  created () {
    this.$store.dispatch('news/connectMqtt')
    this.set_schoolId(this.$store.state.account.schoolId)
    this.getUserInfo()
    this.$router.push({
      name: 'mHome'
    })
  },
  methods: {
    ...mapMutations({
      set_schoolId: 'managerCommon/SET_SCHOOLID'
    }),
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
