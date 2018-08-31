<template>
  <div id="t-subject">
    <div class="t-s-tabs">
      <div class="tabs">
        <van-tabs type="card" swipeable>
          <van-tab v-for="(item,index) in items" :key="index" :title="item" @click="select(index,title)">
          </van-tab>
        </van-tabs>
      </div>
      <div class="title">请输入相关学科名称:</div>
      <div class="line">
        <input type="text" v-model.trim="data" placeholder="学科名称">
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'

export default {
  name: 'tSubject',
  data () {
    return {
      items: ['小学', '初中', '高中'],
      tilte: ''
    }
  },
  created () {
    this.$store.commit('managerCommon/SET_ISSAVE', true)
  },
  computed: {
    data: {
      get () {
        return this.$store.state.managerCommon.editMsg
      },
      set (val) {
        this.$store.commit('managerCommon/SET_EDITMSG', val)
      }
    },
    ...mapGetters({
      editMsg: 'managerCommon/editMsg'
    })
  },
  methods: {
    select (index, title) {
      this.setTitle(title)
    }
  },
  ...mapMutations({
    setEdit: 'managerCommon/SET_EDITMSG',
    setTitle: 'managerTeacher/SET_TITLE'
  })
}
</script>

<style scoped lang="scss">
 @import "@/style/variable.scss";
  .t-s-tabs{
    padding: 0 calc(26px/2);
    .tabs{
      height: calc(100px/2);
      padding-top: calc(20px/2);
    }
    .title{
      height: calc(100px/2);
      line-height: calc(100px/2);
      font-size: $header-title-s;
    }
    .line{
      border-bottom: 1px solid $color-line;
      input{
        width: 100%;
        height: calc(100px/2);
        letter-spacing: calc(2px/2);
        font-size: $header-title-s;
      }
    }
  }
</style>
