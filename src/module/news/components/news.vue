<template>
  <div id="m-news">
    <div class="title-name">消息</div>
    <div class="ptouchpan">
      <div v-for="(item,index) in news" :key="index" class="cell-msg" @click="next(item.path, item.key, item.name, item.channel)">
        <div class="right">
          <div class="left-box">
            <div class="photo">
              <img :src="item.icon" alt="">
            </div>
            <div class="name">{{item.name}}<i class="point" v-show="msg[item.key] > 0"></i></div>
          </div>
          <div class="right-box">
            <i class="icon"></i>
          </div>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import {tNews, mNews} from '../js/const'
import stroage from '@/store/stroage'

export default {
  name: 'news',
  data () {
    return {
    }
  },
  computed: {
    news () {
      if (this.userIdentity.indexOf(1) >= 0) {
        return mNews
      }
      if (this.userIdentity.indexOf(2) >= 0) {
        return tNews
      }
    },
    ...mapGetters({
      msg: 'news/msg',
      userIdentity: 'account/userIdentity',
      mqtt: 'news/mqtt'
    })
  },
  created () {

  },
  methods: {
    next (path, key, title, channel) {
      if (key === 'newDepositMsg') {
        this.setDepositMsg(false)
      } else if (key === 'newGuardianMsg') {
        this.setGuardianMsg(false)
      } else if (key === 'newSystemMsg') {
        this.setSystemMsg(false)
      }
      if (!stroage['persistent'].get('mqtt')) {
        stroage['persistent'].set('mqtt', this.mqtt[key])
      } else {
        stroage['persistent'].set('mqtt', stroage['persistent'].get('mqtt').concat(this.mqtt[key]))
      }
      this.clearMqtt(key)
      this.$router.push({
        name: path
      })
      this.setNextParams({
        title: title,
        channel: channel
      })
    },
    ...mapMutations({
      setDepositMsg: 'news/setDepositMsg',
      setGuardianMsg: 'news/setGuardianMsg',
      setSystemMsg: 'news/setSystemMsg',
      setNextParams: 'news/setNextParams',
      clearMqtt: 'news/clearMqtt'
    })
  }
}
</script>

<style scoped lang="scss">
 @import "@/style/variable.scss";
  .title-name{
    position: fixed;
    top: 0;
    z-index: 50;
    width: 100%;
    height: calc(100px/2);
    line-height: calc(100px/2);
    text-align: center;
    font-size: $header-title;
    background: $color-background-y;
  }
  .ptouchpan{
    position: fixed;
    width: 100%;
    top: 50px;
    bottom: 0;
    transform: translate3d(0,0,0);
    .cell-msg{
      padding: 0 calc(26px/2);
      .right{
        display: flex;
        height: calc(100px/2);
        justify-content: space-between;
        line-height: calc(100px/2);
        font-size: $header-list;
        border-bottom: 1px solid $color-line;
        .left-box{
          display: flex;
          .photo {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: calc(10px/2);
            img{
              width: calc(48px/2);
              height: calc(48px/2);
              border-radius:50%;
            }
          }
          .name{
            position: relative;
            i{
              position: absolute;
              top: calc(30px/2);
              left: calc(140px/2);
              display: inline-block;
              width: calc(10px/2);
              height: calc(10px/2);
              border-radius: 50%;
              background: red;
            }
          }
        }
        .right-box{
          .icon{
            display: inline-block;
            width: calc(30px/2);
            height: calc(30px/2);
            background: url('../../../assets/_images/public/right_arrow.png') no-repeat 0 0;
            background-size: 100% 100%;
            vertical-align: text-bottom;
          }
        }
      }
    }
  }
</style>
