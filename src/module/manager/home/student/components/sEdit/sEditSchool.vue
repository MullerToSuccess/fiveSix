<template>
  <div id="s-edit-school">
    <c-filed :filed="filed" :config="config" :value="value"></c-filed>
    <div class="school-history">
      <h2 class="school-title">历史：</h2>
      <div class="history-lists">
        <scroll :data="lists" class="history-view">
          <div>
            <div v-show="lists.length" class="history-item" v-for="(item,index) in lists" :name="index" :key="index" @click="select(item)">{{item}}</div>
          </div>
        </scroll>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import cFiled from 'managerCommon/components/cFiled'
import Scroll from 'common/components/scroll'
import {mapGetters, mapActions} from 'vuex'
import stroage from '@/store/stroage.js'

export default {
  name: 'sEditSchool',
  props: {
    config: {
      type: Object
    }
  },
  data () {
    return {
      school: '',
      lists: [],
      radio: '0',
      filed: false,
      value: ''
    }
  },
  created () {
    if (this.studentId === stroage['persistent'].get('mStudent.id')) {
      this.lists = stroage['persistent'].get('mStudent.localSchoolHistory') ? stroage['persistent'].get('mStudent.localSchoolHistory').splice(0, 15) : []
    } else {
      stroage['persistent'].remove('mStudent');
    }
  },
  computed: {
    ...mapGetters({
      studentId: 'managerStudent/userId'
    })
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
    margin: 0;
    border: 0;
    font-size: 100%;
    font-weight: normal;
    vertical-align: baseline;
    height: calc(80px/2);
    line-height: calc(80px/2);
    padding: 0 calc(26px/2);
    background: $color-background;
  }
 .school-history{
   margin-top: 20px;
   .history-lists{
     padding: 0 calc(26px/2);
     position: fixed;
     width: 100%;
     top: calc(419px/2);
     bottom: 0;
     .history-view{
       height: 100%;
       overflow: hidden;
       .history-item{
         height: calc(90px/2);
         line-height: calc(90px/2);
         border-bottom: 1px solid $color-line;
       }
     }
   }
 }
</style>
