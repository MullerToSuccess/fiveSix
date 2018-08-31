<template>
  <div class="page">
    <div id="keyboard-com">
      <div class="score">
        <div class="van-hairline--surround score-input">{{score}}</div>
        <div class="should-score">满分:{{shouldScore}}分</div>
      </div>
      <div class='keyboard' @click.stop='handleKeyPress'>
        <div class='key-row'>
          <div class='key-cell' data-num='7'>7</div>
          <div class='key-cell' data-num='8'>8</div>
          <div class='key-cell' data-num='9'>9</div>
          <div class='key-cell' data-num='D' style="font-weight:500">C</div>
        </div>
        <div class='key-row'>
          <div class='key-cell' data-num='4'>4</div>
          <div class='key-cell' data-num='5'>5</div>
          <div class='key-cell' data-num='6'>6</div>
          <div class='key-cell' data-num='C' style="font-weight:500">清空</div>
        </div>
        <div class='key-row'>
          <div class='key-cell' data-num='1'>1</div>
          <div class='key-cell' data-num='2'>2</div>
          <div class='key-cell' data-num='3'>3</div>
          <div class='key-cell' data-num='-1'></div>
        </div>
        <div class='key-row'>
          <div class='key-cell disabled' data-num='-1'></div>
          <div class='key-cell' data-num='.'>.</div>
          <div class='key-cell' data-num='0'>0</div>
          <div class='key-cell' data-num='-1'></div>
        </div>
        <div class='key-confirm' data-num='S'>确认</div>
      </div>
    </div>
    <div class="model"></div>
  </div>
</template>
<script>
// 数字打分键盘组件
export default {
  name: 'Keyboard',
  props: {
    shouldScore: {
      // required: true,
      default: 100
    }
  },
  data() {
    return {
      score: ''
    }
  },
  methods: {
    handleKeyPress(e) {
      let num = String(e.target.dataset.num)
      // 不同按键处理逻辑
      // -1 代表无效按键，直接返回
      if (num === '-1') return false
      switch (num) {
        // 小数点
        case '.':
          this.handleDecimalPoint()
          break
        // 删除键
        case 'D':
          this.handleDeleteKey()
          break
        // 清空键
        case 'C':
          this.handleClearKey()
          break
        // 确认键
        case 'S':
          this.handleConfirmKey()
          break
        // 数字键
        default:
          this.handleNumberKey(num)
          break
      }
    },
    handleNumberKey(num) {
      if (this.score.length === 1 && this.score[0] === '0') this.score = ''
      if (this.score.indexOf('.') > 0 && this.score.split('.')[1].length >= 1) return false
      this.score += num
      if (Number(this.score) >= this.shouldScore) {
        this.score = this.shouldScore + ''
        return false
      }
    },
    handleDecimalPoint() {
      if (this.score.indexOf('.') > 0) {
        return false
      }
      if (!this.score) {
        this.score = '0'
      }
      this.score += '.'
    },
    handleDeleteKey() {
      let s = this.score
      if (!s.length) return false
      this.score = s.substring(0, s.length - 1)
    },
    handleClearKey() {
      this.score = ''
    },
    handleConfirmKey() {
      if (this.score[this.score.length - 1] === '.') this.score = this.score.substring(0, this.score.length - 1)
      if (this.score) this.$emit('score', this.score)
    }
  }
}
</script>
<style lang="scss" scoped>
.page{
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
#keyboard-com{
  position: absolute;
  bottom: 0;
  left: 0;
  height: 330px;
  width: 100%;
  font-size: 16px;
  .score{
    height: 90px;
    width: 100%;
    box-sizing: border-box;
    padding: 10px 10px 0 10px;
    .score-input{
      width: 100%;
      height: 40px;
      line-height: 40px;
      padding-left: 10px;
      box-sizing: border-box;
      overflow: hidden;
    }
    .should-score{
      width: 100%;
      height: 40px;
      line-height: 40px;
    }
  }
  .keyboard {
    height: 240px;
    width: 100%;
    font-size: 16px;
    position: relative;
    .key-row {
      display: flex;
      position: relative;
      height: 60px;
      line-height: 60px;
      &::before{
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        height: 1px;
        border-top: 1px solid #e8ebee;
        color: #d5d5d6;
        transform-origin: 0 0;
        transform: scaleY(0.5);
      }
      .key-cell {
        flex: 1;
        text-align: center;
        position: relative;
        height: 60px;
        line-height: 60px;
        font-weight: 600;
        &:active{
          background-color: #f5f7f8;
        }
        &::after{
          content: '';
          position: absolute;
          overflow: hidden;
          top: 0;
          right: 0;
          bottom: 0;
          height: 200%;
          border-right: 1px solid #e8ebee;
          color: #d5d5d6;
          transform-origin: 0 0;
          transform: scaleY(0.5);
        }
        &:nth-last-child(1)::after {
          border-right: 0;
        }
        &.disabled{
          background: #f5f7f8;
        }
      }
    }
    .key-confirm {
      position: absolute;
      text-align: center;
      height: 118px;
      width: 25%;
      line-height: 118px;
      background: #fff;
      z-index: 5;
      right: 0;
      bottom: 0;
      font-weight: 600;
      color: #2ec2a9;
    }
  }
}
.model{
  height: calc(100% - 330px);
  background-color: rgba(0, 0, 0, .3)
}
</style>
