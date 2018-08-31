<template>
  <div id="s-edit-grade">
    <div>
      <cell title="年级" application="select" :value="gradeName" to="grade" @popup="popup"/>
      <cell title="班级" application="select" :value="className" to="class" @popup="popup"/>
    </div>
    <c-select :popShow="popShow" :popData="popData" @changePop="popShow = false"></c-select>
  </div>
</template>

<script type="text/ecmascript-6">
import Cell from 'common/components/cell'
import CSelect from 'managerCommon/components/cSelect'

export default {
  name: 'sEditGrade',
  data () {
    return {
      popShow: false,
      popData: {},
      gradeName: '2年级',
      className: '1班'
    }
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
