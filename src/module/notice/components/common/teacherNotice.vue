<template>
  <div class="teacher-list">
    <div v-for="(item, index) in list" :key="index" class="item" @click="goHomeworkDetail(item,index)">
      <div class="date">{{item.push_time}}</div>
      <div class="container">
        <p class="title">
            <i class="icon"></i>
          {{item.title}}</p>
        <div class="notice-content" v-html="item.content"></div>
      </div>
    </div>
  </div>
</template>
<script>
// import notice from '../../axios/notice.js'
import {Toast} from 'vant'
export default {
  name: "teacherList",
  props: ["list"],
  methods: {
    goHomeworkDetail(item, index) {
      // let params = {
      //   user_id: JSON.parse(localStorage.userinfo).userid,
      //   message_id: item.message_id
      // }
      // notice.getItemInfo(params).then(r => {
      //   this.content = r.content
      //   if (parseInt(item.is_read) === 0) {
      //     this.$store.commit('notice/setHomeworkMsg')
      //   }
      if (Number(item.zuoye_delete) === 1) {
        Toast('该作业已被删除！')
        return false
      }
      this.$router.push({
        name: 'homeworkDetail',
        params: {
          publishId: item.params.publish_id,
          classId: item.params.class_id
        }
      })
      // }
      // )
    }

  }
};
</script>
<style scoped>
.teacher-list{
   min-height:calc(100vh - 100px);
   padding-bottom: 45px;
}
.item .date {
  margin: 19px auto 10px;
  text-align: center;
  color:#9c9ea1;
}
.item .container {
  margin: 0 13px;
  background: #fff;
  padding: 15px;
  border-radius: 8px;
  line-height: 20px;
  color: #1e1e1e;
}
.item .container .title {
  margin-bottom: 19px;
  font-size: 19px;
  text-align: left;
  line-height: 25px;
}
.item .container .title .icon {
  display: inline-block;
  height: 20px;
  width: 20px;
  background-position: center center;
  background-size: 100% 100%;
  margin-bottom: -3px;
  margin-right: 5px;
  background-image: url('../../../../assets/images/notice/icon.png');
}
.item .notice-content{
  color: #9c9ea1;
}
.item .notice-content >>> p {
  color: #4e4e50;
  margin-bottom: 10px;
}
.item .notice-content >>> p:last-child {
  color: #9c9ea1;
}
.item .notice-content >>> .msg-count-grey,
.item .notice-content >>> .msg-count {
  font-size: 19px;
  color: #7f8184;
  margin: 0 5px;
}
.item .notice-content >>> .msg-count {
  color: #ff8d13;
}
</style>
