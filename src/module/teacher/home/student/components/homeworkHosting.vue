<template>
  <div id="homeworkHosting" class="page" style="z-index: 2">

    <div class="van-hairline--bottom">
      <div class="back-btn" @click="goBack">
        <i class="icon-back"></i>
      </div>
      <div class="title-name">
        <div name="title-name">作业托管
        </div>
      </div>
      <div class="right-area">
        <slot name="right-area"></slot>
      </div>
    </div>
    <div class="null-place"></div>

    <router-link :to="{ name: 'todayHostingList', params: {
          notKeepAlive: true
        }}" tag="div" class="s-wait">
      <span>今日托管</span>
      <i class="right-arrow"></i>
    </router-link>

    <router-link :to="{ name: 'historyHosting', params: {
          notKeepAlive: true
        }}" tag="div" class="s-wait">
      <span>历史反馈</span>
      <i class="right-arrow"></i>
    </router-link>
  </div>
</template>

<script>
import HeaderBar from 'common/components/headerBar'
import Scroll from 'common/components/scroll'
import {mapMutations} from 'vuex'

export default {
  name: 'homeworkHosting',
  data () {
    return {
      data: []
    }
  },
  mounted () {
    sessionStorage.removeItem('tabIndex');
  },
  methods: {
    goBack () {
      this.$router.push({
        path: "/teacher"
      });
    }
  },
  components: {
    HeaderBar,
    Scroll
  }
}
</script>

<style lang="scss" scoped>
@import "@/style/reset.scss";
@import "@/style/variable.scss";
.van-hairline--bottom{
  position: fixed;
  top: 0;
  z-index: 50;
  width: 100%;
  height: calc(100px/2);
  line-height: calc(100px/2);
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  background-color: $color-background-y;
  .back-btn{
    display: inline-block;
    font-size: calc(38px/2);
    width: calc(90px/2); //如果修改此值，则.right-area的width也要同步修改一样的值，不然会造成title-name不居中
    color: $color-text;
    .icon-back{
      display: inline-block;
      width: calc(36px/2);
      height: calc(36px/2);
      margin-left:calc(25px/2);
      background: url('../../../../../assets/_images/public/back.png') no-repeat 0 0;
      background-size: 100% 100%;
      vertical-align: text-bottom;
    }
    span{
      display: inline-block;
    }
  }
  .title-name{
    font-size: $header-title;
    max-width: 60%;
    // align-items: center;
    div {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .right-area{
    position: relative;
    display: inline-block;
    font-size: calc(38px/2);
    width: calc(90px/2); //此值应和.back-btn的width保持一致，不然会造成title-name不居中
    text-align: right;
  }
}
.null-place{
  height: 50px;
}
#homeworkHosting {
  .search {
    display: inline-block;
    width: calc(38px/2);
    height: calc(38px/2);
    margin-right: calc(25px/2);
    background: url('../../../../../assets/_images/public/search_state.png') no-repeat 0 0;
    background-size: 100% 100%;
    vertical-align: text-bottom;
  }
  .s-wait {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: calc(80px/2);
    padding: 0 calc(26px/2);
    border-bottom: 1px solid $color-line; /*no*/
    line-height: calc(120px/2);
    font-size: $header-title-s;
    .right-arrow {
      display: inline-block;
      width: calc(30px/2);
      height: calc(30px/2);
      background: url('../../../../../assets/_images/public/right_arrow.png') no-repeat 0 0;
      background-size: 100% 100%;
      vertical-align: text-bottom;
    }
  }
  .s-handle {
    height: calc(82px/2);
    padding: 0 calc(26px/2);
    font-size: $header-list;
    line-height: calc(82px/2);
    color: $color-text-d;
    background: $color-background;
    .s-number-red {
      color: #ff1503;
    }
  }
  .s-lists {
    position: fixed;
    top: calc(303px/2);
    bottom: 0;
    width: 100%;
    border-top: 1px solid $color-line;
    .listview {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      ul{
        padding: 0 calc(26px/2);
        letter-spacing: calc(2px/2);
        .list-group {
          display: flex;
          height: calc(100px/2);
          line-height: calc(100px/2);
          border-bottom: 1px solid $color-line;
          align-items: center;
          .avatar {
            width: calc(86px/2);
            height: calc(86px/2);
            border-radius: 50%;
          }
          .icon{
            display: inline-block;
            width: calc(86px/2);
            height: calc(86px/2);
            line-height: calc(86px/2);
            text-align: center;
            border-radius: 50%;
            background: $color-background-y;
            vertical-align: text-bottom;
          }
          .name {
            margin-left: calc(20px/2);
            color: $color-text;
            font-size: $header-list;
          }
          .class-lists{
            display: inline-block;
            height: 100%;
            width: calc(350px/2);
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
            font-size:$header-list-s;
            color: $color-text-d;
            margin-left: calc(130px/2);
          }
          .right-arrow{
            display: inline-block;
            width: calc(30px/2);
            height: calc(30px/2);
            margin-left: calc(10px/2);
            background: url('../../../../../assets/_images/public/right_arrow.png') no-repeat 0 0;
            background-size: 100% 100%;
            vertical-align: text-bottom;
          }
        }
      }
    }
  }
}
</style>
