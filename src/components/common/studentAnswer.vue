<template>
  <div v-bind:style="listContainerStyle">

    <div id="answerView" class="answerCharactor">
      <div v-if="answerInfo.inputarray == false" v-html="answerInfo.characters"></div>
      <template v-else>
        <Iminputdiv class="imIputDiv" v-for="(item, index) in answerInfo.inputarray" :key="index" :writable="false" :inputarray="answerInfo.inputarray" :is_correct="answerInfo.is_correct" :num="index" ></Iminputdiv>
      </template>
    </div>

    <div v-for="(item, index) in (answerInfo.images)" v-if="answerInfo.images != false" :key="item" @click="paint(index)">
      <div style="margin: 1rem 6%;" v-if="item">
        <img class="answerImage" :src="(answerInfo.pics[index] && answerInfo.pics[index][0]) || item" alt="">
      </div>
    </div>

    <div class="audiodiv audioContainer" v-for="(item) in answerInfo.audio.filter(itm => itm)" v-if="answerInfo.audio != false" :key="item" >
      <div class="comment_audio" @click.self="playAndPauseAudio(item, $event)"></div>
    </div>

    <div v-for="(item, index) in answerInfo.video" v-if="answerInfo.video != false" :key="index + 'a'">
      <div style="margin: 1rem 6%;" v-if="item">
        <img @click="clickVideo(item)" src="@/assets/images/answerDetail/video.png" class="videoImg" alt="">
      </div>
    </div>

    <!-- <div class="videoClass" v-if="videoShow">
      <video width="100%" height="100% " preload='auto'  autoplay :src='videoUrl' webkit-playsinline='true' playsinline='true' x-webkit-airplay='true' x5-video-player-type='h5' x5-video-player-fullscreen='true' x5-video-ignore-metadata='true' >
        <p>不支持video</p>
      </video>
    </div>

    <div class="videoCloseIcon" v-if="videoShow" @click="closeVideoShow"><i class="fa fa-times-circle"></i></div> -->

    <van-popup v-model="correct" class="tip-popup">
      <div class="tip-container">
      <p @click="toggle" style="text-align:right">
        <i class="icon"></i>
      </p>
        <van-row class="title">
          <van-col span="24">
            <p>
              手机上不支持播放该格式文件
            </p>
            <p>
              请老师在电脑上查看
            </p>
          </van-col>
        </van-row>

        <div class="tip-content">
          <p @click="toggle">
            知道了
          </p>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
