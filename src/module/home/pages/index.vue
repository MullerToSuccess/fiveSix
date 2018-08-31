<template>
  <div class="spa">
    <div class="top">
      <div @click="message">
        <i class="red-icon" v-if="newMsg"></i>
        <i class="icon message"></i>
      </div>
      <div @click="QRscan">
        <i class="icon scan"></i>
      </div>
    </div>

    <div class="pannel">
      <div>
        <div @click="go('iclass')">
          <i class="icon iclass"></i>
          <span class="font-h2">互动课堂</span>
        </div>
        <div @click="go('homework1')">
          <i class="icon homework"></i>
          <span class="font-h2">作业</span>
        </div>
      </div>
      <div class="line"></div>
      <div>
        <div @click="linkTo">
          <i class="icon wrong"></i>
          <span class="font-h4">错题本</span>
        </div>
        <div @click="go('homework2')">
          <i class="icon iclass-record"></i>
          <span class="font-h4">课堂记录</span>
        </div>
        <div @click="go('qa')">
          <i class="icon ask"></i>
          <span class="font-h4">问答</span>
        </div>
      </div>
    </div>

    <div class="todo-box">
      <div class="font-h1">待处理
        <span class="font-h4"> 近一个月</span>
      </div>

      <div class="scroll">
        <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh">
          <van-list v-model="loading" :finished="finished" @load="onLoad" :offset="offset"
                    :immediate-check="false">
            <div v-if="list.length===0 && !refreshLoading && !loading" class="no-data">
              <img src="@/assets/images/homeworkDetail/no-data.png" alt="">
              <p class="font-h3">暂无待处理事项</p>
            </div>
            <div class="item" v-for="(item, index) in list" :key="index"  v-else  @click="linkToHomeDetail(item)" >
              <div class="font-h2 one">{{item.title}}</div>
              <div class="flex">
                <div class=" font-h3 l ">{{item.task_prompt}}</div>
                <div class=" btn bg-blue btn-width r" style="background-color:#ff8d13" @click="linkToHomeDetail(item)" >批改</div>
              </div>
              <div class="c font-h4 ">{{item.class_name}}</div>
              <div class="t font-h4 ">{{item.time}}</div>
            </div>
            <div style="height:20px;"></div>
          </van-list>
        </van-pull-refresh>
      </div>
    </div>
    <footer-bar activeType="home" @tabChange="tabChange"></footer-bar>
    <van-popup v-model="iclassNotice" style=" width: calc(100vw - 22.66667vw);border-radius: 3.46667vw;padding: 8vw;box-sizing: border-box;">
      <div id="dialog">
        <div style="text-align: center;">请确认电脑端已"开始上课"</div>
        <div style="width: 26.66667vw; margin: 0 auto;">
          <div @click="iclassNotice = !iclassNotice" style="text-align: center;margin-top: 5vh;border-radius: 2.66667vw;background: #08b783;color: #fff;font-size: 4.53333vw;height: 12vw;line-height: 12vw;border: none;width: 26.66667vw;">知道了~</div>
        </div>
      </div>
    </van-popup>
    <remind-bind-phone v-if="bindShow" @nevershow="nevershow" @cancelBind="cancelBind" @goBind="goBind"></remind-bind-phone>
  </div>
</template>

<script>
import footerBar from "@/components/footerBar";
import remindBindPhone from "@/module/home/pages/remindBindPhone";
import api from "@/axios/iclass";
import homeApi from "@/module/home/axios/home";
import {mapGetters, mapState} from "vuex";
import '../../../../lib/mqttws31.js'
import mqtt from '@/utils/LMQqtt.js'
import {Dialog} from 'vant'

// import Keyboard from '@anoah/keyboard'
// window.Vue.use(Keyboard)

