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
      lists: [{
        label: '语文',
        subject: 'chineseScore'
      },
      {
        label: '数学',
        subject: 'mathScore'
      },
      {
        label: '英语',
        subject: 'englishScore'
      }],
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
          label: v.label,
          subject: v.subject
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
  #s-edit-score{
    padding: 0 13px;
  }
</style>
