<template>
  <div id="personalized" class="page">
    <header-bar @back="back">
      <div slot="title-name">作业详情</div>
      <div slot="right-area" class="more-btn">
        <span @click="toggleMorePopup">...</span>
      </div>
    </header-bar>
    <div class="content">
      <student-score-table from="personalized" @personalizedLink="personalizedLink"></student-score-table>
    </div>

    <more v-if="morePopup" @toggle="toggleMorePopup" :info="homeworkInfo" @back="back" :favorite="homeworkInfo.favorite" @collect="collect" :list="resourceList"></more>

  </div>
</template>
<script>
import homeworkDetil from '../axios/detail.js'
import studentDetail from '@/module/studentHomework/api'
import {mapGetters, mapMutations} from 'vuex'
import headerBar from '@/components/headerBar'
import more from './common/more.vue'
import { Toast } from 'vant'
import studentScoreTable from '@/module/homeworkDetail/components/common/studentScoreTable'
export default {
  name: 'personalized',
  data() {
    return {
      studentResourceList: [],
      homeworkInfo: {}, // 作业信息
      morePopup: false,
      refresh: true,
      resourceList: [], // 作业列表
      homeworkStatus: 0,
      tabType: 'detail',
      loading: true
    }
  },
  computed: {
    ...mapGetters({
      env: 'runEnv/old'
    })
  },
  activated() {
    this.getresource();
  },
  methods: {
    ...mapMutations({
      saveHomeworkInfo: 'homeworkDetail/homeworkInfo',
      saveHomeworkQuestionInfo: 'homeworkDetail/homeworkQuestionInfo',
      setAnswerParams: 'answerDetail/setParams',
      setAnswerResource: 'answerDetail/setResource'
    }),
    back() {
      this.$router.back(-1)
    },
    // 收藏
    collect(num) {
      this.homeworkInfo.favorite = num
    },
    // 弹出或收起更多
    toggleMorePopup() {
      this.morePopup = !this.morePopup
    },
    // 获取作业详情所需资源
    getresource() {
      this.loading = true
      let params = {
        publish_id: this.$route.params.publishId,
        class_id: this.$route.params.classId
      };
      // 获取作业信息
      homeworkDetil.getinfo(params).then(succ => {
        this.loading = false;
        this.homeworkInfo = succ;
        succ.student_list.forEach(ele => {
          if (ele.avatar.indexOf('http://') === -1) {
            ele.avatar = this.env + ele.avatar
          }
        });
        this.saveHomeworkInfo(succ)
      })
    },
    // 跳转批改界面
    personalizedLink(info) {
      let _self = this
      let toast = Toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: 'circular',
        message: '加载中'
      })
      // this.$router.push({path: `/studentHomework/${info.userid}/${this.$route.params.publishId}/${info.username}`})
      studentDetail.studentHomeworkInfo({
        user_id: info.userid,
        publish_id: this.$route.params.publishId
      }).then(succ => {
        // console.log(succ)
        this.studentResourceList = succ.course_resource_list
      }).then(() => {
        let resourceList = this.studentResourceList
        let miniResource = []
        resourceList.forEach((ele, index) => {
          let type = this.util.judgeQuestionType(ele)
          if (type) {
            if (type === 'combineqti') {
              homeworkDetil.getMiniResource({
                publish_id: ele.course_hour_publish_id,
                course_resource_id: ele.course_resource_id,
                dcom_entity_id: ele.dcom_entity_id
              }).then(succ => {
                toast.clear()
                miniResource.push(...succ)
                if (index === resourceList.length - 1) {
                  callback()
                }
              })
            } else {
              miniResource.push(ele)
            }
          }
        })
        function callback() {
          if (miniResource.length) {
            _self.setAnswerParams({
              index: 0,
              title: `${info.username}的作业`,
              type: 2,
              userId: info.userid
            })
          }
          _self.setAnswerResource(miniResource)
          _self.$router.push({path: '/pigai'})
        }
      })
    }
  },
  components: {
    more,
    headerBar,
    studentScoreTable
  }
}
</script>
<style lang="scss" scoped>
#personalized{
  width: 100%;
  height: 100%;
  .more-btn{
    line-height: 36px;
    font-size: 18px;
    font-weight: 800;
    color: #4e4e4e
  }
  .content{
    width: 100%;
    height: calc(100% - 45px);
    overflow: scroll;
    box-sizing: border-box;
  }
}
</style>
