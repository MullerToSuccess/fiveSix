<template>
  <!-- 按题目统计 -->
  <div id="according-question">
    <div class="list">
      <div class="list-title">
        <div class="list-row">
          <div class="list-cell left">序号</div>
          <div class="list-cell question-content left">作业内容</div>
          <div class="list-cell average">正确率</div>
        </div>
      </div>
      <div class="list-body">
        <div class="list-row van-hairline--bottom" v-for="(qus, index) in homeworkInfo" :key="index" @click="$emit('linkToAnswer', homeworkInfo, index, 'qti')">
          <div class="list-cell left">{{index + 1}}</div>
          <div class="list-cell left question-content ellipsis">
            <span class="type">[{{qus.icom_name | questionName(qus)}}]</span>
            <span v-html="qus.resource_name || qus.section_title"></span>
          </div>
          <div class="list-cell average">{{qus.average_rate || qus.correct_rate | percent}}</div>
          <div class="arrow">
            <i class="fa fa-angle-right"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AccordingQuestion',
  props: ['homeworkInfo', 'type', 'appName']
}
</script>
<style lang="scss" scoped>
.list{
  padding: 0 13px;
  font-size: 16px;
  .list-title{
    color: #848484
  }
  .list-body{
    color: #1e1e1e;
  }
  .list-row{
    display: flex;
    height: 45px;
    line-height: 45px;
  }
  .list-cell{
    flex: 1;
    text-align: center;
    &.question-content{
      flex: 6;
      padding: 0 5px;
    }
    &.average{
      flex: 2;
    }
    &.left{
      text-align: left;
    }
  }
  .row{
    width: 100%;
    font-size: 0;
    .kwg{
      display: inline-block;
      width: 40%;
      font-size: 16px;
      height: 40px;
      line-height: 40px;
      vertical-align: middle;
    }
    .len{
      display: inline-block;
      width: 40%;
      font-size: 16px;
      height: 40px;
      line-height: 40px;
      vertical-align: middle;
    }
    .correct{
      display: inline-block;
      width: 15%;
      font-size: 16px;
      height: 40px;
      line-height: 40px;
      vertical-align: middle;
    }
    .children{
      font-size: 0;
      .cell{
        display: inline-block;
        font-size: 16px;
        height: 40px;
        line-height: 40px;
        vertical-align: middle;
        &.placeholder{
          width: 40%;
        }
        &.content{
          width: 40%;
        }
        &.correct{
          width: 15%;
        }
        &.arrow{
          width: 5%
        }
      }
    }
  }
}
.type{
  color: #4d4d4d
}
</style>
