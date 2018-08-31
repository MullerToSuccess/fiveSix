<template>
  <div id="homework-content" class="page">
    <header-bar @back="back">
      <div slot="title-name" class="tab">
        <span class="tab-item" :class="{active: tabType === 'detail'}" @click="tabChange('detail')">作业详情</span>
        <span class="tab-item" :class="{active: tabType === 'report'}" @click="tabChange('report')">作业报告</span>
      </div>
      <div slot="right-area" class="more-btn">
        <span @click="toggleMorePopup">...</span>
      </div>
    </header-bar>
    <div v-if="!loading" class="content">
      <report v-if="tabType === 'report'"></report>
      <detail v-if="tabType === 'detail'"
        :homeworkInfo="homeworkInfo"
        :resourceList="resourceList"
        :homeworkStatus="homeworkStatus"
        @getresource="getresource"
        >
        </detail>
    </div>
    <div v-if="loading" class="place-holder">
      <i class="fa fa-spinner fa-spin"></i>
      <span>加载中...</span>
    </div>
    <more v-if="morePopup" @toggle="toggleMorePopup" :info="homeworkInfo" @back="back" :favorite="homeworkInfo.favorite" @collect="collect" :list="resourceList"></more>
  </div>
</template>
<script>
// 单个作业详情，包括作业详情和作业报告
import headerBar from '@/components/headerBar.vue'
import detail from './detail'
import report from './report'
import more from './common/more.vue'
import homeworkDetil from '../axios/detail.js'
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
export default {
  name: 'homeworkDetail',
  data() {
    return {
      homeworkInfo: {}, // 作业信息
      resourceList: [], // 作业列表
      homeworkStatus: 0,
      tabType: 'detail',
      morePopup: false,
      loading: true
    }
  },
  computed: {
    ...mapGetters({
      env: 'runEnv/old'
    }),
    ...mapState({
      routeParams: state => state.homeworkDetail.routeParams
    })
  },
  created() {
    window.bus.$on('getHomeworkInfo', (classId, publishId) => {
      this.getresource(classId, publishId)
    })
  },
  mounted() {
    setTimeout(this.getresource, 300)
    window.bus.$on('modifyScore', () => {
      this.getresource(undefined, undefined, true)
    })
  },
  activated() {
    this.saveHomeworkRouteParams(this.$route.params) // 存储路由参数
  },
  destroyed() {
    window.bus.$off(['modifyScore', 'modifyMini'])
  },
  deactivated() {
    if (this.$route.name === 'homework' || this.$route.name === 'home' || this.$route.name === 'homeworkNoticeList') {
      this.tabType = 'detail'
      this.clearHasShowMiniResourceList()
      setTimeout(() => {
        this.removeAlive('homeworkDetail')
      }, 300)
    }
  },
  methods: {
    ...mapMutations({
      saveHomeworkInfo: 'homeworkDetail/homeworkInfo',
      saveHomeworkQuestionInfo: 'homeworkDetail/homeworkQuestionInfo',
      saveHomeworkRouteParams: 'homeworkDetail/saveRouteParams',
      clearHasShowMiniResourceList: 'homeworkDetail/clearHasShowMiniResourceList'
    }),
    ...mapActions({
      removeAlive: 'alivePages/removeAlive'
    }),
    // 返回
    back() {
      this.$router.back(-1)
    },
    // 顶部tab切换
    tabChange(type) {
      this.tabType = type
    },
    // 弹出或收起更多
    toggleMorePopup() {
      this.morePopup = !this.morePopup
    },
    // 获取作业详情所需资源
    getresource(classId, publishId, refresh) {
      if (!refresh) this.loading = true
      let params = {
        publish_id: publishId || this.routeParams.publishId,
        class_id: classId || this.routeParams.classId
      };
      // 获取作业信息
      homeworkDetil.getinfo(params).then(succ => {
        if (!refresh) this.loading = false
        succ.student_list.forEach(ele => {
          if (ele.avatar.indexOf('http://') === -1) {
            ele.avatar = this.env + ele.avatar
          }
        });
        this.saveHomeworkInfo(succ)
        this.homeworkInfo = succ
      })
      // 获取作业资源
      homeworkDetil.getResourceList(params).then(d => {
        this.resourceList = d.list
        this.homeworkStatus = d.status
        this.saveHomeworkQuestionInfo(d)
      })
    },
    // 收藏
    collect(num) {
      this.homeworkInfo.favorite = num
    }
  },
  components: {
    headerBar,
    detail,
    report,
    more
  }
}
</script>
<style lang="scss" scoped>
#homework-content{
  width: 100%;
  height: 100%;
  overflow: hidden;
  .tab{
    position: relative;
    left: 15px;
    display: inline-flex;
    box-sizing: border-box;
    height: 30px;
    line-height: 30px;
    width: 200px;
    font-size: 16px;
    color: #08b884;
    border: 1px solid #08b884;
    border-radius: 5px;
    overflow: hidden;
    .tab-item{
      flex: 1;
      text-align: center;
      &.active{
        background-color: #08b884;
        color: #fff;
      }
    }
  }
  .more-btn{
    line-height: 36px;
    font-size: 18px;
    font-weight: 800;
    color: #4e4e4e
  }
  .content{
    width: 100%;
    height: calc(100% - 45px);
    overflow: hidden;
    box-sizing: border-box;
  }
  .place-holder{
    text-align: center;
    @extend .content
  }
}
</style>
