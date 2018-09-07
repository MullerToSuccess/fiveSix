<template>
    <div class="chart-content">
        <div class="chart-top">
            <span class="chart-title">{{ chartTitle }}</span><br>
            <span class="chart-ratio">{{ attendRatio }}</span><br>
            <span class="chart-more" @click="goMore">{{ moreTitle }} > </span><br>
        </div>
        <div class="chart-bottom">
            <div class="bottom-content"><span class="chart-ratio">{{ shouldAttend }}</span><br><span>应到</span></div>
            <div class="bottom-content"><span class="chart-ratio">{{ havedAttend }}</span><br><span>出勤</span></div>
            <div class="bottom-content"><span class="chart-ratio">{{ notAttend }}</span><br><span>缺勤</span></div>
        </div>
        <!-- <div id="chart"></div> -->
    </div>
</template>
<script>
export default {
  name: "countChart",
  data() {
    return {
      shouldAttend: 13,
      havedAttend: 11,
      notAttend: 2,
      attendRatio: "86%",
      moreTitle: "考勤明细",
      chartTitle: "出勤率",
      option: {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "xx",
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line"
          }
        ]
      }
    };
  },
  mounted() {
    // this.$nextTick(() => {
    //   //   this.computedSize();
    //   debugger;
    //   this.chart = this.$echarts.init(document.getElementById("chart"));
    //   this.chart.setOption(this.option);
    // });
    // window.onresize = () => {
    //   this.chart.resize();
    // };
  },
  methods: {
    goMore() {
      this.$router.push('countDetail');
    }
    // computedSize() {
    //   let rect = this.util.getRect(document.getElementById("homework-content"));
    //   this.fontSize = this.fontSize * (rect.width / 375);
    // }
  }
};
</script>
<style lang='scss' scoped>
.chart-content {
  text-align: center;
  width: calc(90%);
  height: calc(380px / 2);
  margin-left: calc(20px / 2);
  margin-right: calc(20px / 2);
  border: 1px solid #000000;
  .chart-top {
    height: calc(240px / 2);
    margin-top: calc(30px / 2);
  }
  .chart-bottom {
    height: calc(140px / 2);
  }
  .bottom-content {
    width: calc(90% / 3);
    height: calc(100px / 2);
    display: inline-block;
    //   position: absolute;
    bottom: 0;
  }
  .chart-ratio {
    font-size: 24px;
  }
  #chart {
    width: 100%;
    height: 100%;
  }
}
</style>
