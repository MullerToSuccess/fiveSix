<template>
  <div id="report-tab">
    <span class="tab-item" :class="{active: tabType === 1}" @click="reportTabChange(1)">全班成绩</span>
    <span class="tab-item" :class="{active: tabType === 2}" @click="reportTabChange(2)">答题情况</span>
    <span class="tab-item" v-show="homeworkInfo.hour_section_type_id == '20'" :class="{active: tabType === 3}" @click="reportTabChange(3)">知识点分析</span>
  </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  name: 'ReportTab',
  props: ['tabType'],
  data() {
    return {}
  },
  computed: {
    ...mapState({
      homeworkInfo: state => state.homeworkDetail.homeworkInfo
    })
  },
  methods: {
    reportTabChange(type) {
      this.$emit('tabChange', type)
    }
  }
}
</script>
<style lang="scss" scoped>
#report-tab{
  box-sizing: border-box;
  width: 100%;
  height: 45px;
  line-height: 45px;
  display: flex;
  justify-content: space-around;
  padding: 0 13px;
  .tab-item{
    color: #4f4f50;
    font-size: 16px;
    &.active{
      color: #08b884;
      border-bottom: 2px solid #08b884;
    }
  }
}
</style>
