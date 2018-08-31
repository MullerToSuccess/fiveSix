<template>
  <van-popup v-model="show" position="bottom" @click-overlay="click_overlay">
    <div class="pop-bottom">
      <div class="btn">
        <span @click="cancel">取消</span>
        <span class="confirm" @click="confirm">确定</span>
      </div>
      <ul class="week-list">
        <li class="week" v-for="(item, index) in weekLists" :key="index" @click="weekSelect(item,index)">
          <span>{{item}}</span>
          <i ref="week" :class="{'in': checkboxLists.indexOf(item) >= 0}"></i>
        </li>
      </ul>
    </div>
  </van-popup>
</template>

<script>
import {week} from 'managerCommon/js/const'
import {mapGetters, mapMutations} from 'vuex'
export default {
  name: 'week',
  props: {
    weekShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      show: false,
      weekLists: week,
      checkboxLists: []
    }
  },
  computed: {
    ...mapGetters({
      saveClass: 'managerClass/saveClass',
      weekNameList: 'managerClass/weekNameList'
    })
  },
  created () {
  },
  methods: {
    weekSelect (item) {
      let itemIndex = this.checkboxLists.indexOf(item)
      if (itemIndex >= 0) {
        this.checkboxLists.splice(itemIndex, 1)
      } else {
        this.checkboxLists.push(item)
      }
    },
    cancel () {
      this.$emit('changePop', false)
      this.checkboxLists = [].concat(this.weekNameList)
    },
    confirm () {
      let arr = []
      this.checkboxLists.forEach((v, i) => {
        let val
        switch (v) {
          case '周日':
            val = 0
            break
          case '周一':
            val = 1
            break
          case '周二':
            val = 2
            break
          case '周三':
            val = 3
            break
          case '周四':
            val = 4
            break
          case '周五':
            val = 5
            break
          case '周六':
            val = 6
            break
        }
        arr.push(val)
      })
      this.$emit('confirm', arr)
      this.$emit('changePop', false)
      this.show = false
      this.setSaveClass({week: arr.join(',')})
    },
    click_overlay () {
      this.$emit('changePop', false)
      this.checkboxLists = [].concat(this.weekNameList)
    },
    ...mapMutations({
      setSaveClass: 'managerClass/SET_SAVECLASS'
    })
  },
  watch: {
    weekShow (newVal) {
      this.show = newVal
    },
    weekNameList (newVal) {
      this.checkboxLists = [].concat(newVal)
    }
  }
}
</script>

<style scoped lang="scss">
  @import "@/style/variable.scss";
  .pop-bottom{
    padding: 0 calc(26px/2);
    .btn,.week{
      display: flex;
      justify-content: space-between;
      height: calc(100px/2);
      line-height: calc(100px/2);
      border-bottom: 1px solid #e9ecf4;
    }
    .btn{
      width: 100%;
      font-size: calc(34px/2);
      color: $color-text;
      .confirm{
        color: $green-primary-color;
      }
    }
    .week{
      align-items: center;
      i{
        display: inline-block;
        width: calc(34px/2);
        height: calc(34px/2);
        background-image: url('../../../../../assets/_images/public/select_out.png');
        background-repeat: no-repeat;
        background-position: 0 0;
        background-size: 100% 100%;
        vertical-align: text-bottom;
      }
      .in{
        background-image: url('../../../../../assets/_images/public/select_in.png')
      }
    }
  }
</style>
