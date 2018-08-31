<template>
  <div class="school-list">
    <div v-for="(item, index) in list" :key="index" class="item" @click="goDetail(item.message_id,item.is_read)">
      <div class="date">{{item.push_time}}</div>
      <div class="container">
        <p class="title" :title="item.title">
            <i class="icon"></i>
          {{item.title}}
        </p>
        <div style="text-align:center" v-if="item.thumb">
          <img :src="item.thumb" alt="">
        </div>
        <div class="notice-content" v-html="item.content"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'schoolNoticeList',
  props: ['list'],
  methods: {
    goDetail (id, isRead) {
      this.$router.push({
        name: 'noticeDetail',
        params: {
          message_id: id
        }
      })
      if (parseInt(isRead) === 0) {
        this.$store.commit('notice/setSchoolMsg')
      }
    }
  }
};
</script>
<style scoped>
.school-list{
  min-height:calc(100vh - 100px)
}
.item .date {
  color:#9c9ea1;
  margin: 19px auto 10px;
  text-align: center;
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  vertical-align: 0;
}
.item .notice-content{
  color:  #9c9ea1;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp:2;
}
.item .notice-content >>> p:last-child {
  color: #9c9ea1;
}
.item .notice-content >>> .msg-count-grey,
.item .notice-content >>> .msg-count {
  font-size: 19px;
  color: #7f8184;
  margin: 0 5px;
  font-weight: bold;
}
.item .notice-content >>> .msg-count {
  color: #ff8d13;
}
</style>
