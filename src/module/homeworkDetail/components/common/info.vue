<template>
  <div class="info">
      <p class="name">
        <span class="tittle">{{title}}</span>
        <span style="float:right">共<b>{{total}}</b>个</span>
      </p>
      <p class="times">
        <span v-if="$store.state.homework.homeworkState == '0'">
          截止时间：{{endTime}}
          <template v-if="new Date(endTime) < new Date()">(已截止)</template>
        </span>
        <span v-else>上课时间：{{endTime}}</span>
      </p>
    </div>
</template>
<script>
export default {
  name: "info",
  props: {
    title: {
      type: String,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    endTime: {
      type: String,
      required: true
    }
  }
};
</script>
<style scoped lang="scss">
.info {
  padding: 10px;
  line-height: 30px;
  background: #fff;
  height: 75px;
  box-sizing: border-box;
  .name {
    font-weight: bold;
    span{
      color:#c8c9c9;
      font-size: 14px;
      b{
        color:#9c9ea1;
      }
    }
    .tittle {
      color: #1e1e1e;
      width:80%;
      display: inline-block;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      font-size: 16px;
    }
  }
  .times {
    font-size: 14px;
  }
}
</style>
