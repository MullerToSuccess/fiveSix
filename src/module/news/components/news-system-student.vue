<template>
  <transition name="slide">
    <div id="news-system-student">
      <header-bar>
        <div slot="title-name">新增学生</div>
      </header-bar>
      <div class="nss-box">
        <div class="top">
          <i></i>
          <span>学生账号信息</span>
        </div>
        <div class="middle">
          <span>姓名</span>
          <span>账号</span>
        </div>
      </div>
      <div class="list-content">
        <scroll :data="data" class="list-view">
          <div class="padding">
            <div class="item" v-for="(item,index) in data" :key="index">
              <span>{{item.name}}</span>
              <span>{{item.loginnum}}</span>
            </div>
          </div>
        </scroll>
      </div>
    </div>
  </transition>
</template>

<script>
import Scroll from 'common/components/scroll'
import HeaderBar from 'common/components/headerBar'

export default {
  name: 'news-system-student',
  data () {
    return {
      data: []
    }
  },
  activated () {
    this.data = this.$route.params.data
  },
  components: {
    HeaderBar,
    Scroll
  }
}
</script>

<style scoped lang="scss">
 @import "@/style/variable.scss";
  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s;
  }
  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
  #news-system-student {
    position: fixed;
    z-index: 300;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: #fff;
    .nss-box{
      margin-top: calc(50px/2);
      padding: 0 calc(26px/2);
      .top{
        display: flex;
        font-size: $header-title-s;
        align-items: center;
        margin-bottom: calc(10px/2);
        i{
          display: inline-block;
          width: calc(42px/2);
          height: calc(42px/2);
          margin-right: calc(20px/2);
          background: url('../../../assets/_images/public/icon_divide_class.png') no-repeat 0 0;
          background-size: 100% 100%;
          vertical-align: text-bottom;
        }
      }
      .middle{
        display: flex;
        padding: 0 calc(26px/2);
        height: calc(100px/2);
        line-height: calc(100px/2);
        background: rgb(234,249,255);
        justify-content: space-between;
        span{
          font-size: $header-title-s;
        }
      }
    }
    .list-content{
      position: fixed;
      top: calc(278px/2);
      bottom: 0;
      width: 100%;
      .list-view{
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .padding{
          padding: 0 calc(26px/2);
          .item{
            display: flex;
            height: calc(100px/2);
            line-height: calc(100px/2);
            justify-content: space-between;
            border-bottom: 1px solid $color-line;
            span{
              font-size: $header-title-s;
            }
            span:first-child{
              margin-left: 13px;
            }
          }
        }
      }
    }
  }
</style>
