<template>
  <div id="s-edit-guardian">
    <div>
      <cell title="监护人" application="select" :value="guardian" to="grade" @popup="popup" configName="sEditGuardian"/>
      <div class="add">
        <div class="border">
          <div class="label">手机号</div>
          <div class="input">
            <input ref="input" type="text" v-model.trim="guardianData" placeholder="请输入监护人手机号" @blur="on_blur">
          </div>
        </div>
      </div>
      <div class="validsms" v-show="!validsms">请输入正确的手机号！</div>
    </div>
    <c-select :arr="guardianArr" :popShow="popShow" :popData="popData" @changePop="popShow = false" @confirm="confirm"></c-select>
  </div>
</template>

<script type="text/ecmascript-6">
import Cell from 'common/components/cell'
import CSelect from 'managerCommon/components/cSelect'
import {mapGetters} from 'vuex'
import cFiled from 'managerCommon/components/cFiled'
import commonAPI from 'common/api/api'
export default {
  name: 'sEditGuardian',
  data () {
    return {
      guardian: '',
      popShow: false,
      popData: {},
      validsms: false,
      pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57]|19[89])[0-9]{8}$/,
      arr: [],
      guardianArr: []
    }
  },
  created () {
    this.$store.commit('managerCommon/SET_ISSAVE', true)
    const value = this.$store.state.managerStudent.saveGuardian.guardian
    this.guardianArr = window.bus.$store.state.managerStudent.guardianConfig
    this.guardianArr.forEach((v, i) => {
      this.arr.push(v.codeName)
      if (value === v.codeValue) this.guardian = v.codeName
    })
  },
  computed: {
    guardianData: {
      get () {
        return this.$store.state.managerStudent.saveGuardian.mobile
      },
      set (val) {
        this.$store.commit('managerStudent/SET_GUARDIANPHONE', val)
      }
    },
    ...mapGetters({
      familyInfo: 'managerStudent/familyInfo'
    })
  },
  methods: {
    popup (popData) {
      this.popShow = true
      this.popData = Object.assign({}, popData, {value: this.guardian, columns: this.arr})
    },
    confirm (val, value) {
      this.popShow = false
      this.guardian = val
      this.$store.commit('managerStudent/SET_GUARDIAN', value)
    },
    on_blur () {
      this.validsms = this.pattern.test(this.guardianData)
      if (!this.validsms) {
        this.$store.commit('managerCommon/SET_ISSAVE', false)
      } else {
        this.$store.commit('managerCommon/SET_ISSAVE', true)
      }
    }
  },
  components: {
    Cell,
    CSelect,
    cFiled
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
  .validsms{
    padding: 10px 50px 0 0 ;
    text-align: right;
    color: red;
    font-size: calc(26px/2);
  }
</style>