export default {
  name: "home",
  data() {
    return {
      active: 0,
      showPopup: false,
      loading: false,
      refreshLoading: false,
      finished: false,
      offset: 0,
      bindShow: false,
      checked: false,
      page: 1, // 页码
      per_page: 20, // 每页显示条数
      list: [],
      totalPage: 0,
      animateConfig: {
        disable: true
      },
      iclassNotice: false,
      TEACHER_MIBILE_ASK: 0, // 问答权限
      YXB_HOMEWORK: 0
    };
  },
  computed: {
    ...mapGetters({
      userId: "userCenter/userId",
      apis2: "runEnv/yxp_apis2",
      shell_api: "runEnv/shell_api"
    }),
    ...mapState({
      newMsg: state => state.notice.newMsg
    })
  },
  created() {
    this.onRefresh();
    window.bus.mqtt = mqtt;
    // window.bus.mqtt.connect();
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name === 'login' || from.name === null) {
        let phone = JSON.parse(localStorage.userinfo).phone
        if (!phone) {
          if (!localStorage.neverShowBindPhone || localStorage.neverShowBindPhone === 'false') {
            if (!sessionStorage.isShowedBindPhone || sessionStorage.isShowedBindPhone === 'false') {
              vm.bindShow = true
              sessionStorage.isShowedBindPhone = true
            }
          }
        }
      }
    })
  },
  mounted() {
    this.$store.commit('notice/connectMqtt')
    if (window.appPlug) {
      // 获取启动第二屏
      window.appPlug.onReady(this.downLoadSecondLaucher)
      // 检查更新
      window.appPlug.onReady(this.checkupdate)
    }

    // homeApi.userAuth({"userid": this.userId, "codes": ["TEACHER_MIBILE_ASK"]}).then(r => {
    //   this.TEACHER_MIBILE_ASK = r.TEACHER_MIBILE_ASK.enable
    // })
  },
  activated() {
    homeApi.userAuth({"userid": this.userId, "codes": ["TEACHER_MIBILE_ASK", "YXB_HOMEWORK"]}).then(r => {
      this.TEACHER_MIBILE_ASK = r.TEACHER_MIBILE_ASK.enable;
      this.YXB_HOMEWORK = r.YXB_HOMEWORK.enable;
      this.$store.dispatch("YXB_HOMEWORK", r.YXB_HOMEWORK);
    })
  },
  methods: {
    downLoadSecondLaucher() {
      window.appPlug.downLoadSecondLaucher([this.apis2, this.userId], null, null)
    },
    checkupdate() {
      if (!sessionStorage.isShowedUpdate || sessionStorage.isShowedUpdate === 'false') {
        let info = {user_id: this.userId}
        let param = [this.shell_api, info, 0]
        window.appPlug.checkUpdate(param, null, null)
        sessionStorage.isShowedUpdate = true
      }
    },
    nevershow () {
      this.checked = true
      this.cancelBind()
    },
    goBind () {
      this.bindShow = false
      this.$router.push({
        name: 'bindPhone'
      })
    },
    cancelBind () {
      this.bindShow = false
      localStorage.neverShowBindPhone = this.checked
    },
    imgUrl(name) {
      return require("@/assets/images/homeworkDetail/" + name + ".png");
    },
    message() {
      this.$router.push({
        name: "notice",
        params: {role: "teacher"}
      });
    },
    QRscan() {
      window.appPlug.scanQRCode((info) => {
        let reg = /\?(.*)/
        let match
        let uuid = (match = reg.exec(info)) && match[1];
        if (match && uuid) {
          // 扫描后获取参数成功
          homeApi.qrcode({
            token: this.userId,
            uuid: uuid,
            action: 'scan'
          }).then(succ => {
            // this.afterQRscan(succ, uuid)
            this.$router.push({path: '/afterQRscan/1/' + uuid})
          }, fail => {
            if (fail.status === -400) {
              Toast('二维码失效！')
            } else if (fail.status === -402) {
              Toast('登录确认已失效！')
            } else if (fail.status === -500) {
              Toast('接口请求参数错误！')
            } else if (fail.status === 2) {
              Toast('登录成功')
            } else {
              Toast(fail.msg);
            }
          })
        } else {
          this.$router.push({path: '/afterQRscan/-1000/1000'})
        }
      })
    },
    afterQRscan(params, uuid) {
    },

    go(type) {
      // 代码走本地
      let href = window.location.href.split("#")[0];
      let userInfo = JSON.parse(localStorage.getItem("user"));
      let baseUrl = "";
      let param = {};
      // 作业
      if (type === "homework1") {
        this.$store.state.homework.homeworkState = "0";
        this.$router.push({
          path: "/homework"
        });
        // 互动课堂
      } else if (type === "homework2") {
        this.$store.state.homework.homeworkState = "1";
        this.$router.push({
          path: "/homework"
        });
      } else if (type === "iclass") {
        api
          .judgeIclassLive({
            teacher_id: this.userId
          })
          .then(succ => {
            if (!succ.length) {
              // Dialog.alert({
              //   message: "请确认电脑端已“开始上课”"
              // }).then(() => {
              //   // on close
              // });
              this.iclassNotice = true
            } else {
              param = JSON.stringify({
                apiDomain: window.bus.$store.getters["runEnv/old"], // api地址
                jsDomain: "", // js地址
                userInfo: userInfo, // 用户信息
                referer: window.location.href, // 回跳地址
                time: new Date().getTime()
              });
              baseUrl =
                  href +
                  "/../../TP/index" +
                  (window.platform ? "-" + window.platform : "") +
                  ".html";
              href = baseUrl + "?param=" + encodeURIComponent(param);
              if (window.TeacherUtil && window.TeacherUtil.loadUrl) {
                window.TeacherUtil.loadUrl(href);
                return;
              }
              window.location.href = href;
            }
          });
        // 问答
      } else if (type === "qa") {
        if (!this.TEACHER_MIBILE_ASK) {
          Dialog.alert({
            message: '暂无权限<br>请联系学校管理员开通'
          })
          return
        }

        param = JSON.stringify({
          userid: parseInt(this.$store.state.account.userInfo.userid),
          domain: window.bus.$store.getters["runEnv/old"],
          domain_api: window.bus.$store.getters["runEnv/old"],
          domain_icom: href + "/../../QA",
          status: 1,
          lasthref: window.location.href,
          time: new Date().getTime()
        });
        baseUrl =
            href +
            "/../../QA/index" +
            (window.platform ? "-" + window.platform : "") +
            ".html";
        // cordova.exec(null, null, "HaleyPlugin", "startNewHtmlWithURL", [href]);
        href = baseUrl + "?param=" + encodeURIComponent(param);
        // alert(href);
        if (window.TeacherUtil && window.TeacherUtil.loadUrl) {
          window.TeacherUtil.loadUrl(href);
        }
        window.location.href = href;
      }
    },
    onLoad() {
      console.log("onload");
      this.getItems();
    },
    onRefresh() {
      console.log("onRefresh");
      this.getItems(true);
    },
    getItems(isRefresh) {
      if (isRefresh === true) {
        this.finished = true;
        // this.list.splice(0, this.list.length);
        this.page = 1;
      }

      let data = {
        page: this.page,
        per_page: this.per_page,
        user_id: this.userId
      };

      homeApi.task(data).then(
        r => {
          this.page++;
          if (isRefresh === true) {
            this.refreshLoading = false;
            this.list = r.lists;
          } else {
            for (var i = 0; i < r.lists.length; i++) {
              this.list.push(r.lists[i]);
            }
            this.loading = false;
          }
          if (r.lists.length === 0) {
            this.finished = true;
          } else {
            this.finished = false;
          }
        },
        j => {
          this.refreshLoading = false;
          this.loading = false;
        }
      );
    },
    tabChange(type) {
      if (type === "home") {
        return false;
      }
      this.$router.push({path: "/user-center"});
    },
    // 跳转错题本
    linkTo() {
      this.$router.push({path: '/wrongQtiNote'})
    },
    // 待处理批改事项跳转
    linkToHomeDetail(info) {
      let params = JSON.parse(info.module_start_param)
      this.$router.push({
        name: 'homeworkDetail',
        params: {
          classId: params.class_id,
          publishId: params.course_hour_publish_id
        },
        query: {
          from: 'home'
        }
      })
    }
  },
  components: {
    footerBar,
    remindBindPhone
  }
};
</script>
<style lang="scss" scoped>
  @import "@/style/base.scss";

  .spa {
    background-image: url("../../../assets/images/home/bg.jpg");
    background-repeat: no-repeat;
    background-size: 100% auto;
  }

  .top {
    padding-top: 3vh;
    height: 8vh;
    text-align: right;

    & > div {
      display: inline-block;
      padding: 7px;
      position: relative;
      .red-icon {
        display: inline-block;
        width: 7px;
        height: 7px;
        background: url("../../../assets/images/public/red-icon.png") no-repeat;
        background-size: 100% auto;
        position: absolute;
        top: 7px;
        right: 7px;
      }
    }

    .icon {
      width: 21px;
      height: 20px;
    }
  }

  .pannel {
    background: $white;
    width: 96%;
    // margin: $gap-small;
    border-radius: 15px;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    margin: 0 auto;

    .line {
      height: 1px;
      width: 80%;
      background-color: $gray5;
      padding: 0;
      margin: 0 auto;
      opacity: 0.4;
    }
    & > div {
      padding: 10px;
      display: flex;
      justify-content: center;
      text-align: center;
      height: 70px;
      align-items: center;
    }

    & > div > div {
      flex: 1 0 0;

      span {
        padding: 5px;
      }
    }

    .iclass,
    .homework {
      width: 50px;
      height: 50px;
      vertical-align: middle;
    }

    .iclass-record,
    .wrong,
    .ask {
      width: 35px;
      height: 35px;
      vertical-align: middle;
      display: block;
      margin: 0 auto;
      margin-bottom: 10px;
    }
  }

  .todo-box {
    margin-top: 18px;

    div.font-h1 {
      width: 96%;
      margin: 0 auto;
      padding: 8px 0;

    }

    span.font-h4 {
      color: $gray5;
      padding: 0 6px;
      float: right;

    }

    .van-list,
    .van-pull-refresh {
      min-height: calc(100vh - 358px);
    }

    .scroll {
      height: calc(100vh - 358px);
      overflow-y: scroll;
      overflow-x: hidden;
      padding: 0 13px;
      margin: 0 -13px;
    }

    .no-data {
      text-align: center;
      img{
        width: 100px;
        height: 130px;
        margin-top: 20px;
      }
    }

    .item {
      box-sizing: border-box;
      background: $white;
      border-radius: 5px;
      width: 96%;
      margin: $gap-small-x auto 0;
      padding: $gap-small-x;
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);

      &:first-child {
        margin-top: 0;
      }

      .flex {
        justify-content: center;
        height: 30px;
        align-items: center;

        .l {
          flex: 4 2 0;
        }
        .r {
          flex: 1 1 0;
        }
      }

      .t,
      .c {
        display: inline-block;
        color: $gray4;
      }
      .t {
        padding-right: 10px;
      }

      .btn {
        height: 25px;
        line-height: 25px;
        width: 65px;
        font-size: $font-size-small;
        border-radius: 25px;
      }

      .font-h3 {
        color: $gray4;
      }
    }

    .item > div:not(:first-child) {
      padding-top: $gap-small;
    }
  }
</style>
