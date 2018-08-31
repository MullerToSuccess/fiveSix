<template>
  <div id="m-home">
    <div class="img-box">
      <img v-lazy="image" />
    </div>
    <ul class="switch-box">
      <li class="s-b-unit" v-for="(item, index) in switches" :key="index" @click="switchItem(item.path)">
        <div class="s-b-img">
          <img :src="item.imgUrl" alt="">
        </div>
        <div class="s-b-text">{{item.name}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import {Switches} from 'managerCommon/js/const'

export default {
  name: 'mHome',
  data () {
    return {
      image: require('@/assets/_images/manager/banner1.png'),
      switches: Switches
    }
  },
  created () {
  },
  activated () {
  },
  methods: {
    switchItem (path) {
      this.$router.push(
        { path: path }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
 @import "@/style/variable.scss";

  .img-box{
   width: calc(750px/2);
   height: calc(400px/2);
   margin-bottom: calc(60px/2);
   img{
     width: 100%;
     height: 100%;
   }
 }
  .switch-box{
    display: flex;
    justify-content: center;
    li{
      margin: 0 calc(57px/2);
      .s-b-img{
        width: calc(146px/2);
        height: calc(146px/2);
        img{
          width: 100%;
          height: 100%;
        }
      }
      .s-b-text{
        text-align: center;
        margin-top: calc(20px/2);
        font-size: $header-title-s;
        color: $color-text;
      }
    }
  }
</style>
