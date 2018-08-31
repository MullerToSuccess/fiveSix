<template>
  <div id="class-score">
    <class-score-overview></class-score-overview>
    <div class="split-line"></div>
    <circle-chart></circle-chart>
    <div class="split-line"></div>
    <student-score-table from="classScore"></student-score-table>
  </div>
</template>
<script>
// 全班成绩
import classScoreOverview from './classScoreOverview'
import circleChart from './circleChart'
import studentScoreTable from './studentScoreTable'
export default {
  name: 'ClassScore',
  methods: {
  },
  components: {
    classScoreOverview,
    circleChart,
    studentScoreTable
  }
}
</script>
<style lang="scss" scoped>
#class-score{
  .split-line{
    width: 100%;
    height: 10px;
    background: #f5f8f8;
  }
}
</style>
