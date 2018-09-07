<template>
  <div id="home">
    <router-view></router-view>
    <ul class="tabs">
      <li class="tab" v-for="(item, index) in tabs" :key="index" @click="toggleTab(item.path,index)">
        <div class="t-img">
          <img ref="imgRef" v-if="index === 1" :src="notice(item.imgSelect, item.imgNormal)" alt="">
          <img ref="imgRef" v-else :src="selectIndex===index?item.imgSelect:item.imgNormal" alt="">
        </div>
        <div class="t-text" :class="{'t-text-select':selectIndex===index}">{{item.name}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
export default {
  name: 'home',
  props: {
    tabs: {
      type: Array
    }
  },
  data() {
    return {
      selectIndex: 0,
      newNotice: false
    }
  },
  computed: {
    ...mapGetters({
      newMsg: 'news/newMsg',
      msg: 'news/msg'
    })
  },
  created () {
    this._selectIn()
    this._initToggleTab()
  },
  activated () {
  },
  mounted () {
    console.log(3333, this.$route);
    if (this.$route.name === 'mNews' || this.$route.name === 'tNews') {
    } else {
      if (this.newMsg) this.$refs.imgRef[1].src = require('@/assets/_images/public/notice.png')
    }
  },
  methods: {
    notice (select, normal) {
      if (this.selectIndex === 1) {
        return select
      } else {
        if (this.newMsg) {
          return require('@/assets/_images/public/notice.png')
        } else {
          return normal
        }
      }
    },
    toggleTab(path, index) {
      this.selectIndex = index
      let isHaveMsg = false
      for (let key in this.msg) {
        if (this.msg[key] !== 0) isHaveMsg = true
      }
      if (!isHaveMsg) this.setMsg(false)
      this.$router.push({
        name: path
      })
    },
    _selectIn () {
      if (this.$route.name === 'mHome' || this.$route.name === 'tHome') {
        this.selectIndex = 0
      } else if (this.$route.name === 'mMy' || this.$route.name === 'tMy') {
        this.selectIndex = 2
      } else if (this.$route.name === 'mNews' || this.$route.name === 'tNews' || this.$route.name === 'mDetails' || this.$route.name === 'tDetails') {
        this.selectIndex = 1
      }
    },
    _initToggleTab() {
      let self = this
      this.tabs.forEach((v, i) => {
        if (v.path === self.$route.name) self.selectIndex = i
      })
    },
    ...mapMutations({
      setMsg: 'news/setMsg'
    })
  },
  watch: {
    newMsg(bool) {
      console.log(this.$route.name)
      if (this.$route.name === 'mNews' || this.$route.name === 'tNews') {
      } else {
        if (bool) {
          console.log('有新消息！')
          this.$refs.imgRef[1].src = require('@/assets/_images/public/notice.png')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
 @import "@/style/variable.scss";
  .tabs{
    display: flex;
    justify-content: center;
    height: calc(110px/2);
    position: fixed;
    bottom: 0;
    padding-top:calc(5px/2);
    border-top:1px solid $color-line;
    background: #fafcfd;
    .tab{
      margin: 0 calc(94px/2);
      .t-img{
        width: calc(66px/2);
        height: calc(66px/2);
        img{
          width: 100%;
          height: 100%;
        }
      }
      .t-text{
        text-align: center;
        margin-top: calc(5px/2);
        font-size: $header-list-s;
        color: #776e6e;
      }
      .t-text-select{
        color: #eebb45;
      }
    }
  }
</style>
