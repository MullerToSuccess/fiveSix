<template>
  <van-popup v-model="showTips" class="tip-popup van-hairline--surround" :close-on-click-overlay="false">
    <div class="tip-container">
      <h2 class="title">老师，您好：</h2>
      <div class="tip-content">
        <p>
          为了保护您的账号安全，建议您绑定手机号，方便您找回密码和账号！
        </p>
        <div class="btn">
          <button class="skipbutton"  @click="cancelBind" size="large">跳过</button>
          <button class="bindbutton" @click="goBind" size="large">立即绑定</button>
        </div>
        <div style="text-align: center;padding-top: 30px;padding-bottom:16px;font-size: 4.4vw;color:rgb(87,85,86);" @click="nevershow">
          <span class="nevershow">不再提示</span>
        </div>
      </div>
    </div>
  </van-popup>
</template>
<script>
export default{
  name: 'remindBindPhone',
  data() {
    return {
      showTips: true
    }
  },
  methods: {
    nevershow () {
      this.$emit('nevershow')
    },
    goBind () {
      this.$emit('goBind')
    },
    cancelBind () {
      this.$emit('cancelBind')
    }
  }
}
</script>
<style scoped>
  .tip-popup {
    width: calc(100vw - 85px);
    border-radius: 10px;
    padding:10px 20px;
    box-sizing: border-box;
  }
  .tip-popup[class*="van-hairline"]::after {
    border-radius: 20px;
  }

  .tip-container>.title {
    padding: 10px 10px 0px 10px;
    font-weight: bold;
    font-size: 20px;
    line-height: 35px;
  }
  .tip-container>.tip-content>p {
    text-indent: 2em;
    margin: 0 auto 30px;
    width: 95%;
    line-height: 25px;
    font-size: 18px;
    color:rgb(87,85,86);
  }
  .tip-container .btn{
    width:100%;
    margin:0 auto;
    text-align: center;
  }
  .tip-container .btn button{
    font-size: 17px;
    height: 45px;
    line-height: 44px;
    width:108px;
    border-radius: 10px;
  }
  .tip-container .btn button:active{
    background: #13d098;
  }

  .skipbutton{
    background-color: #ffffff;
    border: 1px solid #08b783;
    color: #08b783;
    margin-right: 3vw;
  }
  .bindbutton{
    background-color: #08b783;
    border: 1px solid #08b783;
    color: #ffffff;
    margin-left: 3vw;
  }
  .nevershow:active {
    color: #08b783;
  }
</style>
