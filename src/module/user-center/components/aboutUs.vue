<template>
  <div id="about-us" class="page">
    <header-bar @back="back"><span slot="title-name">{{title}}</span></header-bar>
    <div class="restcontainer">
      <div class="restconheaderarea">
        <div class="imgiconarea">
          <img src="@/assets/images/usercenter/logo.png" style="width:24vw;"/>
        </div>
        <span style="font-size: 6vw; text-align: center;padding-bottom: 4px">智慧课堂</span>
        <span v-if="this.appVersion" class="versiontextfont cl-mark">V{{this.appVersion}}</span>
        <div :class="isDisplay?'display':'none'"  @click="tkVersion">{{this.$store.getters['runEnv/old']}}{{version}}</div>
      </div>
      <div class="restconmiddlerarea">
        <van-cell border class="indexvancell aboutus-van-cell" value="优学派智慧课堂">
          <template slot="title">
            <div class="item-choice"><img src="@/assets/images/usercenter/personmineicon_03.png" class="item-choice-icon halfscaleelement"/>公众号</div>
          </template>
        </van-cell>
      </div>
      <div class="restconbottomarea" :style="background">
        <span style="position:absolute;bottom: 19px;white-space: nowrap; left: 50%;;transform: translateX(-50%)">深圳市优学天下教育发展股份有限公司©版权所有</span>
      </div>
    </div>
  </div>
</template>

<script>
import headerBar from '@/components/headerBar.vue'
import {mapState} from 'vuex'
export default {
  name: 'AboutUs',
  data () {
    return {
      isDisplay: false,
      tkVersionTimes: 0,
      version: window.version,
      title: '关于我们',
      hasBack: true,
      background: {
        backgroundImage: 'url(' + require('@/assets/images/usercenter/personminebottombg.png') + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
      }
    }
  },
  computed: {
    ...mapState({
      appVersion: state => state.userCenter.version
    })
  },
  methods: {
    tkVersion() {
      if (this.tkVersionTimes++ > 4) {
        this.isDisplay = true;
      }
    },
    back () {
      this.$router.back(-1)
    }
  },
  components: {
    headerBar
  }
}
</script>

<style scoped>
  .display{
    opacity:1;
  }
  .none{
    opacity:0;
  }
  div#about-us
  {
    display: flex;
    height: 100%;
    flex-direction: column;
  }
  div.restcontainer{
    background-color: #F5F7F6;
    flex-grow: 1;
    display: inherit;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
  }
  .restcontainer * {
    font-size: 16px;
  }
  .restconheaderarea
  {
    display: inherit;
    flex-direction:column;
    align-items: center;
    margin-top:30px;
  }
  .restconmiddlerarea
  {
    width:100%;
  }
  .restconbottomarea
  {
    width: 100%;
    flex-grow: .65;
  }
  .restconbottomarea span{
    font-size: 14px;
  }
  .imgiconarea
  {
    margin: 20px auto 6px;

    /*border-radius: 15px;
    background:#ffffff;
    box-shadow: 1px 1px 10px #EBECEB;
    text-align: center;*/
  }
  .indexvancell
  {
    width:100%;
  }
  div.item-choice
  {
    display: flex;
    align-items: center;
    height: 30px;
  }
</style>
<style>
  .aboutus-van-cell .van-cell__value span {
    line-height: 30px;
    height: 30px;
    padding-right: 4px;
  }
</style>
