import student from 'managerHome/student/api/student'
import teacher from 'managerHome/teacher/api/teacher'
import {Toast} from 'vant'
import {mapGetters, mapMutations, mapActions} from 'vuex'

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
  }
}
export const popup = {
  computed: {
    ...mapGetters({
      studentId: 'managerStudent/userId',
      teacherId: 'managerTeacher/userId'
    })
  },
  methods: {
    updateInfo (val, codeValue) {
      const key = this.key
      const route = this.$route.name
      if (route === 'teacherDetails') {
        const query = this.$route.query.status
        let params = key === 'householdAddress' || key === 'degree' ? codeValue : val
        if (!query) {
          this._refreshDeatils({userId: this.teacherId}, {[key]: params}, teacher.updateInfo, this.getTeacherDetails)
        } else {
          if (key === 'householdAddress') this.setHouseholdAddressName(val)
          if (key === 'degree') this.setDegreeName(val)
          this.addTeacher({[key]: params})
        }
      } else if (route === 'studentDetails') {
        this._refreshDeatils({userId: this.studentId}, {[key]: val}, student.updateInfo, this.getStudentDetails)
      }
    },
    _refreshDeatils (p1, p2, api, refreshApi) {
      let json = Object.assign({}, p1, p2)
      api(json).then(r => {
        refreshApi().then(r => {
          Toast(`修改成功！`)
        })
      })
    },
    ...mapMutations({
      addTeacher: 'managerTeacher/SET_ADDTEACHER',
      setHouseholdAddressName: 'managerTeacher/SET_HOUSEHOLDADDRESSNAME',
      setDegreeName: 'managerTeacher/SET_DEGREENAME'
    }),
    ...mapActions({
      getStudentDetails: 'managerStudent/getStudentDetails',
      getTeacherDetails: 'managerTeacher/getTeacherDetails'
    })
  }
}
export const week = {
  methods: {
    confirm (arr) {
      arr.sort((a, b) => a > b ? 1 : -1)
      let index = arr.indexOf(0)
      if (index >= 0) {
        arr.splice(index, 1)
        arr.push(0)
      }
      let newArr = []
      arr.forEach((v, i) => {
        let val
        switch (v) {
          case 0:
            val = '周日'
            break
          case 1:
            val = '周一'
            break
          case 2:
            val = '周二'
            break
          case 3:
            val = '周三'
            break
          case 4:
            val = '周四'
            break
          case 5:
            val = '周五'
            break
          case 6:
            val = '周六'
            break
        }
        newArr.push(val)
      })
      this.setWeekNameList(newArr)
    }
  }
}
