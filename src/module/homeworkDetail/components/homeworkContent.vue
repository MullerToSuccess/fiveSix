<template>
  <div id="homeworkContent" class="page">
    <header-bar @back="back">
      <div slot="title-name" >
        作业内容
      </div>
    </header-bar>
    <info :title="info.title" :endTime="info.deadline" :total="list.length"></info>
    <div class="wrapper">
      <div v-for="(item,index) in list" :key="index" class="list" @click="examExercise(index)">
        <p :class="{last:index===list.length-1}">
          <span>{{index+1}}.【{{item.icom_name | questionName(item)}}】{{item.resource_name}}</span>
          <i class="icon"></i>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import headerBar from '@/components/headerBar.vue'
import info from './common/info.vue'
import axios from '../axios/detail.js'
import stroage from '@/store/stroage.js'
export default {
  name: "homeworkContent",
  data() {
    return {
      info: stroage['session'].get('contentinfo').info,
      list: stroage['session'].get('contentinfo').list
    }
  },
  methods: {
    back() {
      // 返回后清除session
      stroage['session'].remove('contentinfo')
      this.$router.back(-1)
    },
    examExercise(index) {
      if (this.isCompound(this.list[index])) {
        axios.getQtiExamids({'source_pk_id': this.list[index].source_pk_id}).then(r => {
          this.$store.dispatch("chooseExamExerciseQtiIdsArray", r.list);
          this.$router.push({
            name: "examExercise",
            params: {
              title: this.list[index].resource_name,
              qti_ids: r.list,
              ischeck: false
            }
          })
        })
      }
    },
    isCompound(resource) {
      let result = true
      let type = this.util.judgeQuestionType(resource)
      if (type === 'combineqti') {
        result = true
      } else if (type === 'subjectiveqti' || type === 'objectiveqti' || type === 'objectiveicom') {
        result = false
      }
      return result
    }
  },
  components: {
    headerBar, info
  }
};
</script>
<style lang="scss" scoped>
  #homeworkContent{
    height: 100%;
    .wrapper{
      height: calc(100% - 130px);
      padding:10px 0px;
      overflow-y: scroll;
      background: #f5f7f8;
      .list{
        padding:0 13px;
        height: 48px;
        line-height: 47px;
        box-sizing: border-box;
        background: #fff;
        p{
          border-bottom: 1px solid #e8ebee;
          position: relative;
          height:100%;
          .icon{
            display: inline-block;
            position: absolute;
            right:0;
            top:15px;
            width:19px;
            height: 19px;
            background-position: center center;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-image: url('../../../assets/images/public/right.png')
          }
          span{
            display: inline-block;
            width:calc(100% - 19px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          &.last{
            border-bottom: none;
          }
        }
      }
    }
  }
</style>
