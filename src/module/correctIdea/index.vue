<template>
  <div class="cube-page cube-view button-view">

    <header class="header">
      <i class="cubeic-back" @click="goBatchEvaluate">
          <i class="back-up-arrow"></i>
        </i>
      <h1>
        <div>
          本题批改意见
        </div>
        <div class="audioImgDiv" @click="clickVoiceShow" v-if="audioArray.length === 0">
          <img class="audioImg" src="@/assets/images/batchEvaluate/voicePng.png" alt="">
        </div>
      </h1>
    </header>

    <!-- 录音播放 -->
    <div class="comment" v-if="audioArray.length > 0">
      <div class="commentAvatarImgDiv">
        <img :src="avatarImgUrl" class="commentAvatarImg" alt="">
      </div>
      <div class="audiodiv" v-for="(item, index) in audioArray" :key="index" @click.self="playAndPauseAudio(item, $event)">
        <div class="comment_audio"></div>
        <i class="fa fa-close closeAudio" @click.stop="closeAudio"></i>
        <span>{{formatAudioTime}}</span>
      </div>
    </div>

    <van-cell-group>
      <van-field v-model="comment" type="textarea" placeholder="输入评语内容" rows="3"/>
    </van-cell-group>

    <div class="noticeWordNum">
      <div style="float: left;">还可以输入<span style="color: #f7af6c">{{50 - comment.length}}</span>字</div>
      <div style="float: right;" @click="clearTextArea">清空</div>
    </div>

    <div class="commentsTitle">
      <div style="float: left;">评语模板</div>
      <div style="float: right;color: #2ec2a9;" @click="goAddComments">添加评语</div>
      <div class="editTemplateBtn" @click="goEditComments">编辑模板</div>
      <div style="clear: both;"></div>
    </div>

    <div style="background: #fff;">
      <div class="listContainer" v-bind:style="listContainerStyle">
        <div class="templateList" v-for="(item, index) in templateLists" :key="index" @click="chooseTemplate(item)">{{item.comment}}</div>
      </div>
    </div>

    <div class="comfirmBtnContainer">
      <div class="comfirmBtn" :outline="true" @click="sureBtn">确认</div>
    </div>

    <van-popup v-model="showVoicePopup" position="bottom" :overlay="true" @click-overlay="clickOverlay">
      <div class="van-picker">
        <div class="van-hairline--top-bottom van-picker__toolbar">
          <div @click="clickVoiceChoose('cancel')" class="van-picker__cancel">取消</div>
          <div class="longTimeNotice">{{longTimeNotice}}</div>
          <div @click="clickVoiceChoose('sure')" class="van-picker__confirm">上传</div>
        </div>
        <div class="van-picker__columns" style="height: 220px;">
          <div class="van-picker-column" style="height: 220px;display: flex;align-items: center;justify-content: center;">
            <div @click="clickRecordBtn">

              <div class="circleNoRotate" v-show="!isRecording">
                <div class="circleNoRotate-div">
                  <img style="width: 50%;" src="@/assets/images/batchEvaluate/voiceBtn.png" alt="voiceBtn">
                </div>
              </div>
              <div class="spinner" v-show="isRecording"></div>
              <div style="margin-top: 10px;" v-show="!isRecording">点击开始录音</div>
              <div style="margin-top: 10px;" v-show="isRecording">正在录音...</div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import api from "@/module/correctIdea/axios/correctIdea.js";
import {formatTimeToString, formatDeadLine} from '@/utils/filter';
import {mapGetters, mapMutations} from 'vuex'

