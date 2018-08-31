<template>
  <div id="s-edit-guardian">
    <div>
      <cell title="监护人" application="select" :value="guardian" to="grade" @popup="popup"/>
      <cell title="手机号" :value="phone"/>
    </div>
    <c-select :popShow="popShow" :popData="popData" @changePop="popShow = false"></c-select>
  </div>
</template>

<script type="text/ecmascript-6">
import Cell from 'common/components/cell'
import CSelect from 'managerCommon/components/cSelect'

export default {
  name: 'sEditGuardian',
  data () {
    return {
      guardian: '爸爸',
      phone: '13348804864',
      popShow: false,
      popData: {}
    }
  },
  created () {
  },
  methods: {
    popup (popData) {
      this.popShow = true
      this.popData = popData
    }
  },
  components: {
    Cell,
    CSelect
  }
}
</script>

<style scoped lang="scss">
</style>
