<template>
  <div id="t-home">
    <van-swipe :autoplay="3000" class="swiper">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <div class="img-box">
          <img v-lazy="image" />
        </div>
      </van-swipe-item>
    </van-swipe>
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
import {Slider, Switches} from 'teacherCommon/js/const'
import homeApi from "@/module/home/axios/home";
import {mapGetters, mapState} from "vuex";
export default {
  name: 'tHome',
  data () {
    return {
      images: Slider,
      switches: Switches
    }
  },
  created() {
    let self = this
    setTimeout(() => {
      if (JSON.stringify(self.$store.state.home.YXB_HOMEWORK) === "{}") {
        self.userInfo = self.$store.state.account.userInfo;
        homeApi.userAuth({"userid": self.userInfo.userid, "codes": ["TEACHER_MIBILE_ASK", "YXB_HOMEWORK"]}).then(r => {
          self.TEACHER_MIBILE_ASK = r.TEACHER_MIBILE_ASK.enable;
          self.YXB_HOMEWORK = r.YXB_HOMEWORK.enable;
          self.$store.dispatch("YXB_HOMEWORK", r.YXB_HOMEWORK);
        })
      }
    }, 1000);
  },
  methods: {
    switchItem (path) {
      this.$router.push(
        {
          path: path
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
 @import "@/style/variable.scss";

  .swiper{
    height: calc(400px/2);
    margin-bottom: calc(60px/2);
    .img-box{
      width: calc(750px/2);
      height: calc(358px/2);
      img{
        width: 100%;
        height: 100%;
      }
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
