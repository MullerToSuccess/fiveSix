<template>
  <!--eslint-disable-->
  <div id="qa_painthand" class="painthanddiv">
    <header-bar
      @back="goback"
      class="paint-header">
      <p slot="title-name">{{cp_title}}</p>
      <p @click="evenSave"
         slot="right-area">保存</p>
    </header-bar>
    <!--    <div class="phbackdiv">
        <div id="phtitlediv" class="phtitlediv">1/1</div>
        <a class="phclosea"
        _tk="__ICOM__.painthand.on_close();__PROJ__.app.control.back_point('painthandback')"></a>
        <div class="phsavediv" _tk="__ICOM__.painthand.on_save()">保存</div>
        </div>-->
    <div class="phcontentdiv">
      <img id="phorgimg" src="" style="display:none;">
      <img id="pheditimg" src="" style="display:none;">
      <canvas id="phturncanvas" style="display:none;"></canvas>
      <div class="phcanvasdiv" id="phcanvasdiv">
        <div style="text-align:center;">加载中...</div>
      </div>
    </div>
    <!---->
    <div class="phtooldiv">
      <div
        v-for="(icon, idx) in icons"
        :key="idx"
        :class="{select: idx === select}"
        @click="iconClick(idx)"
        class="phtbndiv" _tk="__ICOM__.painthand.on_turn(this)">
        <span class="paint-icon" :class="'paint-icon-' + idx"></span>
        <span class="paint-text">{{icon.text}}</span>
      </div>

      <div id="phcolordiv" class="phcolordiv" _prevent="1" style="display:none;">
        <div>
          <div
            v-for="(weight, idx) in color.weight"
            :key="weight.value"
            :class="{click: idx === color.selectWeight}"
            @click="selwidth(weight.value, idx)"
            class="phlinewidthdiv">
            <div class="phline" :style="{height: weight.value + 'px'}"></div>
          </div>
        </div>
        <div>
          <div
            v-for="(dot, idx) in color.dots"
            :key="dot.color"
            :class="{click: idx === color.select}"
            @click="onSelcolor(dot.color, idx)"
            class="phselcolordiv">
            <div class="phcolor bg-black" :style="{backgroundColor: dot.color}"></div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="loading-mask"
      v-show="loading">
      <van-loading type="spinner" color="black" />
    </div>
  </div>
</template>

