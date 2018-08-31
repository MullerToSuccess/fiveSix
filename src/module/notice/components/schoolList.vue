<template>
<div class="schoolList page" id="schoolList">
  <div class="title">
   <header-bar @back="goBack">
        <div slot="title-name">
          <div>学校通知</div>
        </div>
    </header-bar>
  </div>
  <div class="container">
      <div class="wrapper">
      <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh">
        <van-list v-model="loading" :finished="finished" @load="onLoad" :immediate-check="false">
          <div v-if="list.length===0" class="no-data">
            <img :src="imgUrl('nodata')" alt="">
            <p>暂时还没有通知哦～</p>
          </div>
          <school-notice-list :list="list" v-else></school-notice-list>
        </van-list>
      </van-pull-refresh>
      </div>
    </div>
</div>
</template>

<script>
import notice from '../axios/notice.js'
import headerBar from '@/components/headerBar.vue'
import schoolNoticeList from './common/schoolNotice.vue'
export default {
  name: 'schoolList',
  data () {
    return {
      loading: false,
      refreshLoading: false,
      finished: false,
      params: {
        type: 1, //  学校消息列表
        page: 1, // 页码
        per_page: 10, // 每页显示条数
        user_id: JSON.parse(localStorage.userinfo).userid
      },
      list: [],
      totalPage: 0
    }
  },
  created () {
    this.$store.commit('notice/setSchoolMsg', 'clear')
    this.onRefresh()
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
    imgUrl (name) {
      return require('@/assets/images/notice/' + name + '.png')
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
    schoolNoticeList
  }
}
</script>

<style scoped>
.schoolList{
  height: 100%;
  overflow: hidden;
}
#schoolList.schoolList .container{
  height: calc(100% - 45px);
}
.schoolList .container>.wrapper {
  overflow: scroll;
  height: 100%;
  box-sizing: border-box;
  padding-bottom: 13px;
  background: #f5f7f8;
}
.schoolList .container .no-data{
  text-align: center;
  margin-top:25vh;
  min-height:calc(100vh - 100px);
  box-sizing: border-box;
}
.schoolList .container .no-data img{
  width:100px;
}
</style>
