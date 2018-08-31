<template>
  <div id="subject-icom">
    <div v-if="loading" class="place-holder">
      <i class="fa fa-spinner fa-spin"></i>
      <span>加载中...</span>
    </div>
    <div v-if="!loading" class="title">
      <div>{{params.icom_name}}</div>
      <div>{{resource.resource_name}}</div>
    </div>
    <div v-if="!loading" class="content">
      <img :src="resource.cover || resource.icom_pic" alt="...">
    </div>
  </div>
</template>
<script>
import getStatistics from '../../axios/getQuestionStatistics.js'
import {mutations, mapMutations} from 'vuex'
export default {
  name: 'SubjectiveIcom',
  props: ['params', 'icomId', 'index'],
  data() {
    return {
      resource: null,
      loading: true
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    ...mapMutations({
      setSubjectiveIcomInfo: 'answerDetail/setSubjectIcomInfo'
    }),
    getInfo() {
      let param = {
        'resource_id': this.params.resource_id
      }
      this.loading = true
      getStatistics.getSubjectiveIcom(param).then(succ => {
        this.loading = false
        this.resource = succ
        if (this.index !== undefined) {
          this.setSubjectiveIcomInfo({
            index: this.index,
            info: succ
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#subject-icom{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 13px;
  overflow: hidden;
  font-size: 16px;
  background-color: #f8f8f8;
  .title{
    display: flex;
    flex-direction: column;
    height: 60px;
    justify-content: space-between;
    div{
      line-height: 30px;
    }
  }
  .content{
    width: 100%;
    height: 50vh;
    margin-top: 10px;
    img{
      width: 100%;
    }
  }
}
</style>
