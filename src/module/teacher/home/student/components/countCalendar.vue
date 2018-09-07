<template>
    <div class="countCalendar-content">
        <div class="week-content">
            <span>日</span>
            <span>一</span>
            <span>二</span>
            <span>三</span>
            <span>四</span>
            <span>五</span>
            <span>六</span>
        </div>
        <div class="day-content">
            <div class="week-row-content" v-for="(index) in 5" :key="index">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: "countCalendar",
  data() {
    return {

    };
  },
  mounted() {
    this.$nextTick(() => {

    });
  },
  methods: {

  }
};
</script>
<style lang='scss' scoped>
.week-content{
    width:100%;
    height:calc(80px/2);
    background: #e4e4e4;
    padding-left: 18px;
    line-height: calc(80px/2);
    span{
        display: inline-block;
        width:calc(100% / 7 - 7px);
        height:calc(100px / 2);
    }
}
.day-content{
    width:100%;
    height:calc(520px/2);
    background: #e4e4e4;
    .week-row-content{
        padding-left: 7px;
        width:calc(100%);
        height:calc(100px / 2);
        div{
            display: inline-block;
            height:calc(80px / 2);
            width:calc(100% / 7 - 7px);
            background: #ffffff
        }
    }
}
</style>
