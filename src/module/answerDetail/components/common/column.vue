<template>
<div class="column">
  <van-row v-for="(item,key) in record" :key="key">
    <van-col span="6">
      <p>{{key}}</p>
    </van-col>
    <van-col span="18" class="col-right">
      <span class="box" :style="{width:correct(item.counter)}" :class="{wrong:key==='0%-59%'}" @click="item.counter>0?toggleAllCorrec('正确率为'+key+'的学生',item.user):''">
      </span>
      <span class="info">
        {{item.counter?item.counter:0}}人
      </span>
    </van-col>
  </van-row>
  <student-list :title="popupTitle" :list="popupList" @toggleAllCorrec="toggleAllCorrec" v-if="showAllCorrec" class="studentlist"></student-list>
</div>
</template>

<script>
import studentList from './studentList.vue'

export default {
  name: 'column',
  props: ['record', 'total'],
  data() {
    return {
      popupTitle: '',
      popupList: [],
      showAllCorrec: false
    }
  },
  methods: {
    correct(num) {
      let cor = num || 0;
      let sum = 0;
      for (let key in this.record) {
        if (this.record[key].counter) {
          sum += this.record[key].counter
        }
      }
      return (cor / sum * 100) + '%'
    },
    toggleAllCorrec(title, list) {
      this.showAllCorrec = !this.showAllCorrec
      this.popupTitle = title
      this.popupList = list
    }
  },
  components: {
    studentList
  }
}
</script>
<style scoped>
.column{
  line-height: 45px;
}
.col-right{
  text-align: left;
  display: flex;
}
.van-row{
  height: 50px;
  box-sizing: border-box;
}
.box{
    display: inline-block;
    min-width:2px;
    height: 30px;
    background: #34c988;
    margin-top:7px;
    margin-right: 5px;
    max-width:90%;
  }
.box.wrong{
  background: #f56956;
}
</style>
