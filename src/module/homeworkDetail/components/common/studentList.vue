<template>
  <div class="student-list">
    <div class="table">
      <!-- <div class="table-name">学生成绩</div> -->
      <div class="table-header">
        <van-row>
          <van-col span="5"><p class="lf">姓名</p></van-col>
          <van-col span="5"><p>完成进度</p></van-col>
          <van-col span="5"><p>正确率</p></van-col>
          <van-col span="5"><p>错题攻克</p></van-col>
          <!-- <van-col span="4"><p>用时</p></van-col> -->
        </van-row>
      </div>
      <div class="table-body">
        <div @click="studentHomework(stu)"  v-for="(stu, index) in studentList" :key='index'>
          <van-row class="stu">
            <van-col span="5" class="lf"><p>{{stu.real_name}}</p></van-col>
            <van-col span="5">{{stu.completed_num}}</van-col>
            <van-col span="5">{{stu.rate | percent}}</van-col>
            <van-col span="5">{{stu.correct_num}}</van-col>
            <van-col span="4">
              <i class="icon"></i>
            </van-col>
          </van-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default{
  name: 'studentList',
  props: ['studentList', 'publishId'],
  data() {
    return {

    }
  },
  methods: {
    // 资源正确率计算方法
    studentHomework(stuInfo) {
      if (stuInfo.completed_num.split('/')[0] <= 0) {
        return false
      }
      this.$router.push({path: `/studentHomework/${stuInfo.userid}/${this.publishId}/${stuInfo.real_name}`})
    }
  }
}
</script>
<style scoped>
  .table {
  padding:0 13px;
  line-height: 48px;
  font-size: 14px;
  height: 100%;
  text-align: center;
}
.table .lf{
  text-align: left;
}
 .table-header{
   color: #7f8184;
 }
 .table-header,
 .table-body .stu {
  height: 48px;
  border-bottom: 1px solid #eaeaea;
}

 /* .table-body {
  height: calc(100% - 60px);
  overflow-y: scroll;
} */
 .table-body p{
   overflow: hidden;
   text-overflow: ellipsis;
   white-space: nowrap;
 }
 .table-body .icon{
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: inline-block;
    width:19px;
    height: 19px;
    background-image: url('../../../../assets/images/public/right.png');
    position: relative;
    top:5px;
 }
</style>
