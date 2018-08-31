<template>
  <audio style="display: none;" src="" v-on:error="playererror" v-on:ended="playerended" v-on:loadeddata="playerready"></audio>
</template>
<script>
export default {
  data () {
    return {
      url: '',
      audioele: null,
      mp3divele: null,
      playerstatus: 0,
      startClass: 'audio-preview',
      stopclass: 'audio-preview end',
      pauseclass: 'audio-preview pause',
      playclass: 'audio-preview play'
    }
  },
  methods: {
    // 播放器准备好
    playerready: function () {
      this.mp3divele.className = this.playclass
      this.playerstatus = 2
      this.$toast.clear()
    },
    // 播放结束
    playerended: function () {
      this.mp3divele.className = this.stopclass
      this.playerstatus = 0
      this.audioele = null
      this.mp3divele = null
    },
    // 播放error
    playererror: function () {
      if (this.mp3divele) this.mp3divele.className = this.startClass
      this.playerstatus = 0
      this.audioele = null
      this.$toast.clear()
    },
    playclick: function (url, target) {
      if (window.platform !== 'pc') {
        if (this.playerstatus === 1) {
          this.$toast('播放准备中请稍后')
          return
        } else if (this.playerstatus === 0 || this.mp3divele !== target) {
          this.$toast.loading({
            mask: true,
            message: "加载中...",
            duration: 0
          });
        }
        // this.$toast('加载中')
        if (this.mp3divele === target && this.playerstatus !== 0) {
          // 相等,暂停
          if (this.playerstatus === 2) {
            this.mp3divele.className = this.startClass
            this.audioele.stop()
            this.audioele.release()
            this.audioele = null
            this.mp3divele = null
            this.playerstatus = 0
          } else {
            this.audioele.play()
            this.mp3divele.className = this.playclass
            this.playerstatus = 2
          }
        } else {
          if (this.mp3divele != null) {
            this.mp3divele.className = this.startClass
            this.audioele.stop()
            this.audioele.release()
            this.audioele = null
          }
          this.mp3divele = target
          let that = this
          this.audioele = new window.Media(
            url,
            function () {
              // console.log('playAudio():Audio Success')
            },
            function (err) {
              console.log('playAudio():Audio Error: ' + err)
              that.playererror()
            },
            function (event) {
              if (event === 2) {
                that.playerready()
              } else if (event === 1) {
                that.mp3divele.className = that.pauseclass
                that.playerstatus = 1
              } else if (event === 4) {
                if (target === that.mp3divele) {
                  that.playerended()
                }
              }
            }
          )
          this.audioele.play()
          this.playerstatus = 1
          this.mp3divele.className = this.pauseclass
        }
      } else {
        this.audioele = this.$el
        if (this.mp3divele === target) {
          console.log(this.playerstatus)
          // 相等,暂停
          if (this.playerstatus === 2) {
            this.audioele.pause()
            this.playerstatus = 3
            this.mp3divele.className = this.pauseclass
          } else {
            this.audioele.play()
            this.mp3divele.className = this.playclass
            this.playerstatus = 2
          }
        } else {
          if (this.mp3divele != null) {
            this.mp3divele.className = this.stopclass
            this.audioele.pause()
            this.audioele.currentTime = 0
          }
          this.mp3divele = target
          this.audioele.src = url
          this.audioele.play()
          this.playerstatus = 1
          this.mp3divele.className = this.pauseclass
        }
      }
    }
  }
}
</script>
