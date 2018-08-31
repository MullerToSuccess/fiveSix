<template>
  <div>
    <van-popup v-model="show" position="bottom" @click-overlay="changeParent">
      <c-edit-birthday v-if="flag" :data="popData"></c-edit-birthday>
      <van-picker
        v-else
        show-toolbar
        :value-key="popData.value"
        :columns="columns"
        @cancel="onCancel"
        @confirm="onConfirm"/>
    </van-popup>
  </div>
</template>

<script>
import cEditBirthday from './cEditBirthday'
import {sex, political, census, qualifications} from '../js/const'

export default {
  name: 'cSelect',
  props: {
    popShow: {
      type: Boolean,
      default: false
    },
    popData: {
      type: Object
    }
  },
  data () {
    return {
      show: false,
      columns: [],
      flag: false
    }
  },
  methods: {
    onCancel () {},
    onConfirm () {},
    changeParent () {
      this.$emit('changePop', false)
    }
  },
  watch: {
    popShow () {
      if (this.popShow) this.show = true
    },
    popData: {
      handler: function (newValue) {
        let str = newValue.type
        if (str.split('_')[0] === 'date') {
          this.flag = true
        } else {
          this.flag = false
          let columns
          switch (newValue.type) {
            case 'sex':
              columns = sex
              break
            case 'political':
              columns = political
              break
            case 'census':
              columns = census
              break
            case 'qualifications':
              columns = qualifications
              break
          }
          this.columns = columns
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