export default {
  name: "comments",
  data() {
    return {
      listContainerStyle: {
        height: window.innerHeight - 340 + "px"
      },
      rateType: "",
      comment: "",
      checkBoxGroup: [],
      templateLists: [],
      audioArray: [],
      showVoicePopup: false,
      countNum: 3,
      isRecording: false,
      src: "",
      studentAnswerDetailData: this.$store.state.answerDetail.studentAnswerDetailData,
      audioTime: 0,
      formatAudioTime: 0,
      chooseType: "",
      recTime: 0,
      longTimeNotice: "最长录音5分钟"
    };
  },
  computed: {
    ...mapGetters({
      env: 'runEnv/old'
    })
  },
  mounted: function() {
    var self = this;
    self.account = self.$store.state.account;
    self.homeworkOneListInfoObj = self.$store.state.homeworkDetail.homeworkInfo;
    self.studentInfo = self.$store.state.answerDetail.studentOneDetail;
    self.comment = self.$store.state.answerDetail.studentAllInfoObj.comment;
    if (JSON.stringify(self.$store.state.answerDetail.studentAllInfoObj.comment_audio) !== '{}') {
      self.audioArray.push(self.$store.state.answerDetail.studentAllInfoObj.comment_audio.url);
      self.formatAudioTime = self.formatTimeToString(self.$store.state.answerDetail.studentAllInfoObj.comment_audio.time_length);
    }
    self.getTemplateList();

    // phonegap录音
    window.getAudio = function(url) {
      // alert("调用");
      // alert(cordova);
      if (window.platform === "ios") {
        window.src = "tmp-" + Math.floor(Math.random() * 100000) + ".wav";
      } else {
        window.src =
          cordova.file.externalDataDirectory +
          "tmp-" +
          Math.floor(Math.random() * 100000) +
          ".mp3";
        if (window.platform === "android") {
          window.src =
            cordova.file.externalDataDirectory +
            "tmp-" +
            Math.floor(Math.random() * 100000) +
            ".mp3";
        }
      }

      function errorHandler() {
        alert("An error occured");
      }

      function initFS(fs) {
        // alert('fs:' + fs)
        fs.root.getFile(
          src,
          {},
          function(fs) {
            // alert('aaa:' + fs)
            fs.file(function(file) {
              // alert('bbb:' + fs)
              var imageSrc = file.localURL;
              resolveLocalFileSystemURL(imageSrc, function(entry) {
                var nativePath = entry.toURL();
                window.src = nativePath;
                // alert("nativePath:" + nativePath);
                let getGrant =
                  self.$store.getters["runEnv/api2"] +
                  "jwt/homework/correct/upload_auth";
                let array = [];
                array.push(window.src);
                var param = [
                  self.account.userInfo.userid,
                  self.account.jwt.jwt,
                  getGrant,
                  JSON.stringify(array)
                ];
                // alert("param:" + param);
                self.$toast.loading({
                  mask: true,
                  message: "上传中..."
                });
                window.appPlug.aliUpLoad(
                  param,
                  function(response) {
                    // alert(response);
                    self.$toast.clear();
                    self.audioArray = [];
                    let res = JSON.parse(response);
                    let len = res.length;
                    for (let i = 0; i < len; i++) {
                      self.audioArray.push(
                        res[i].host_oss + res[i].path_physical
                      );
                    }
                    // alert(self.audioArray[0]);
                  },
                  function(response) {
                    alert("aliUpload-error:" + response);
                  }
                );
              });
            }, errorHandler);
          },
          errorHandler
        );
      }

      function onAudioSuccess() {
        // alert("onAudioSuccess");
        if (self.chooseType === 'sure') {
          if (window.platform === "ios") {
            window.requestFileSystem =
              window.requestFileSystem || window.webkitRequestFileSystem;
            window.requestFileSystem(
              window.TEMPORARY,
              5 * 1024 * 1024,
              initFS,
              errorHandler
            );

            return;
          }

          if (window.platform === "android") {
            let getGrant =
              self.$store.getters["runEnv/api2"] +
              "jwt/homework/correct/upload_auth";
            let array = [];
            array.push(window.src);
            var param = [
              self.account.userInfo.userid,
              self.account.jwt.jwt,
              getGrant,
              JSON.stringify(array)
            ];
            // alert("param:" + param);
            self.$toast.loading({
              mask: true,
              message: "上传中..."
            });
            window.appPlug.aliUpLoad(
              param,
              function(response) {
                // alert(response);
                self.$toast.clear();
                self.audioArray = [];
                let res = JSON.parse(response);
                let len = res.length;
                for (let i = 0; i < len; i++) {
                  self.audioArray.push(res[i].host_oss + res[i].path_physical);
                }
                // alert(self.audioArray[0]);
              },
              function(response) {
                alert("aliUpload-error:" + response);
              }
            );
          }
        }
      }
      function onAudioError(type) {
        alert("onAudioError：" + JSON.stringify(type));
      }

      window.mediaRec = new Media(window.src, onAudioSuccess, onAudioError);
      // alert("window.src: " + window.src);
      window.mediaRec.startRecord();
      self.time();
    };
  },
  activated() {
  },
  watch: {
    comment: function(val, oldVal) {
      if (val.length > 50) {
        this.comment = this.comment.slice(0, 50);
      }
    }
  },
  methods: {
    formatTime(time) {
      var second = time % 60;
      second = second > 9 ? second : "0" + second;
      var minute = Math.floor(time / 60);
      minute = minute > 9 ? minute : "0" + minute;
      return minute + ":" + second;
    },
    time() {
      this.timeOut = setTimeout(() => {
        this.recTime = this.recTime + 1;
        this.longTimeNotice = this.formatTime(this.recTime);
        this.formatAudioTime = this.formatTimeToString(this.recTime * 1000);
        if (this.recTime >= 300) {
          this.clickVoiceChoose("sure");
          this.recTime = 300;
          this.longTimeNotice = "最长录音5分钟";
        } else {
          this.time();
        }
      }, 1000);
    },
    closeAudio() {
      this.audioArray = [];
      this.$destoryMp3();
    },
    goBatchEvaluate() {
      this.$router.go(-1);
    },
    goAddComments() {
      this.$store.dispatch("batchEvaluateCommentsTemplateType", 2);
      this.$router.push({
        path: "/addComments"
      });
    },
    goEditComments() {
      this.$store.dispatch("batchEvaluateCommentsTemplateType", 2);
      this.$router.push({
        path: "/editComments"
      });
    },
    clickOverlay() {
      this.showVoicePopup = false;
      this.chooseType = "";
      window.mediaRec.stopRecord();
    },
    formatTimeToString (time) {
      return formatTimeToString(time)
    },
    clickVoiceShow() {
      this.isRecording = false;
      this.showVoicePopup = true;
    },
    playAndPauseAudio (url, e) {
      url = url.indexOf('http') > -1 ? url : this.$store.getters['runEnv/old'] + url
      this.$StudentMp3Play(url, e.currentTarget)
    },
    afteruploadsucc(msg) {
      alert(JSON.stringify(msg));
    },
    // 点击录音
    clickRecordBtn() {
      if (!this.isRecording) {
        this.recTime = 0;
        this.isRecording = true;
        this.longTimeNotice = this.formatTime(this.recTime);
        window.getAudio();
      } else {
        this.$toast({
          message: "录音中",
          duration: 750
        });
      }
    },
    clickVoiceChoose(type) {
      var self = this;
      self.showVoicePopup = false;
      self.chooseType = type;
      // self.recTime = 0;
      self.longTimeNotice = "最长录音5分钟";
      window.mediaRec.stopRecord();
      clearTimeout(self.timeOut)
    },
    getTemplateList() {
      var self = this;
      var data = {
        user_id: self.account.userInfo.userid,
        type: 2
      };

      if (self.account.userInfo.avatar.indexOf('http://') === -1) {
        self.avatarImgUrl = self.env + self.account.userInfo.avatar
      } else {
        self.avatarImgUrl = self.account.userInfo.avatar
      }

      api.commentplGetList(data).then(function(response) {
        self.templateLists = response;
      });
    },
    clearTextArea() {
      this.comment = "";
      this.audioArray = [];
      this.$destoryMp3();
    },
    sureBtn() {
      var self = this;
      var audios = [];
      var nowTime = self.$dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
      if (self.recTime === 0) {
        self.audioTime = self.$store.state.answerDetail.studentAllInfoObj.comment_audio.time_length;
      } else {
        self.audioTime = self.recTime * 1000;
      }
      if (self.audioArray.length > 0) {
        audios.push({
          "url": self.audioArray[0],
          "time_length": self.audioTime,
          "create_time": nowTime
        })
      }

      var data = {
        publish_id: self.homeworkOneListInfoObj.course_hour_publish_id,
        student_id: self.studentInfo.userid,
        comment: self.comment,
        teacher_id: self.account.userInfo.userid,
        dcom_entity_id: self.studentAnswerDetailData.dcom_entity_id,
        audios: audios,
        course_resource_id: self.studentAnswerDetailData.course_resource_id,
        qti_question_id: self.studentAnswerDetailData.qti_question_id ? self.studentAnswerDetailData.qti_question_id : self.studentAnswerDetailData.source_pk_id
      };

      api.addComment(data).then(function(response) {
        self.$toast({
          message: "批改意见保存成功！",
          duration: 750
        });
        self.$router.go(-1);
      });
    },
    chooseTemplate(item) {
      this.comment += item.comment;
    }
  },
  beforeRouteleave(to, from, next) {
    this.$destoryMp3();
    this.clickOverlay();
    next();
  }
};
</script>

