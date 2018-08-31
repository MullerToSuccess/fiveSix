<template>
  <div class="notice page">
    <div class="title">
      <header-bar @back="goBack">
        <div slot="title-name">
          <div>通知中心</div>
        </div>
      </header-bar>
    </div>
    <div class="wrapper">
      <div class="items">
        <p @click="goTo('/notice/homeworkList')">
        <i class="icon homework"></i>
          <span>
            作业消息
            <b class="redIcon" v-show="newHomeworkMsg"></b>
          </span>
          <van-icon name="arrow" class="icon-right"></van-icon>
        </p>
      </div>
      <div class="items">
        <p  @click="goTo('/notice/schoolList')">
        <i class="icon school"></i>
          <span>
            学校消息
            <b class="redIcon" v-show="newSchoolMsg"></b>
          </span>
          <van-icon name="arrow" class="icon-right"></van-icon>
        </p>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import headerBar from '@/components/headerBar.vue'
import { mapState } from 'vuex'
export default {
  name: 'noticeList',
  data () {
    return {
    }
  },
  created () {},
  computed: {
    ...mapState({
      'newSchoolMsg': state => state.notice.newSchoolMsg,
      'newHomeworkMsg': state => state.notice.newHomeworkMsg
    })
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    goTo(path) {
      this.$router.push({
        path: path
      })
    }
  },
  components: {
    headerBar
  }
}
</script>
<style scoped>
.notice{
  height: 100vh;
}
.wrapper{
  padding:13px 13px 0;
  background: #f5f7f8;
  height: calc(100% - 45px);
}
.notice .items{
  height: 50px;
  line-height: 50px;
  background: #fff;
  border-radius: 8px;
  padding:2px 13px 0;
  display: flex;
  box-sizing: border-box;
}
.notice .items p{
  width:100%;
  position: relative;
  color:#7e8c8d;
}
.notice .items:first-child{
  margin-bottom: 13px;
  /* color:#1e1e1e; */
}
.notice .items .icon{
  vertical-align: middle;
  display: inline-block;
  width: 44px;
  height: 49px;
  background-size: 100% 100%;
  background-position: center center;
  background-repeat: no-repeat;
}
.notice .items .icon.homework{
  background-image: url('../../../assets/images/notice/homework.png')
}
.notice .items .icon.school{
  background-image: url('../../../assets/images/notice/school.png')
}
.notice .items b.redIcon{
  display: inline-block;
  width:6px;
  height: 6px;
  background-size: 100% 100%;
  background-position: center center;
  background-repeat: no-repeat;
  vertical-align: text-top;
  background-image: url('../../../assets/images/public/red-icon.png')
}
.notice .items .icon-right{
  position: absolute;
  right: 0;
  top:50%;
  transform: translateY(-50%);
}
</style>
