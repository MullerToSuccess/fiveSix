<template>
  <transition name="van-fade">
    <div id="student-list" :style="styleObject" v-show="showList">
      <div class="model" @click="close"></div>
      <div class="content">
        <div class="title">
          <div class="close" @click="close">
            <span>&times;</span>
          </div>
          <div class="title-name" v-html="title">
          </div>
        </div>
        <div class="avatar-wrapper">
          <div class="avatar-item" v-for="(item, index) in list" :key="index" @click="callback(item)">
            <img class="avatar" :src="item.avatar | addHttp" alt="">
            <div class="user-name ellipsis">{{item.real_name}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'StudentList',
  // props: ['title', 'studentList'],
  data() {
    return {
      showList: false,
      list: [],
      title: null
    }
  },
  computed: {
    styleObject() {
      return {
        width: window.innerWidth + 'px',
        height: window.innerHeight + 'px'
      }
    }
  },
  methods: {
    show(title, list, callback) {
      setTimeout(() => {
        this.showList = true
      }, 100)
      this.title = title
      this.list = list
      if (callback) this.callback = callback
    },
    close() {
      this.showList = false
      this.title = null
      this.list = []
    }
  }
}
</script>
<style lang="scss" scoped>
#student-list{
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 1;
  top: 0;
  .model{
    height: 30%;
    background-color: rgba(0, 0, 0, .3)
  }
  .content{
    width: 100vw;
    height: 70%;
    box-sizing: border-box;
    padding: 12px 13px;
    background-color: #fff;
    .title{
      width: 100%;
      box-sizing: border-box;
      position: relative;
      .close{
        position: absolute;
        right: 0;
        top: 0;
        height: 24px;
        line-height: 24px;
        text-align: right;
        font-size: 24px;
        color: #c5c5c5;
        font-weight: 300;
      }
      .title-name{
        height: 30px;
        line-height: 30px;
        text-align: center;
        color: #1e1e1e;
        font-size: 16px;
      }
    }
    .avatar-wrapper{
      height: calc(100% - 30px);
      overflow-x: scroll;
      padding-top: 20px;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-around;
      align-content: flex-start;
      .avatar-item{
        flex: 0 1 50px;
        height: 70px;
        margin: 8px;
        .avatar{
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .user-name{
          width: 50px;
          height: 20px;
          line-height: 20px;
          font-size: 16px;
          color: #1e1e1e;
          text-align: center;
        }
      }
    }
  }
}
</style>