<style scoped lang="scss">
$primary-color: #08b783;
$active-color: #13d098;
$border-state: 1px solid rgb(234, 237, 240);
@import "@/style/variable.scss";
.editTemplateBtn {
  float: right;
  color: #2ec2a9;
  margin-right:10px;
}
.audioImgDiv {
  position: absolute;
  right: 10px;
  top: 0;
  height: 45px;
}
.audioImg {
  vertical-align: middle;
  width: 28px;
}
.commentsTitle {
  background: #fff;
  height: 35px;
  line-height: 35px;
  padding: 5px 10px;
  border-bottom: 1px solid rgb(204, 204, 204);
}
.longTimeNotice {
  font-size: 14px;
  color: #333;
}
.closeAudio {
  color: red;
  position: absolute;
  right: -5px;
  top: -5px;
}
.commentAvatarImg{
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
.commentAvatarImgDiv{
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: inline-block;
  vertical-align:bottom;
}
.activeTab {
  background-color: #2ec2a9;
  color: #fff;
}
.noticeWordNum {
  background: rgb(255, 255, 255);
  border-top: 1px solid rgb(204, 204, 204);
  height: 35px;
  line-height: 35px;
  padding: 5px 10px;
  color: #3e3b3b;
  margin-bottom: 10px;
}
.templateList {
  background: #fff;
  height: 35px;
  line-height: 35px;
  padding: 5px 10px;
  border-bottom: 1px solid #ccc;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.listContainer {
  padding: 0 10px;
  overflow-y: auto;
}
.comfirmBtnContainer {
  background-color: #ffffff;
  width: 100%;
  height: $bottom-height;
  bottom: 0px;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}
.comfirmBtn {
  height: 54px;
  line-height: 54px;
  width: 50%;
  border-radius: $bottom-btn-radius;
  background-color: $primary-color;
  font-size: $bottom-btn-font-size;
  text-align: center;
  color: #fff;
}
.comfirmBtn:active {
  background-color: $active-color;
}
.circleNoRotate {
  border: 1px solid #13d098;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.spinner {
  width: 120px;
  height: 120px;
  background-color: #13d098;
  border-radius: 100%;
  -webkit-animation: scaleout 1.3s infinite ease-in-out;
  animation: scaleout 1.3s infinite ease-in-out;
}
@-webkit-keyframes scaleout {
  0% {
    -webkit-transform: scale(0);
  }
  100% {
    -webkit-transform: scale(1);
    opacity: 0;
  }
}
@keyframes scaleout {
  0% {
    transform: scale(0);
    -webkit-transform: scale(0);
  }
  100% {
    transform: scale(1);
    -webkit-transform: scale(1);
    opacity: 0;
  }
}
.circleNoRotate-div {
  background-color: #13d098;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.comment {
  background: #fff;
  padding: 18px 28px;
  &>div {
    line-height: 30px;
  }
  .audio-preview .comment_audio{
    background: url('../../assets/images/comments/audio_start.png') no-repeat center/100%;
  }
  .audio-preview.play .comment_audio {
    background: url('../../assets/images/comments/audio_play.gif') no-repeat center/100%;
  }
  .audio-preview.end .comment_audio {
    background: url('../../assets/images/comments/audio_end.png') no-repeat center/100%;
  }
  .audio-preview.pause .comment_audio {
      background: url('../../assets/images/comments/audio_start.png') no-repeat center/100%;
  }
  .audiodiv .comment_audio {
    background: url('../../assets/images/comments/audio_start.png') no-repeat center/100%;
  }
  .comment_audio {
    display: inline-block;
    width: 2.8vw;
    height: 2vh;
    margin-right: 30px;
  }
  .audiodiv,.audio-preview {
    position: relative;
    display: inline-block;
    background-color: #f5f8f8;
    padding: 10px;
    margin-top: 5px;
    border-radius: 10px;
    line-height: 16px;
    &:after {
      position: absolute;
      border-width: 10px;
      border-color: #f5f8f8 transparent transparent transparent;
      border-style: solid;
      content: '';
      left: -10px;
      top: 5px;
    }
    // &:before {
    //   position: absolute;
    //   content: '';
    //   border: 5px solid #ff5366;
    //   border-radius: 50%;
    //   right: -15px;
    //   top: 0;
    // }
  }
}
[class*=van-hairline]::after {
  border-top: none !important;
}
</style>
