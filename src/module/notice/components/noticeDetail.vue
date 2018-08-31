<template>
<div class="noticeDetail page">
  <header-bar @back="goBack">
        <div slot="title-name">
          <div>通知详情</div>
        </div>
  </header-bar>
  <div class="container">
    <div class="top">
      <div class="text">
        {{content.title}}
      </div>
      <div class="data">
        {{content.push_time}}
      </div>
    </div>
    <div class="notice-content" v-html="content.content">
    </div>
  </div>
</div>
</template>

<script>
import headerBar from '@/components/headerBar.vue'
import notice from '../axios/notice.js'
export default {
  name: 'noticeDetail',
  data () {
    return {
      content: ''
    }
  },
  created () {
    let params = {
      user_id: JSON.parse(localStorage.userinfo).userid,
      message_id: this.$route.params.message_id
    }
    notice.getItemInfo(params).then(r => {
      this.content = r.content
    }
    )
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  },
  components: {
    headerBar
  }
}
</script>

<style scoped>
.noticeDetail{
  height: calc(100% - 45px);
}
.noticeDetail .container{
  padding:0 13px;
  height: 100%;
}
.noticeDetail .container .top{
  /* height: 75px; */
  padding:12px 0;
  box-sizing: border-box;
  border-bottom: 1px solid #e8ebee;
}
.noticeDetail .container .top .text{
  color:#1e1e1e;
  font-size: 19px;
  line-height: 30px;
  font-weight: bold;
   margin-bottom: 5px;
  /* overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; */
}
.noticeDetail .container .top .data{
  color:#c8c9c9;
  font-size: 14px;
}
.noticeDetail .container .notice-content{
  height: calc(100% - 75px);
  box-sizing: border-box;
  padding-bottom: 10px;
  padding-top:15px;
  overflow: scroll;
}
.noticeDetail .container .notice-content >>> img{
  display: block;
  margin:15px auto;

}
</style>
