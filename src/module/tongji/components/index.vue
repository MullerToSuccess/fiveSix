<template>
  <div id="tongji">
  </div>
</template>
<script>
import headerBar from '@/components/headerBar.vue'
import tab from './tab'
import accordingQuestion from './accordingQuestion'
import accordingStudent from './accordingStudent'
import studentList from '@/components/studentList'
import api from '../axios/api'
import {mapMutations} from 'vuex'
export default {
  name: 'Tongji',
  data() {
    return {
    }
  },
  computed: {
  },
  activated() {
  },
  methods: {
  },
  components: {
  }
}
</script>
<style lang="scss" scoped>
#tongji{
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  .percent-wrapper{
    width: 100%;
    height: 80px;
    overflow: hidden;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    font-size: 15px;
    .percent-item{
      flex: 1;
      display: inline-flex;
      flex-direction: column;
      text-align: center;
      .name{
        height: 24px;
        line-height: 24px;
        color: #7f8284;
      }
      .percent{
        height: 24px;
        line-height: 24px;
        &.red{
          color: #fc5363;
        }
        &.black{
          color: #1e1e1e;
        }
      }
    }
  }
  .tab-wrapper{
    width: 100%;
    height: 45px;
    background-color: #f5f8f8;
  }
  .list-wrapper{
    width: 100%;
    height: calc(100% - 80px - 45px - 45px);
    overflow-y: scroll;
    &.according-q{
      height: calc(100% - 80px - 45px);
    }
    &.noScroll{
      overflow: hidden;
    }
  }
  .model-icon{
    position: fixed;
    width: 55px;
    height: 55px;
    bottom: 20px;
    right: 13px;
    background-color: #3ac69e;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 2px 2px rgba(0, 0, 0, .2);
    img{
      width: 24px;
      height: 19px;
    }
    span{
      padding-top: 5px;
      color: #fff;
      font-size: 10px;
    }
  }
  .loading{
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #999;
  }
}
</style>
