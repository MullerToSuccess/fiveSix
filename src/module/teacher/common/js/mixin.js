import HeaderBar from 'common/components/headerBar'
import Scroll from 'common/components/scroll'
import Cell from 'common/components/cell'
import cSelect from '../components/cSelect'
import Bottom from '../components/bottom'
import {_normalizeStudents} from 'manager/common/js/_function'

export const MSelect = {
  data () {
    return {
      mode: [0, 1, 2, 3, 4, 5, 6, 7],
      more: true,
      popShow: false,
      popData: {},
      bPath: this.$route.name
    }
  },
  methods: {
    popup (popData) {
      this.popShow = true
      this.popData = popData
    }
  },
  components: {
    HeaderBar,
    Scroll,
    Cell,
    cSelect,
    Bottom
  }
}
export const MListView = {
  data () {
    return {
      data: []
    }
  },
  created () {
    this._getStudentsList()
  },
  methods: {
    _getStudentsList () {
      this.data = _normalizeStudents(StudentsMock)
    }
  },
  components: {
    ListView
  }
}