// import vue from 'vue'
export default {
  name: "studentAnswer",
  props: ["answerInfo", "isScroll", "audioPlay"],
  data() {
    return {
      peopleNum: 0,
      videoShow: false,
      audioPauseShow: true,
      videoUrl: "",
      audioUrl: "",
      correct: false,
      listContainerStyle: {
        height: window.innerHeight - 155 + "px",
        background: "#fff",
        width: "100%"
      },
      videoPlayClass: {
        height: window.innerHeight + "px",
        width: window.innerWidth + "px"
      }
    };
  },
  created() {
    if (!this.isScroll) {
      this.$set(this.listContainerStyle, "overflow-y", "scroll");
    }
  },
  watch: {
    audioPlay (newVal, oldVal) {
      this.audioPauseShow = true;
      this.playMusic();
    }
  },
  methods: {
    clickVideo(item) {
      this.$StudentMp3Pause();
      if (item.substring(item.length - 4) !== ".mp4") {
        this.correct = true;
      } else {
        // video放到父级避免iOS播放bug
        this.$emit("video-play", {
          videoUrl: item,
          videoShow: true
        });
      }
    },
    toggle() {
      this.correct = false;
    },
    playAndPauseAudio(url, e) {
      url = url.indexOf("http") > -1 ? url : this.$store.getters["runEnv/old"] + url;
      this.$StudentMp3Play(url, e.currentTarget);
    },
    clickAudio(item) {
      this.audioPauseShow = !this.audioPauseShow;
      this.audioUrl = item;
      this.playMusic();
    },
    closeVideoShow() {
      this.videoShow = false;
    },
    rbf() {
      var audio = document.getElementById("music1");
      audio.currentTime = 0;
    },
    playMusic() {
      var audio = document.getElementById("music1");
      if (audio !== null) {
        // 检测播放是否已暂停.audio.paused 在播放器播放时返回false.
        if (audio.paused) {
          audio.play(); // audio.play();// 这个就是播放
        } else {
          audio.pause(); // 这个就是暂停
        }
      }
    },
    paint(idx) {
      console.log(idx);
      this.$emit("emit-paint", { idx });
    }
  }
};
</script>
<style lang="scss" scoped>
.audio-preview .comment_audio {
  display: inline-block;
  width: 36px;
  height: 36px;
  vertical-align: middle;
  background: url("../../assets/images/answerDetail/audioPause.png") no-repeat center/100%;
}
.audio-preview.play {
  display: inline-block;
  width: 36px;
  height: 36px;
  vertical-align: middle;
  background: url("../../assets/images/answerDetail/audioPlay.png") no-repeat center/100%;
}
.audio-preview.end {
  display: inline-block;
  width: 36px;
  height: 36px;
  vertical-align: middle;
  background: url("../../assets/images/answerDetail/audioPause.png") no-repeat center/100%;
}
.audio-preview.pause {
  display: inline-block;
  width: 36px;
  height: 36px;
  vertical-align: middle;
  background: url("../../assets/images/answerDetail/audioPause.png") no-repeat center/100%;
}
.audiodiv .comment_audio {
  background: url("../../assets/images/answerDetail/audioPause.png") no-repeat center/100%;
}
.comment_audio {
  display: inline-block;
  width: 36px;
  height: 36px;
  vertical-align: middle;
}
.audio-preview {
  display: inline-block;
  width: 36px;
  height: 36px;
  vertical-align: middle;
  background: url("../../assets/images/answerDetail/audioPause.png") no-repeat center/100%;
  // box-shadow: 0 0 2px rgba(0,0,0,0.2);
  // width: 88%;
  // margin: 1rem 6%;
  // text-align: center;
  // height: 64px;
  // line-height: 64px;
  // position: relative;
  // display: inline-block;
  // background-color: #f5f8f8;
  // padding: 10px;
  // margin-top: 5px;
  // top: -20px;
  // left: 20px;
  // border-radius: 10px;
  // line-height: 16px;
  // &:after {
  //   position: absolute;
  //   border-width: 10px;
  //   border-color: #f5f8f8 transparent transparent transparent;
  //   border-style: solid;
  //   content: "";
  //   left: -10px;
  //   top: 5px;
  // }
}
.answerCharactor {
  background-color: #fff;
  margin: 1rem 4%;
  line-height:25px;
}
.answerImage {
  width: 100%;
  border:1px solid #ccc;
}
.audioContainer {
  box-shadow: 0 0 2px rgba(0,0,0,0.2);
  width: 88%;
  margin: 1rem 6%;
  text-align: center;
  height: 64px;
  line-height: 64px;
}
.videoImg {
  width: 100%;
  box-shadow: 0 0 2px rgba(0,0,0,0.2)
}
.imIputDiv {
  margin-right: 15px;
}
.tip-popup {
  width: calc(100vw - 85px);
  border-radius: 10px;
  padding: 15px;
  box-sizing: border-box;
}

.tip-container > .title {
  line-height: 38px;
  text-align: center;
  font-weight: 400;
  font-size: 16px;
  margin-bottom: 10px;
}

.tip-container > .tip-content {
  text-align: center;
}
.tip-container > .tip-content > p {
  line-height: 50px;
  margin-bottom: 15px;
  border: 1px solid #08b783;
  color: #08b783;
  border-radius: 13px;
}
p .icon {
  display: inline-block;
  width: 14px;
  height: 14px;
  // background: url('../../assets/images/public/close.png') center center;
  background-size: 100% 100%;
}
p .icon:active {
  // background: url('../../assets/images/public/close-click.png') center center;
  background-size: 100% 100%;
}
.tip-container .warm {
  font-size: 14px;
  text-align: center;
  padding-bottom: 20px;
  text-align: left;
  line-height: 20px;
}
</style>
