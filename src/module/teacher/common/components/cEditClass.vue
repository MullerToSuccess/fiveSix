<template>
  <div id="s-edit-class">
    <div v-for="(item1,index1) in lists" class="classes" :key="index1">
      <div class="class-title">
        <i></i>
        <span>{{item1.title}}</span>
      </div>
      <div class="class-lists" v-for="(item2,index2) in item1.lists" :key="index2" @click="select(item1.title,index1,index2)">
        <span>{{item2.name}}</span>
        <span>{{item2.time}}</span>
        <i :ref="'radioIcon'+index1"></i>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {classes} from '../js/const'

export default {
  name: 'sEditClass',
  data () {
    return {
      lists: classes,
      radioLists: []
    }
  },
  created () {
    this._initRadioLists()
  },
  methods: {
    _initRadioLists () {
      this.lists.forEach((item, index) => {
        let json = {
          name: item.title,
          selectIndex: ''
        }
        this.radioLists.push(json)
      })
    },
    select (str, index1, index2) {
      let self = this
      let radioIcon = `radioIcon${index1}`
      this.radioLists.forEach((item, index) => {
        if (str === item.name) {
          if (index2 === item.selectIndex) {
            item.selectIndex = ''
            self.$refs[radioIcon][index2].style.backgroundImage = ''
          } else {
            if (item.selectIndex !== '') self.$refs[radioIcon][item.selectIndex].style.backgroundImage = ''
            item.selectIndex = index2
            self.$refs[radioIcon][index2].style.backgroundImage = 'url(' + require('@/assets/_images/public/select_in.png') + ')'
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
 @import "@/style/variable.scss";
  .classes{
    padding: 0 26px;
    .class-title{
      height: 80px;
      line-height: 80px;
      font-weight: bolder;
      i{
        display: inline-block;
        width: 42px;
        height: 42px;
        margin-right:5px;
        background: url('../../../../assets/_images/public/icon_divide_class.png') no-repeat 0 0;
        background-size: 100% 100%;
        vertical-align: text-bottom;
      }
    }
    .class-lists{
      height: 80px;
      line-height: 80px;
      font-size: $header-list-s;
      color: $color-text-d;
      span:first-child{
        margin-left: 55px;
      }
      span:last-child{
        margin-left: 21px;
      }
      i{
        display: inline-block;
        width: 34px;
        height: 34px;
        margin-left:190px;
        background-image: url('../../../../assets/_images/public/select_out.png');
        background-repeat: no-repeat;
        background-position: 0 0;
        background-size: 100% 100%;
        vertical-align: text-bottom;
      }
    }
  }
</style>
