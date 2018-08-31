<template>
  <div id="s-edit-score">
    <c-filed v-for="(item,index) in map" :key="index" :filed="filed" :config="item"/>
  </div>
</template>

<script type="text/ecmascript-6">
import cFiled from 'managerCommon/components/cFiled'
import Score from '../../js/score'

export default {
  name: 'sEditScore',
  data () {
    return {
      lists: ['数学', '英语', '语文'],
      filed: true,
      map: []
    }
  },
  created () {
    this._initSubject()
  },
  methods: {
    _initSubject () {
      this.lists.forEach((v, i) => {
        this.map.push(new Score({
          label: v
        }))
      })
    }
  },
  components: {
    cFiled
  }
}
</script>

<style scoped lang="scss">
</style>
