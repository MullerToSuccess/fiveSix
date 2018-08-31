<template>
  <div id="feedback" class="page" :style="flexStyle">
    <header-bar @back="back"><span slot="title-name">{{title}}</span></header-bar>
    <van-cell-group border class="box">
      <van-cell @click="check(item)" center border v-for="(item,index) in msgs" :key="index" :label="item.label" :title="item.title" class="feedbackmsglist">
        <img src="@/assets/images/public/checksel.png" slot="right-icon" v-if="item.isChecked" class="checkIcon"/>
        <img src="@/assets/images/public/checkunsel.png" slot="right-icon" v-if="!item.isChecked" class="checkIcon"/>
      </van-cell>
      <van-field ref="contactField" v-model="userLink" placeholder="留下您的电话号码/QQ/邮箱" label="联系方式(选填)" class="feedbackuserLink" :error-message="phoneFormatMsg" @focus="onfocus" @blur="onblur"/>
      <van-cell title="其他问题" :value="other" is-link @click="addQuestion" class="feedbackotherquestion">
        <van-icon slot="right-icon" name="arrow" class="van-cell__right-icon"></van-icon>
      </van-cell>
    </van-cell-group>
    <div class="submit">
      <bottom-button-area :disabled="disabled" @click="post" :buttonText='btnText'></bottom-button-area>
    </div>
  </div>
