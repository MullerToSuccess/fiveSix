<template>
<div class="homeworkList page">
  <div class="title">
    <header-bar @back="goBack">
        <div slot="title-name">
          <div>作业通知</div>
        </div>
        <div slot="right-area">
          <i @click="togglePopup" :class="{disable:this.list.length<=0}" class=" clear"></i>
        </div>
      </header-bar>
  </div>
    <div class="container">
      <div class="wrapper">
      <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh" class="box">
        <van-list v-model="loading" :finished="finished" @load="onLoad" :immediate-check="false">
          <div v-if="list.length===0" class="no-data">
            <img src="../../../assets/images/notice/nodata.png" alt="">
            <p>暂时还没有通知哦～</p>
          </div>
          <homework-notice-list :list="list" v-else></homework-notice-list>
        </van-list>
      </van-pull-refresh>
      </div>
    </div>
    <van-popup type="delete-popup" v-model="showDetelePopup" class="popup">
      <div class="delete-wrapper">
        <p>是否清空所有消息？</p>
        <div class="btn-group">
          <span @click="togglePopup">取消</span>
          <span @click="clear">确认</span>
        </div>
      </div>
    </van-popup>
</div>
</template>

<script>
import notice from '../axios/notice.js'
import headerBar from '@/components/headerBar.vue'
import homeworkNoticeList from './common/teacherNotice.vue'
export default {
  name: 'homeworkList',
  data () {
    return {
      loading: false,
      refreshLoading: false,
      finished: false,
      showDetelePopup: false,
      params: {
        type: 2, //  作业列表
        page: 1, // 页码
        per_page: 10, // 每页显示条数
        user_id: JSON.parse(localStorage.userinfo).userid
      },
      list: [],
      totalPage: 0
    }
  },
  created () {
    this.$store.commit('notice/setHomeworkMsg', 'clear')
    this.onRefresh();
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    goDetail () {
      this.$router.push({
        name: 'noticeDetail'
      })
    },
    togglePopup () {
      if (!this.list.length) {
        return
      }
      this.showDetelePopup = !this.showDetelePopup
    },
    clear () {
      if (this.list.length <= 0) {
        return false
      }
      let params = {
        user_id: this.params.user_id
      }
      notice.clearMsg(params).then(r => {
        if (r.rs) {
          this.list.splice(0);
        }
        this.showDetelePopup = false
      })
    },
    getNoticelist () {
      notice.getList(this.params).then((r) => {
        this.totalPage = r.totalPage
        if (this.params.page === 1) {
          this.list = r.list
        } else {
          for (let i = 0; i < r.list.length; i++) {
            this.list.push(r.list[i])
          }
        }
        this.loading = false
      })
    },
    onRefresh () {
      this.params.page = 1
      this.finished = false
      this.getNoticelist()
      setTimeout(() => {
        this.refreshLoading = false
      }, 500)
    },
    onLoad () {
      if (this.params.page >= this.totalPage) {
        this.loading = false
        this.finished = true
      } else {
        this.params.page++
        this.getNoticelist()
      }
    }
  },
  components: {
    headerBar,
    homeworkNoticeList
  }
}
</script>

<style scoped>
.homeworkList{
  height: 100%;
}
.homeworkList .title .clear{
  display: inline-block;
  width:20px;
  height: 20px;
  background-position: center center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  vertical-align: middle;
  background-image: url('../../../assets/images/notice/clear.png')
}
.homeworkList>.container{
  height: calc(100% - 45px);
}
.homeworkList .container>.wrapper {
  overflow: scroll;
  height: 100%;
  box-sizing: border-box;
  padding-bottom: 13px;
  background: #f5f7f8;
}
.homeworkList .container .no-data{
  text-align: center;
  padding-top:25vh;
  min-height:calc(100vh - 100px);
  box-sizing: border-box;
}
.homeworkList .container .no-data img{
  width:100px;
}
.delete-wrapper{
  width:calc(100vw - 26px);
  margin:0 13px;
  background: #fff;
  padding:20px;
  border-radius: 13px;
  box-sizing: border-box;
}
.delete-wrapper>p{
  line-height: 50px;
  text-align: center;
  margin-bottom: 20px;
}
.delete-wrapper>.btn-group{
  display: flex;
}
.delete-wrapper>.btn-group span{
  flex:1 auto auto;
  width:150px;
  height: 50px;
  line-height: 50px;
  border-radius: 13px;
  font-size: 17px;
  text-align: center;
  background: #08b783;
  color:#fff;
}
.delete-wrapper>.btn-group span:first-child{
  margin-right: 15px;
  background: #fff;
  border:1px solid #08b783;
  color:#08b783;
}
.popup{
  background: transparent;
}
</style>
