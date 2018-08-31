<template>
<div class="questiontable">
  <div
    class="order-question"
  >
    <div class="item">
      <van-row>
        <van-col span="12">题目</van-col>
        <van-col span="12">正确率</van-col>
      </van-row>
    </div>
    <div
      v-for="(item, index) in resource"
      :key="index"
      class="item"
      @click="linkTo(item, index)"
    >
      <van-row>
        <van-col span="12">{{item.content||item.name||item[0]}}</van-col>
        <van-col span="12">
          <p>
            <span>{{itemCorrect(item.correct_rate||(item[1]>0?item[1]:-2))}}</span>
            <span
              class="progress"
              v-if="item.correct_rate!=''||item.correct_rate!=-1"
            >
              <span class="progress-bar" :style="{width:itemCorrect(item[1])}"></span>
              </span>
              <!-- <van-icon name="arrow"> </van-icon> -->
          </p>
        </van-col>
      </van-row>
</div>
</div>
</div>
</template>

<script>
export default {
  name: 'questionTable',
  props: ['resource'],
  data() {
    return {
    }
  },
  methods: {
    itemCorrect(correct) {
      if (!correct) {
        return false
      }
      if (correct === '' || correct === -1) {
        return '--'
      } else if (correct === -2) {
        return '0%'
      } else {
        return Math.round(correct * 100) + '%'
      }
    },
    linkTo(item, index) {
      this.$emit('go2IcomDetail', item, index)
    }
  }
}
</script>
<style scoped>
 .order-question {
    width: 100%;
    height: calc(100% - 50px);
    overflow-y: auto;
  }

 .order-question .item {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #efefef;
    position: relative;
  }

 .order-question .item p {
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 34px;
  }

.order-question .item p i {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
  }

  .order-question .item p span.progress {
    width: 40%;
    height: 10px;
    background: #efefef;
    margin: auto;
    position: relative;
    border-radius: 10px;
  }

 .order-question .item p span.progress-bar {
    height: 10px;
    display: inline-block;
    background: #2ec2a9;
    position: absolute;
    left: 0;
    border-radius: 10px;
  }
</style>