</template>
<script>
import api from "@/module/user-center/axios/usercenter";
import headerBar from "@/components/headerBar.vue";
import YxLoginBtn from "@/module/account/components/yx-login-btn.vue";
import BottomButtonArea from "@/module/user-center/components/common/bottomButtonArea";
import { Toast } from "vant";
import { mapState } from "vuex";
const phonereg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
const emailreg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
let contactInput
export default {
  name: "Feedback",
  data() {
    return {
      title: "意见反馈",
      btnText: '提 交',
      hasBack: true,
      msgs: [
        {
          title: "软件太难操作",
          label: "",
          isChecked: false
        },
        {
          title: "软件风格不太喜欢",
          label: "",
          isChecked: false
        },
        {
          title: "功能太少不实用",
          label: "",
          isChecked: false
        },
        {
          title: "太卡,流畅度不好",
          label: "",
          isChecked: false
        },
        {
          title: "资源利用率低",
          label: "资源陈旧,相关度不高,数量太少,质量不高等",
          isChecked: false
        }
      ],
      feedbackOptions: [],
      other: "请添加问题描述或截图",
      otherMsg: "",
      selectImgs: [],
      userLink: "",
      isDisabled: true,
      offy: 0
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let len = vm.$router.options.routes.length
      let curr = {}
      for (let i = 0; i < len; i++) {
        if (vm.$router.options.routes[i].name === 'otherQuestion') {
          curr = vm.$router.options.routes[i]
          break
        }
      }
      vm.btnText = '提 交'
      if (contactInput) { contactInput.blur() }
      vm.offy = 0
      if (from.name === "otherQuestion") {
        vm.otherMsg = from.meta.msg.replace(/(^\s*)|(\s*$)/g, "");
        vm.selectImgs = from.meta.selectImgs;
        if (vm.otherMsg !== "" || vm.selectImgs.length > 0) {
          vm.other = "已添加";
          curr.meta.isclear = false
        } else {
          vm.other = "请添加问题描述或截图";
        }
      } else {
        vm.other = "请添加问题描述或截图";
        curr.meta.isclear = true
        curr.meta.msg = ''
        curr.meta.selectImgs = []
        vm.selectImgs = [];
        vm.feedbackOptions = [];
        vm.feedbackContent = "";
        vm.userLink = "";
        for (let val of vm.msgs) {
          val.isChecked = false;
        }
      }
    });
  },
  computed: {
    ...mapState({
      keyBoradHeihgt: state => state.account.keyBoradHeihgt
    }),
    disabled() {
      if (this.btnText !== '提 交') {
        return true
      }
      for (let i = 0; i < this.msgs.length; i++) {
        if (this.msgs[i].isChecked) {
          return false;
        }
      }
      if (this.otherMsg !== "" || this.selectImgs.length > 0) {
        return false;
      }
      return true;
    },
    phoneFormatMsg() {
      if (this.userLink !== "") {
        if (phonereg.test(this.userLink) || emailreg.test(this.userLink)) {
          return "";
        }
        return "请输入正确的手机号或邮箱";
      }
      return "";
    },
    flexStyle() {
      return {
        top: -this.offy + "px"
      };
    }
  },
  watch: {
    keyBoradHeihgt(val) {
      if (this.$store.state.account.isAndroid) {
        if (val === 0) {
          if (contactInput) { contactInput.blur() }
        } else {
          this.offy = 100;
        }
      }
    }
  },
  methods: {
    onfocus(e) {
      this.$nextTick(() => {
        if (this.$store.state.account.isAndroid) {
          this.offy = 100;
        }
        if (!contactInput) {
          contactInput = e.target
        }
      })
    },
    onblur() {
      this.$nextTick(() => {
        if (this.$store.state.account.isAndroid) {
          this.offy = 0;
        }
      })
    },
    check(item) {
      item.isChecked = !item.isChecked;
    },
    addQuestion() {
      this.$router.push({ path: "/otherQuestion" });
    },
    uploadImg(feedbackParams) {
      let userid = this.$store.state.account.userInfo.userid;
      let jwt = JSON.parse(localStorage.jwt).jwt
      let getGrant = this.$store.getters["runEnv/yxp_apis2"] + "/feedback/getGrant";
      let param = [userid, jwt, getGrant, JSON.stringify(this.selectImgs)];
      window.appPlug.aliUpLoad(
        param,
        succ => {
          let res = JSON.parse(succ);
          let photos = [];
          let len = res.length;
          for (let i = 0; i < len; i++) {
            photos.push(res[i].host_oss + res[i].path_physical);
          }
          feedbackParams.photo = photos.toString();
          this.feedback(feedbackParams);
        },
        fail => {
          this.btnText = '提 交'
          Toast({ position: "bottom", message: "上传图片失败，请重试" });
        }
      );
    },
    post() {
      this.btnText = '上传中...'
      if (this.phoneFormatMsg !== "") {
        Toast({ position: "bottom", message: "请输入正确的手机号或邮箱" });
        return;
      }
      this.feedbackOptions = [];
      for (let i = 0; i < this.msgs.length; i++) {
        if (this.msgs[i].isChecked) {
          this.feedbackOptions.push(Number(i + 1));
        }
      }
      let params = {};
      params.userId = this.$store.state.account.userInfo.userid;
      if (this.feedbackOptions.length > 0) {
        params.feedbackContent = this.feedbackOptions.toString();
      }
      if (this.userLink !== "") {
        params.contact = this.userLink;
      }
      if (this.otherMsg !== "") {
        params.content = this.otherMsg;
      }
      if (this.selectImgs.length > 0) {
        this.uploadImg(params);
      } else {
        this.feedback(params);
      }
    },
    feedback(params) {
      api.feedback(params)
        .then(res => {
          this.btnText = '提 交'
          for (let i = 0; i < this.msgs.length; i++) {
            this.msgs[i].isChecked = false;
          }
          this.userLink = "";
          this.other = "请添加问题描述或截图";
          Toast({
            position: "bottom",
            message: "感谢您的反馈，我们会做得更好"
          });

          let len = this.$router.options.routes.length;
          for (let i = 0; i < len; i++) {
            if (this.$router.options.routes[i].name === "otherQuestion") {
              this.$router.options.routes[i].meta.isclear = true;
              this.$router.options.routes[i].meta.msg = "";
              this.$router.options.routes[i].meta.selectImgs = [];
              break;
            }
          }
          this.back();
        })
        .catch(() => {
          this.btnText = '提 交'
          this.$toast("提交失败请检查网络");
        });
    },
    back() {
      this.$router.back(-1);
    }
  },
  components: {
    headerBar,
    YxLoginBtn,
    BottomButtonArea
  }
};
</script>

<style lang="scss" scoped>
  .box * {
    margin: 0 auto;
    font-size: 16px;
  }
  #feedback {
    position: relative;
    transition: all 0.3s ease;
  }
  .submit {
    width: 100%;
    text-align: center;
    position: fixed;
    bottom: 0px;
    left: 50%;
    transform: translateX(-50%);
  }
  .feedbackotherquestion{
    width: 97%;
  }
  .checkIcon{
    width: 5.6vw;
  }
</style>
<style>
  #feedback .van-cell__value {
    flex: 2;
    font-size: 14px;
  }
  .feedbackuserLink .van-field__control{
    width: 186px;
    float: right;
  }
  input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
    font-size: 14px;
  }
  input:-moz-placeholder, textarea:-moz-placeholder {
    font-size: 14px;
  }
  input::-moz-placeholder, textarea::-moz-placeholder {
    font-size: 14px;
  }
  input:-ms-input-placeholder, textarea:-ms-input-placeholder {
    font-size: 14px;
  }
</style>
