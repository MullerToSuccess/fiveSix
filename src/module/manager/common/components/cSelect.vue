<template>
  <div>
    <van-popup v-model="show" position="bottom" @click-overlay="$emit('changePop', false)">
      <c-edit-birthday v-if="flag" :data="popData" @cancel="$emit('changePop', false)"></c-edit-birthday>
      <van-picker
        v-else
        show-toolbar
        :value-key="popData.value"
        :columns="columns"
        @cancel="$emit('changePop', false)"
        @confirm="onConfirm"
        :loading="loading"/>
    </van-popup>
  </div>
</template>

<script>
import cEditBirthday from './cEditBirthday'
import commonAPI from 'common/api/api'
import {popup} from 'managerCommon/js/mixin'
export default {
  name: 'cSelect',
  mixins: [popup],
  props: {
    popShow: {
      type: Boolean,
      default: false
    },
    popData: {
      type: Object
    },
    arr: {
      type: Array
    }
  },
  data () {
    return {
      show: false,
      columns: [],
      flag: false,
      key: '',
      loading: false
    }
  },
  created () {
  },
  methods: {
    onConfirm (val) {
      if (this.key === 'guardian' || this.key === 'grade') {
        let codeValue
        this.arr.forEach((v, i) => {
          if (val === v.codeName) codeValue = v.codeValue
        })
        this.$emit('confirm', val, codeValue)
      } else {
        if (this.key === 'householdAddress') {
          let codeValue
          this.arr.forEach((v, i) => {
            if (val === v.name) codeValue = v.id
          })
          this.$emit('changePop', false)
          this.updateInfo(val, codeValue)
        } else if (this.key === 'degree') {
          let codeValue
          this.arr.forEach((v, i) => {
            if (val === v.codeName) codeValue = v.codeValue
          })
          this.$emit('changePop', false)
          this.updateInfo(val, codeValue)
        } else {
          if (this.key === 'sex') {
            val = val === '男' ? '1' : '0'
          }
          this.$emit('changePop', false)
          this.updateInfo(val)
        }
      }
    }
  },
  watch: {
    popShow (newVal) {
      this.show = newVal
    },
    popData: {
      handler: function (newValue) {
        const str = newValue.type
        this.key = newValue.key
        this.flag = str.split('_')[0] === 'date'
        if (newValue.columns === '') {
          this.loading = true
          let type
          if (this.key === 'householdAddress') {

          } else {
            if (this.key === 'degree') {
              type = 'degree'
            }
            commonAPI.clientConfigList({
              category: type
            }).then(r => {
              this.loading = false
            })
          }
        } else {
          this.columns = this.popData.columns
        }
      },
      deep: true
    }
  },
  components: {
    cEditBirthday
  }
}
</script>

<style scoped>

</style>
