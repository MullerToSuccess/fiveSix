<template>
  <div id="c-edit-birthday">
    <van-picker
      v-if="dateType==='week'"
      show-toolbar
      :value-key="data.value"
      :columns="week"
      @cancel="onCancel"
      @confirm="onConfirm"/>
    <van-datetime-picker
      v-else-if="dateType==='time'"
      v-model="currentDate"
      :type="dateType"
    />
    <van-datetime-picker
      v-else
      v-model="currentDate"
      :type="dateType"
      :min-date="minDate"
      :max-date="maxDate"
    />
  </div>
</template>

<script type="text/ecmascript-6">
import {week} from '../js/const'

export default {
  name: 'cEditBirthday',
  props: {
    data: {
      type: Object
    }
  },
  data () {
    return {
      dateType: '',
      currentDate: '',
      minDate: this._initDate('1960-1'),
      maxDate: new Date(),
      week: week
    }
  },
  created () {
    this._initCurrent(this.data)
  },
  methods: {
    onCancel () {},
    onConfirm () {},
    _initDate (strTime) {
      return new Date(Date.parse(strTime.replace(/-/g, '/')))
    },
    _initCurrent (newVal) {
      let str = newVal.type
      this.dateType = str.split('_')[1]
      if (newVal.value) {
        this.currentDate = this.dateType === 'year-month' ? this._initDate(newVal.value) : newVal.value
      } else {
        this.dateType === 'year-month' ? this.currentDate = this._initDate('1995-1') : this.currentDate = '12:00'
      }
    }
  },
  watch: {
    data: {
      handler: function (newValue) {
        this._initCurrent(newValue)
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
</style>
