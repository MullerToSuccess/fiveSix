<template>
  <div class="questiontable">
    <div class="order-question">
      <div class="item">
        <van-row>
          <van-col span="12">题目</van-col>
          <van-col span="12">正确率</van-col>
        </van-row>
      </div>
      <div v-for="(item,index) in resource" :key="index" class="item" @click="detail(item)">
        <van-row>
          <van-col span="12" v-html="itemContent(item)"></van-col>
          <van-col span="12">
            <p>
              <span>{{itemCorrect(item.correct_rate)}}</span>
              <span class="progress" v-if="item.correct_rate!=''||item.correct_rate!=-1">
                  <span
                    class="progress-bar"
                    :style="{width:itemCorrect(item.correct_rate)}"
                  ></span>
              </span>
            </p>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'groupWord',
  props: ['resource', 'user'],
  data() {
    return {

    }
  },
  mounted() {
    console.log(this.goDetail)
  },
  methods: {
    itemCorrect(correct) {
      if (correct === '' || correct === -1) {
        return '--'
      } else {
        return Math.round(correct * 100) + '%'
      }
    },
    itemContent(item) {
      let html = "";
      html = item.question.replace('_', '<span class="right-word" style="border-bottom:1px solid red">' + item.right_answer + '</span>') + ' [' + item.distracts + ']'
      return html
    },
    detail(item) {
      let title = this.itemContent(item)
      this.$router.push({name: 'groupDetail', params: {'data': this.user, 'name': title, 'correct_rate': item.correct_rate}});
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
    height: 5px;
    background: #efefef;
    margin: auto;
    position: relative;
    border-radius: 10px;
  }

  .order-question .item p span.progress-bar {
    height: 5px;
    display: inline-block;
    background: #f56956;
    position: absolute;
    left: 0;
    border-radius: 10px;
  }
</style>
