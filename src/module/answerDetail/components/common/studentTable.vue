<template>
  <div class="student-table">
    <div class="order-student">
      <div class="type">
        <van-row>
          <van-col span="8" offset="16">
            <span @click="toggleOrdertype('list')" :class='{active:ordertype==="list"}'>
                        <van-icon name="wap-nav" ></van-icon>
                      </span>
            <span @click="toggleOrdertype('column')" :class='{active:ordertype==="column"}'>
                        <van-icon name="exchange" ></van-icon>
                      </span>
          </van-col>
        </van-row>
      </div>
      <div v-if="ordertype=='list'">
        <div class="head">
          <van-row>
            <van-col span="8">
              <p @click=sortBy(0) class="order" :class="{'up':sortNum==0,'down':sortNum==1}">姓名
                <span>
                        <i class="up"></i>
                        <i class="down"></i>
                        </span>
              </p>
            </van-col>
            <van-col span="8">
              <p @click=sortBy(2) class="order" :class="{'up':sortNum==2,'down':sortNum==3}">正确率
                <span>
                        <i class="up"></i>
                        <i class="down"></i>
                        </span>
              </p>
            </van-col>
            <van-col span="8">
              <p @click=sortBy(4) class="order" :class="{'up':sortNum==4,'down':sortNum==5}">用时
                <span>
                        <i class="up"></i>
                        <i class="down"></i>
                        </span>
              </p>
            </van-col>
          </van-row>
        </div>
        <div class="container">
          <div class="content" v-for="(k,index) in user" :key="index">
            <van-row>
              <van-col span="8">
                <p class="name">{{k.real_name}}</p>
              </van-col>
              <van-col span="8">
                <p v-if="k.status>=3" class="correct">
                  <span>
                        {{Math.round(k.correct_rate*100)+'%'}}</span>
                  <span class="collumn">
                        <span class="progress-bar" :style="{width:Math.round(k.correct_rate*100)+'%'}" :class="{right:k.correct_rate===1}"></span>
                  </span>
                </p>
                <p v-else>--</p>
              </van-col>
              <van-col span="8">
                <p>{{k.time_length>0?Math.round(k.time_length)+'秒':''}}</p>
              </van-col>
            </van-row>
          </div>
        </div>
      </div>
      <column v-if="ordertype=='column'" :record="columnData" :total="user.length"></column>
    </div>
  </div>
</template>

<script>
import column from './column.vue'

export default {
  name: 'studentTable',
  props: ['user', 'columnData'],
  data() {
    return {
      sortNum: -1,
      ordertype: 'list'
    }
  },
  mounted() {
    this.sortBy(0);
  },
  methods: {
    compare(property) {
      return (a, b) => {
        let value1 = a[property];
        let value2 = b[property];
        // 单数降序 双数增序
        if (this.sortNum % 2 === 0) {
          if (typeof value1 === "string") {
            return value1.localeCompare(value2, "zh");
          }
          return value1 - value2;
        } else {
          if (typeof value1 === "string") {
            return value2.localeCompare(value1, "zh");
          }
          return value2 - value1;
        }
      }
    },
    sortBy(key) {
      if (this.sortNum === key) {
        this.sortNum++;
      } else {
        this.sortNum = key
      }
      if (this.sortNum === 0 || this.sortNum === 1) {
        this.user.sort(this.compare('real_name'))
      } else if (this.sortNum === 2 || this.sortNum === 3) {
        this.user.sort(this.compare('correct_rate'))
      } else if (this.sortNum === 4 || this.sortNum === 5) {
        this.user.sort(this.compare('time_length'))
      }
    },
    toggleOrdertype(type) {
      this.ordertype = type
    }
  },
  components: {
    column
  }
}
</script>

<style scoped>
.student-table{
  height: calc(100% - 50px);
}
 .order-student{
   height: 100%;
 }
.order-student .type {
  background: #efefef;
}
.order-student>div:nth-child(2){
  height: calc(100% - 50px);
}
.order-student .type span.active{
  color:#06bb9c;
}
  .order-student .head {
    border-bottom: 1px solid #eaeaea;
    background: #fff;
  }

  .order-student .head .order {
    display: flex;
    justify-content: center;
  }

  .order-student .head .order span {
    display: flex;
    flex-direction: column;
    width: 10px;
    margin-top: calc((50px - 12px)/2);
    margin-left: 5px;
  }

  .order-student .head .order i {
    display: inline-block;
  }

  .order-student .head .order i.up {
    border-style: solid;
    border-width: 0 5px 5px;
    border-color: transparent transparent #cccdcd;
    margin-bottom: 5px;
  }

  .order-student .head .order.up i.up {
    border-color: transparent transparent #34c988;
  }

  .order-student .head .order i.down {
    border-style: solid;
    border-width: 5px 5px 0px;
    border-color: #cccdcd transparent transparent;
  }

  .order-student .head .order.down i.down {
    border-color: #34c988 transparent transparent;
  }

  .order-student .container {
    height: calc(100% - 40px);
    overflow: scroll;
    background: #fff;
  }

  .order-student>.container .content {
    border-bottom: 1px solid #eaeaea;
  }

  .order-student>.container .content .correct {
    display: flex;
    flex-direction: column;
    line-height: 30px;
  }

  .order-student>.container .content .correct .collumn,
  .order-student>.container .content .correct .collumn .progress-bar {
    display: inline-block;
    width: 80%;
    height: 5px;
    margin-left: 10%;
    background: #efefef;
    border-radius: 10px;
    position: relative;
  }

  .order-student>.container .content .correct .collumn .progress-bar {
    background: #f56956;
    position: absolute;
    margin-left: 0;
    left: 0;
  }

  .order-student>.container .content .correct .collumn .progress-bar.right {
    background: #34c988
  }
</style>
