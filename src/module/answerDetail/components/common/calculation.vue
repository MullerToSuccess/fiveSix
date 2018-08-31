<template>
<div class="calculation">
  <div class="order-question">
    <div class="item">
      <van-row>
        <van-col span="8">知识点</van-col>
        <van-col span="8">数量</van-col>
        <van-col span="8">正确率</van-col>
      </van-row>
    </div>
    <div class="container">
      <div
        v-for="(item,index) in resource"
        :key="index"
      >
        <div class="item">
          <div>
            <van-row>
              <van-col span="8">{{item.name}}</van-col>
              <van-col span="8">{{item.count}}</van-col>
              <van-col span="8">
                <p>
                  <span>{{itemCorrect(item.correct_rate)}}</span>
                  <span
                    class="progress"
                    v-if="item.correct_rate!=''||item.correct_rate!=-1"
                  >
                    <span
                      class="progress-bar"
                      :style="{width:itemCorrect(item.correct_rate)}"
                      :class="{right:item.correct_rate>=0.5}"
                    ></span>
                      </span>
                      <!-- <van-icon name="arrow"> </van-icon> -->
                </p>
              </van-col>
            </van-row>
          </div>
        </div>
        <div
          v-if="item.child"
          class="item"
          @click="detail(index)"
        >
          <van-row
            v-if="item.child.length"
            v-for="(kp,i) in item.child"
            :key="i"
          >
            <van-col
              span="8"
              offset="8"
            >{{kp.content}}</van-col>
              <van-col span="8">
                <p>
                  <span>{{itemCorrect(kp.correct_rate)}}</span>
                  <span
                    class="progress"
                    v-if="kp.correct_rate!=''||kp.correct_rate!=-1"
                  >
                    <span
                      class="progress-bar"
                      :style="{width:itemCorrect(kp.correct_rate)}"
                      :class="{right:item.correct_rate>=0.5}"
                    ></span>
                      </span>
                      <van-icon name="arrow"> </van-icon>
                </p>
              </van-col>
              </van-row>
    </div>
  </div>
</div>
</div>
</div>
</template>

<script>
export default {
  name: 'calculation',
  props: ['resource'],
  data() {
    return {

    }
  },
  mounted() {},
  methods: {
    itemCorrect(correct) {
      if (correct === '' || correct === -1) {
        return '--'
      } else {
        return Math.round(correct * 100) + '%'
      }
    },
    detail(index) {
      // this.$store.commit('groupDetail/setgroupDetail', this.resource)
      // this.$store.commit('groupDetail/setcurr', this.resource[index])
      // this.$store.commit('groupDetail/setindex', index)
      this.$router.push({
        name: "groupDetailColumn",
        params: {
          'record': this.resource,
          'curr': this.resource[index],
          'index': index,
          'currItem': this.resource[index].child[0],
          'correctRate': this.resource[index].child[0].correct_rate
        }
      })
    }
  }
}
</script>

<style scoped>
.calculation {
  height: calc(100% - 50px);
}

.order-question {
  width: 100%;
  height: 100%;
}

.order-question .container {
  height: calc(100% - 50px);
  overflow: scroll;
}

.order-question .item {
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #efefef;
  position: relative;
  box-sizing: border-box;
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

.order-question .item p span.progress-bar.right {
  background: #34c988;
}
</style>
