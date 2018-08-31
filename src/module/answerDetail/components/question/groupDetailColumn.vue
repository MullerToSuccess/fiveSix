<template>
  <div class="groupColumn">
    <div class="title border-bottom-1px">
      <van-row>
        <van-col span="2">
          <span class="back" @click="goBack">
              <van-icon name='arrow-left'></van-icon>
              </span>
        </van-col>
        <van-col span="20">
          <span class="text">组件详情（{{(index+1)+'/'+record.length}}）</span>
        </van-col>
        <van-col span="2"></van-col>
      </van-row>
    </div>
    <div class="title-bar">
      <van-row>
        <van-col span="6">
          <span>{{currItem.content}}</span>
        </van-col>
        <van-col span="18" class="info-right">
          正确率：<span class="correct">{{correct}}</span>
        </van-col>
      </van-row>
    </div>
    <div class="wrapper">
      <div>
        <van-row class="item">
          <van-col span="4" class="tc">答对</van-col>
          <van-col span="20" class="right">
            <span class="column right-answer"  :style="{width:(currItem.right.length/count)*100+'%'}" @click='currItem.right.length>0?toggleAllCorrec("答对的学生",currItem.right):""'></span>
            <span class="column-info">{{currItem.right.length}}人</span>
          </van-col>
        </van-row>
      </div>
      <div>
        <van-row class="item">
          <van-col span="4" class="tc">答错</van-col>
          <van-col span="20" class="right">
            <span class="column"  :style="{width:(currItem.wrong.length/count)*100+'%'}"  @click='currItem.wrong.length>0?toggleAllCorrec("答错的学生",currItem.wrong):""'></span>
            <span class="column-info">{{currItem.wrong.length}}人</span>
          </van-col>
        </van-row>
      </div>
      <div>
        <van-row class="item">
          <van-col span="4" class="tc">未答</van-col>
          <van-col span="20" class="right">
            <span class="column no-answer"  :style="{width:(currItem.none.length/count)*100+'%'}" @click='currItem.none.length>0?toggleAllCorrec("未答的学生",currItem.none):""'></span>
            <span class="column-info">{{currItem.none.length}}人</span>
          </van-col>
        </van-row>
      </div>
    </div>
    <div class="btn-group">
      <van-row>
        <van-col span="12"><p :class="{disable:index==0}" @click="index==0?'':change(index-1)">上一题</p></van-col>
        <van-col span="12"><p :class="{disable:index==record.length-1}" @click="index==record.length-1?'':change(index+1)">下一题</p></van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'groupColumn',
  data() {
    return {
      'record': this.$route.params.record,
      'curr': this.$route.params.curr,
      'index': this.$route.params.index,
      'currItem': this.$route.params.curr.child[0],
      'correctRate': this.$route.params.curr.child[0].correct_rate,
      showAllCorrec: false,
      popupTitle: '',
      popupList: []
    }
  },
  created() {
  },
  watch: {
  },
  activated() {
  },
  computed: {
    correct() {
      if (this.correctRate === '') {
        return '--'
      } else {
        return Math.round(this.correctRate * 100) + '%'
      }
    },
    count() {
      // return 0
      return this.currItem.right.length + this.currItem.wrong.length + this.currItem.none.length
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    toggleAllCorrec(title, list) {
      let routeName = this.$route.name
      window.bus.$emit('showStudentList', title, list, {from: routeName === 'Tongji' ? 'tongji' : 'pigai'})
    },
    change(num) {
      console.log(num)
      if (num === -1) {
        this.index = 0
      } else if (num === this.record.length) {
        this.index = this.record.length
      } else {
        this.index = num
      }
      this.curr = this.record[this.index];
      this.currItem = this.record[this.index].child[0]
      this.correctRate = this.record[this.index].child[0].correct_rate
    }
  },
  components: {
  }
}
</script>

<style scoped>
  .groupColumn {
    height: auto;
  }

  .groupColumn>.title {
    text-align: center;
    line-height: 50px;
    height: 50px;
  }

  .groupColumn>.title .back {
    display: inline-block;
    float: left;
  }

  .groupColumn>.title .text {
    display: inline-block;
    width: calc(100% - 100px);
    font-weight: 600;
  }

  .groupColumn>.title-bar {
    padding: 0 10px;
    line-height: 50px;
    height: 50px;
    box-sizing: border-box;
  }

  .groupColumn>.title-bar .info-right {
    text-align: right;
  }

  .groupColumn>.title-bar .info-right .correct {
    color: #ff4e00;
  }
   .groupColumn .wrapper{
     line-height: 30px;
   }
  .groupColumn .wrapper .tc{
    text-align: center;
  }
   .groupColumn .wrapper .item{
     height: 40px;
   }
   .groupColumn .wrapper .right{
     display: flex;
   }
  .groupColumn .wrapper .column{
    display: inline-block;
    max-width: 80%;
    min-width: 5px;
    height: 30px;
    background: #f56956;
  }
  .groupColumn .wrapper .column.right-answer{
    background: #34c988;
  }
  .groupColumn .wrapper .column.no-answer{
    background:#cccdcd;
  }
  .groupColumn .wrapper .column-info{
    vertical-align: middle;
    margin-left: 5px;
  }
  .btn-group{
    position: fixed;
    bottom:0;
    width:100vw;
    height: 50px;
    line-height: 50px;
    border-top:1px solid #eaeaea;
    text-align: center;
    color:#34c988;
  }
  .btn-group p.disable{
    color:#e2e4e3;
  }
</style>
