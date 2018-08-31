<template>
  <div id="s-edit-school">
    <c-filed :filed="filed" :config="config" :value="value"></c-filed>
    <div class="school-history">
      <h2 class="school-title">历史：</h2>
      <div class="history-lists">
        <scroll :data="lists" class="history-view">
          <div>
            <div class="history-item" v-for="(item,index) in lists" :name="index" :key="index" @click="select(item)">{{item}}</div>
          </div>
        </scroll>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {schoolHistory} from 'managerCommon/js/const'
import cFiled from 'managerCommon/components/cFiled'
import Scroll from 'common/components/scroll'

export default {
  name: 'sEditSchool',
  data () {
    return {
      school: '',
      lists: [],
      radio: '0',
      filed: false,
      config: {
        label: '所在学校',
        placeholder: '请输入所在学校',
        validsms: '',
        pattern: '',
        key: 'localSchool'
      },
      value: ''
    }
  },
  created () {
    this.lists = schoolHistory.splice(0, 15)
  },
  methods: {
    select (item) {
      this.value = item
    }
  },
  components: {
    cFiled,
    Scroll
  }
}
</script>

<style scoped lang="scss">
 @import "@/style/variable.scss";
  .school-title{
    height: 80px;
    line-height: 80px;
    padding: 0 26px;
    background: $color-background;
  }
  .history-lists{
    padding: 0 26px;
    position: fixed;
    width: 100%;
    top: 419px;
    bottom: 0;
    .history-view{
      height: 100%;
      overflow: hidden;
      .history-item{
        height: 90px;
        line-height: 90px;
        border-bottom: 1px solid $color-line;
      }
    }
  }
</style>
