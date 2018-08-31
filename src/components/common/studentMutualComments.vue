<template>
  <div>
    <div class="studentContentTitle">
      <div style="float: left;">学生评价(<span style="color: #ff4e00">{{listObj.studentsNum ? listObj.studentsNum : 0}}</span>人)</div>
      <div style="float: right;">
        <van-rate v-model="listObj.score" disabled disabled-color="#ffd21e" :size="18" :count="5" void-color="#ceefe8" />
      </div>
      <div style="clear: both;"></div>
    </div>
    <div v-bind:style="listContainerStyle">
      <div class="listContainer" v-for="(item, index) in listObj.lists" :key="index">
        <div style="float: left;width: 20%;">
          <div style="display: inline-block;">
            <img style="border-radius: 50%;box-sizing: border-box;" :src="item.avatar" alt="" width="50" height="50">
          </div>
        </div>
        <div style="float: right;width: 80%;">
          <div style="float: left;">{{item.real_name}}</div>
          <div style="float: right;">
            <van-rate v-model="item.rank" disabled disabled-color="#ffd21e" :size="18" :count="5" void-color="#ceefe8" />
          </div>
          <div class="content">{{item.comment}}</div>
          <div v-for="(imgUrl, index) in item.pics" :key="index" v-if="item.pics">
            <img style="width: 30%;" :src="imgUrl" alt="">
          </div>
        </div>
        <div style="clear: both;"></div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: "studentMutualComments",
  props: ['listObj'],
  data() {
    return {
      peopleNum: 0,
      listContainerStyle: {
        height: window.innerHeight - 190 + "px",
        background: "#fff",
        width: "100%",
        'overflow-y': "scroll"
      }
    };
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.listContainer {
  padding: 2% 10px;
  border-bottom: 1px solid #e1e1e1;
}
.studentContentTitle {
  height: 35px;
  line-height: 35px;
  border-bottom: 1px solid #ccc;
  padding: 0 10px;
}
.content {
  clear: both;
  line-height: 28px;
  word-break:break-all;
  word-wrap:break-word
}
</style>
