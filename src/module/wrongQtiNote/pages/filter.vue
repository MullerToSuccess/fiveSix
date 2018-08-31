<template>
  <div id="filter-limit">
    <div class="content">
      <div class="filter-item" v-for="(val, key) in filterData" :key="key">
        <div class="name">{{key}}</div>
        <div class="item-wrapper">
          <div class="item-list ellipsis" :class="{active: actives[key] === index}" v-for="(item, index) in val" :key="index" @click="filterItem(key, index, item)">
            <span>{{item.name || item.class_name}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="operation-bar van-hairline--top">
      <button type="button" class="cancel" @click="$emit('closeFilter')">取消</button>
      <button type="button" class="sure" @click="sure">确定</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FilterLimit',
  props: ['filterData', 'active'],
  data() {
    return {
      actives: {
        '班级': this.active['班级'],
        '题目类型': this.active['题目类型'],
        '错误率': this.active['错误率'],
        '攻克率': this.active['攻克率'],
        '时间': this.active['时间']
      }
    }
  },
  mounted() {
    console.log('mounted')
  },
  methods: {
    filterItem(key, index, item) {
      this.actives[key] = index
    },
    sure() {
      let params = {}
      let timeType
      params['class_id'] = this.filterData['班级'][this.actives['班级']].class_id
      params['class_name'] = this.filterData['班级'][this.actives['班级']].class_name
      params['type'] = this.filterData['题目类型'][this.actives['题目类型']].type
      params['wrong_rate_flag'] = this.filterData['错误率'][this.actives['错误率']].type
      params['conquer_rate_flag'] = this.filterData['攻克率'][this.actives['攻克率']].type
      timeType = this.filterData['时间'][this.actives['时间']].type
      params['end_time'] = this.formatTime(new Date())
      if (timeType === 0) {
        params['start_time'] = ''
        params['end_time'] = ''
      } else if (timeType === 1) {
        params['start_time'] = this.formatTime(new Date().getTime() - 3600 * 1000 * 24 * 7)
      } else if (timeType === 2) {
        params['start_time'] = this.formatTime(new Date().getTime() - 3600 * 1000 * 24 * 30)
      } else if (timeType === 3) {
        params['start_time'] = this.formatTime(new Date().getTime() - 3600 * 1000 * 24 * 30 * 3)
      } else {
        params['start_time'] = this.formatTime(new Date().getTime() - 3600 * 1000 * 24 * 30 * 6)
      }
      // console.log(this.$store)
      let wrongQtiNote = {
        userid: this.$store.state.account.userInfo.userid,
        activeIndex: this.actives['班级'],
        class_id: this.filterData['班级'][this.actives['班级']].class_id,
        class_name: this.filterData['班级'][this.actives['班级']].class_name
      }
      localStorage.setItem('wrongQtiNote', JSON.stringify(wrongQtiNote))
      this.$emit('afterFilter', params, this.actives)
    },
    formatTime(time) {
      time = new Date(time)
      let y = time.getFullYear() + ''
      let m = time.getMonth() + 1 > 9 ? time.getMonth() + 1 + '' : '0' + (time.getMonth() + 1)
      let d = time.getDate() > 9 ? time.getDate() + '' : '0' + time.getDate()
      return y + '-' + m + '-' + d
    }
  }
}
</script>
<style lang="scss" scoped>
#filter-limit{
  .content{
    width: 100%;
    height: calc(100% - 65px);
    overflow-y: scroll;
    box-sizing: border-box;
    padding: 0 13px;
    .filter-item{
      .name{
        width: 100%;
        height: 50px;
        line-height: 50px;
        color: #1e1e1e;
      }
      .item-wrapper{
        display: flex;
        flex-wrap: wrap;
        .item-list{
          background: #f5f5f8;
          flex: 0 0 80px;
          margin-bottom: 8px;
          margin-right: 7px;
          font-size: 12px;
          height: 30px;
          line-height: 30px;
          border-radius: 5px;
          color: #4c4f4f;
          text-align: center;
          &.active{
            background: #08b884;
            color: #fff;
          }
        }
      }
    }
  }
  .operation-bar{
    width: 100%;
    height: 65px;
    box-sizing: border-box;
    padding: 0 13px;
    display: flex;
    justify-content: space-between;
    button{
      outline: none;
      border: 1px solid #08b884;
      background: #fff;
      width: 160px;
      height: 50px;
      line-height: 50px;
      border-radius: 10px;
      margin-top: 7.5px;
      &.sure{
        background-color: #08b884;
        color: #fff;
      }
    }
  }
}
</style>
