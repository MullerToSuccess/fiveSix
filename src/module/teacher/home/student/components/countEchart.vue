<template>
    <div id='chart-content' class="chart-content">
        <div id="chart"></div>
    </div>
</template>
<script>
export default {
  name: "countChart",
  data() {
    return {
      option: {
        xAxis: {
          type: "category",
          data: ["8.23", "8.24", "8.25", "8.26", "8.27", "8.28", "8.29"]
        },
        yAxis: {
          type: "value",
          axisLabel: {
            show: true,
            interval: "auto",
            formatter: "{value} %"
          }
        },
        series: [
          {
            name: "百分比",
            data: [82, 93, 91, 93, 90, 98, 96],
            type: "line"
          }
        ]
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.computedSize();
      debugger;
      this.chart = this.$echarts.init(document.getElementById("chart"));
      this.chart.setOption(this.option);
    });
    window.onresize = () => {
      this.chart.resize();
    };
  },
  methods: {
    computedSize() {
      let rect = this.util.getRect(document.getElementById("chart-content"));
      this.fontSize = this.fontSize * (rect.width / 375);
    }
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
  #chart {
    width: 100%;
    height: 100%;
  }
}
</style>
