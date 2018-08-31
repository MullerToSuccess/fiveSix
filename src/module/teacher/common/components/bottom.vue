<template>
  <div id="bottom">
    <ul v-if="!bShow" class="bottom">
      <router-link class="change-class" :to="{ name: 'sEditMsg', params: { component: 'cEditClass', isSave: true }}" tag="li">转班</router-link>
      <li :class="item.class" v-for="(item,index) in sLists" :key="index" @click="showModel(index)">{{item.text}}</li>
    </ul>
    <ul v-else class="bottom">
      <li :class="item.class" v-for="(item,index) in lists" :key="index" @click="showModel(index)">{{item.text}}</li>
    </ul>
    <van-popup v-model="show" @click-overlay="show = false">
      <div v-for="(item,index) in appMode" :key="index" v-show="showIndex === 0">
        <div class="pop-title">{{item.title}}</div>
        <div class="pop-content">{{item.text}}</div>
      </div>
      <div v-show="showIndex === 1">
        <div class="pop-title">密码重置成功</div>
        <div class="pop-content">密码：123456</div>
      </div>
    </van-popup>
  </div>
</template>

<script type="text/ecmascript-6">
import {appMode} from '../js/const'

export default {
  name: 'bottom',
  props: {
    bPath: {
      type: String
    }
  },
  data () {
    return {
      lists: [{
        text: '停用',
        class: 'stop'
      }, {
        text: '重置密码',
        class: 'reset'
      }, {
        text: '删除',
        class: 'delete'
      }],
      sLists: [],
      show: false,
      appMode: appMode,
      showIndex: false,
      bShow: false
    }
  },
  created () {
    if (this.bPath === 'teacherDetails') this.bShow = true
    let arr = [].concat(this.lists)
    arr.splice(arr.length - 1, 1)
    this.sLists = arr
  },
  methods: {
    showModel (index) {
      this.show = true
      this.showIndex = index
    }
  }
}
</script>

<style scoped lang="scss">
 @import "@/style/variable.scss";
  #bottom {
    position: fixed;
    width: 100%;
    height: 115px;
    bottom: 0;
    background: $color-background;
    .bottom{
      height: 100%;
      display: flex;
      align-items: center;
      padding: 0 30px;
      li {
        width: 200px;
        height: 90px;
        line-height: 90px;
        text-align: center;
        border: 2px solid transparent;
        border-radius: 19%/42%;
        margin-right: 45px;
        font-size: 34px;
      }
      li:last-child{
        margin-right: 0;
      }
      .change-class{
        background: $green-primary-color;
        color: #fff;
      }
      .stop{
        border: 2px solid $green-primary-color;
        color: $green-primary-color;
      }
      .reset{
        background: $reset-primary-color;
        color: #fff;
      }
      .delete{
        border: 2px solid $delete-primary-color;
        color: $delete-primary-color;
      }
    }
  }
</style>
