<template>
  <div id="s-edit-grade">
    <div>
      <cell title="年级" application="select" :value="grade" to="grade" @popup="popup" configName="sEditGrade"/>
      <div class="add">
        <div class="border">
          <div class="label">班级</div>
          <div class="input">
            <input ref="input" type="text" v-model.trim="className" placeholder="请输入班级" @blur="on_blur">
          </div>
        </div>
      </div>
    </div>
    <c-select :arr="gradeConfig" :popShow="popShow" :popData="popData" @changePop="popShow = false" @confirm="confirm"></c-select>
  </div>
</template>

<script type="text/ecmascript-6">
import Cell from 'common/components/cell'
import CSelect from 'managerCommon/components/cSelect'
import {mapGetters} from 'vuex'
import student from 'managerHome/student/api/student'

export default {
  name: 'sEditGrade',
  data () {
    return {
      popShow: false,
      popData: {},
      grade: '',
      columns: []
    }
  },
  created () {
    this.$store.commit('managerCommon/SET_ISSAVE', true)
    this._getClientConfigList()
  },
  computed: {
    className: {
      get () {
        return this.$store.state.managerStudent.className
      },
      set (val) {
        this.$store.commit('managerStudent/SET_CLASSNAME', val)
      }
    },
    ...mapGetters({
      studyInfo: 'managerStudent/studyInfo',
      gradeConfig: 'managerStudent/gradeConfig'
    })
  },
  methods: {
    popup (popData) {
      this.popShow = true
      this.popData = Object.assign({}, popData, {value: this.grade, columns: this.columns})
    },
    confirm (val, codeValue) {
      this.popShow = false
      this.grade = val
      this.$store.commit('managerStudent/SET_GRADE', codeValue)
    },
    on_blur () {
      this.$store.commit('managerCommon/SET_ISSAVE', true)
    },
    _getClientConfigList () {
      const value = this.studyInfo.grade
      this.gradeConfig.forEach((v, i) => {
        this.columns.push(v.codeName)
        if (value === v.codeValue) this.grade = v.codeName
      })
      this.$store.commit('managerStudent/SET_CLASSNAME', this.studyInfo.className)
    }
  },
  components: {
    Cell,
    CSelect
  }
}
</script>

<style scoped lang="scss">
  @import "@/style/variable.scss";
  .add{
    padding: 0 calc(26px/2);
    .border{
      display: flex;
      justify-content: space-between;
      letter-spacing:calc(2px/2);
      height: calc(100px/2);
      line-height: calc(100px/2);
      font-size: $header-list;
      border-bottom: 1px solid $color-line;
      input{
        text-indent: calc(15px/2);
        font-size: $header-list-s;
      }
    }
  }
</style>
