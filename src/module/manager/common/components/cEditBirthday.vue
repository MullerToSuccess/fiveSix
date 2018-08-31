<template>
  <div id="c-edit-birthday">
    <van-datetime-picker
      v-if="dateType==='year-month'"
      v-model="currentDate"
      :type="dateType"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('cancel')"
      @confirm="onConfirm"
    />
    <van-datetime-picker
      v-else
      v-model="currentDate"
      type="time"
      @cancel="$emit('cancel')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script type="text/ecmascript-6">
import * as filters from '@/filter/index'
import {popup} from 'managerCommon/js/mixin'
import {mapGetters, mapMutations} from 'vuex'
import {Toast} from 'vant'

export default {
  name: 'cEditBirthday',
  mixins: [popup],
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
      key: ''
    }
  },
  created () {
    this._initCurrent(this.data)
  },
  computed: {
    ...mapGetters({
      saveClass: 'managerClass/saveClass'
    })
  },
  methods: {
    onConfirm (val) {
      if (this.dateType === 'year-month') {
        val = val + '-01'
        this.updateInfo(filters.date(val), this.$emit('cancel'))
      } else if (this.dateType === 'time-start') {
        this._time(val, this.saveClass.endTime)
        this.$emit('cancel')
      } else if (this.dateType === 'time-end') {
        this._time(this.saveClass.startTime, val)
        this.$emit('cancel')
      }
    },
    _time (startTime, endTime) {
      let end = parseInt(endTime.replace(':', ''))
      let start = parseInt(startTime.replace(':', ''))
      if (end > start) {
        this.setSaveClass({
          [this.key]: this.key === 'startTime' ? startTime : endTime
        })
      } else {
        Toast(`开始时间不能大于结束时间`)
      }
    },
    _initDate (strTime) {
      return new Date(Date.parse(strTime.replace(/-/g, '/')))
    },
    _initCurrent (newVal) {
      let str = newVal.type
      this.dateType = str.split('_')[1]
      this.key = newVal.key
      if (newVal.value) {
        this.currentDate = this.dateType === 'year-month' ? this._initDate(newVal.value) : newVal.value
      } else {
        this.currentDate = this.dateType === 'year-month' ? this._initDate('1995-1') : '12:00'
      }
    },
    ...mapMutations({
      setSaveClass: 'managerClass/SET_SAVECLASS'
    })
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