<script>
/* eslint-disable */
  import headerBar from '@/components/headerBar.vue'
  import {Factory} from './constructor.js'
  import api from "@/module/answerDetail/axios/checkAnswerDetail.js";
  export default {
    name: "CheckDetail",
    data() {
      return {
        icons: [
          {
            text: '旋转'
          },
          {
            text: '画笔'
          },
          {
            text: '调色板'
          },
          {
            text: '擦除'
          },
          {
            text: '清空'
          }
        ],
        color: {
          weight: [
            {
              value: 2,
            },
            {
              value: 5,
            },
            {
              value: 8
            }
          ],
          dots: [
            {
              color: '#000'
            },
            {
              color: '#ff1a1a'
            },
            {
              color: '#ffcc00'
            },
            {
              color: '#339900'
            },
            {
              color: '#0095da'
            },
            {
              color: '#9966ff'
            }
          ],
          select: 1,
          selectWeight: 0,
        },
        select: 1,
        imgIdx: 1,
        loading: 0,
        paint: null,
        enableBrush: false,
        preventRepet: false,
      }
    },
    components: {headerBar},
    methods: {
      iconClick(idx) {
        let {paint} = this,
          temp = this.select === idx;
        switch (idx) {
          case 0: {
            paint.on_turn((text) => {
              this.$toast(text);
            });
          }
            break;
          case 1: {
            this.select = temp ? -1 : idx;
            paint.on_pen(temp);
          }
            break;
          case 2: {
            if (temp) {
              this.select = 1;
              paint.on_pen(!temp);
            } else {
              this.select = idx;
              paint.on_color();
            }
          }
            break;
          case 3: {
            this.select = temp ? -1 : idx;
            paint.on_erase(temp);
          }
            break;
          case 4: {
            this.$dialog.confirm({
              message: '确认清除所有的绘画内容吗？'
            }).then(() => {
              paint.on_clear();
            }).catch(() => {
              // on cancel
            });
          }
            break
        }
      },
      goback() {
        this.$router.go(-1);
      },
      onSelcolor(color, idx) {
        this.color.select = idx;
        this.paint.on_selcolor(color);
      },
      selwidth(wt, idx) {
        this.color.selectWeight = idx;
        this.paint.on_selwidth(wt);
      },
      drawBegin() {
        this.select === 2 && (this.select = 1);
      },
      evenSave() {
        if (this.preventRepet) {
          this.preventRepet = false;
          this.loading = 1;
          let routeParam = this.$route.params,
            response = this.paint.on_save();
            console.log(routeParam)
          Promise.all(Object.entries(response).map(([idx, obj]) => {
            return Promise.all(Object.entries(obj).map(([type, {request, content, path}]) => {
              return content !== 'none' && api[request]({content, path}).then(({http_url = '', src = ''}) => {
                return {idx, url: http_url || src}
              }) || Promise.resolve({})
            }))
          })).then((res) => {
            let temp = {};
            res.forEach(({0: {idx, url}}) => {
              Object.assign(temp, {
                [idx]: [url, 0]
              })
            });
            api.mergeWithStudent(Object.assign(routeParam.info, {
              pic: temp,
            })).then(() => {
              this.$toast('保存成功');
              this.preventRepet = true;
              this.loading = 0;
              this.goback();
            }).catch(() => {
              this.$toast('保存失败');
              this.preventRepet = true;
              this.loading = 0;
            });
          }).catch(() => {
            this.$toast('保存失败');
            this.preventRepet = true;
            this.loading = 0;
          });
        }
      },
      $_update(key, param) {
        this[key] = param;
      },
    },
    computed: {
      cp_title() {
        let params = this.$route.params,
          keys = Object.keys(params.images).sort();
        return `${keys.findIndex(k => k == this.imgIdx) + 1}/${keys.length}`
      },
    },
    mounted() {
      let routeParam = this.$route.params,
        param = {
          drawBegin: this.drawBegin,
          $toast: this.$toast,
          $_update: this.$_update,
        };
      this.paint = new Factory().open(Object.assign(param, routeParam), () => {
        this.preventRepet = true;
      });
    },
  }

</script>

<style lang="scss" scoped>

  /* eslint-disable */
  #qa_painthand {
    z-index: 100;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #f3f3f4;
  }

  .phcontentdiv {
    height: 81%;
    line-height: 2.8rem;
    background-color: #f3f3f4;
    text-align: center;
    position: relative;
    vertical-align: top;
  }

  .van-hairline--bottom.paint-header {
    height: 8%;
    align-items: center;
  }

  .phtooldiv {
    position: relative;
    height: 11%;
    padding-top: 2vh;
    background-color: #ffffff;
    text-align: center;
    vertical-align: top;
    background: url("../../../assets/images/painthand/phtooldiv.png") no-repeat scroll 0 0px transparent;
    background-size: 100% 100%;

    .phtbndiv {
      float: left;
      width: 20%;
      height: 100%;
      color: #86868a;
      font-size: 0.9rem;
      &:active, &.select {
        color: #1ec6a7;
        .paint-icon-0 {
          background-image: url("../../../assets/images/painthand/turn_c.png");
        }
        .paint-icon-1 {
          background-image: url("../../../assets/images/painthand/pen_c.png");
        }
        .paint-icon-2 {
          background-image: url("../../../assets/images/painthand/color_c.png");
        }
        .paint-icon-3 {
          background-image: url("../../../assets/images/painthand/erase_c.png");
        }
        .paint-icon-4 {
          background-image: url("../../../assets/images/painthand/clear_c.png");
        }
      }
    }

    .paint-icon {
      display: block;
      height: 4vh;
      background: no-repeat scroll center transparent;
      background-size: auto 100%;
      &.paint-icon-0 {
        background-image: url("../../../assets/images/painthand/turn.png");
      }
      &.paint-icon-1 {
        background-image: url("../../../assets/images/painthand/pen.png");
      }
      &.paint-icon-2 {
        background-image: url("../../../assets/images/painthand/color.png");
      }
      &.paint-icon-3 {
        background-image: url("../../../assets/images/painthand/erase.png");
      }
      &.paint-icon-4 {
        background-image: url("../../../assets/images/painthand/clear.png");
      }
    }

    .paint-text {
      display: block;
      height: 5vh;
      line-height: 5vh;
      font-size: 0.9rem;
    }
  }

  #qa_painthand div.phtbndiv:active {
    color: #1ec6a7;
  }

  #qa_painthand div.phtbndiv.click {
    color: #1ec6a7;
  }

  .phcolordiv {
    position: absolute;
    bottom: 80%;
    left: 3vw;
    width: 94vw;
    height: 22vh;
    line-height: 3.8rem;
    background: #ffffff;
    z-index: 1;
    text-align: center;
    background: url("../../../assets/images/painthand/colordiv.png") no-repeat scroll 0 0px transparent;
    background-size: 100% 100%;

    .phlinewidthdiv {
      width: 19.2vw;
      height: 4.4vh;
      line-height: 1.5rem;
      display: inline-block;
      text-align: center;
      border-radius: 2vw;
      margin: 3.5vh 2vw 2.5vh 2vw;
      vertical-align: top;
    }

    .phlinewidthdiv.click {
      background: #474747;
    }

    .phlinewidthdiv div.phline {
      width: 13.5vw;
      display: inline-block;
      text-align: center;
      background: #ffffff;
      border-radius: 4px;
    }

    .phselcolordiv {
      width: calc(100% / 6);
      float: left;
      height: 7.5vh;
      line-height: 3rem;
      display: inline-block;
      text-align: center;
      border-radius: 2vw;
      margin: 0 0 1vh 0;
      vertical-align: top;
    }

    .phselcolordiv.click > div {
      border: 1px solid #ffffff;
    }

    .phcolor {
      width: 5vh;
      height: 5vh;
      display: inline-block;
      text-align: center;
      border-radius: 50%;
      margin-top: calc(1.25vh - 1px);
    }

  }

  .phcanvasdiv {
    display: inline-block;
    position: relative;
    width: 100%;
    height: 100%;
    /*    line-height: <% = window . h *0.81% > px;*/
    text-align: left;
    vertical-align: top;
    overflow: auto;
  }

  .loading-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10001;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @-webkit-keyframes slideinfromright {
    from {
      -webkit-transform: translateX(100%);
    }
    to {
      -webkit-transform: translateX(0);
    }
  }

  @keyframes slideinfromright {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @-webkit-keyframes slideinfromleft {
    from {
      -webkit-transform: translateX(-100%);
    }
    to {
      -webkit-transform: translateX(0);
    }
  }

  @keyframes slideinfromleft {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @-webkit-keyframes slideouttoleft {
    from {
      -webkit-transform: translateX(0);
    }
    to {
      -webkit-transform: translateX(-100%);
    }
  }

  @keyframes slideouttoleft {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-100%);
    }
  }

  @-webkit-keyframes slideouttoright {
    from {
      -webkit-transform: translateX(0);
    }
    to {
      -webkit-transform: translateX(100%);
    }
  }

  @keyframes slideouttoright {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(100%);
    }
  }
</style>

<style lang="scss">

  .phcanvasdiv {
    .phzoomdiv {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.0);
      display: none;
      z-index: 1;
    }
  }

</style>
