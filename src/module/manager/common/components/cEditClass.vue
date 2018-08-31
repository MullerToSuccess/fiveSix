<template>
  <div id="s-edit-class">
    <div class="s-lists">
      <scroll
        ref="scroll"
        :data="data"
      >
        <div class="no-course" v-if="data.length === 0">暂时没有课程</div>
        <div v-else v-for="(item1,index1) in data" class="classes" :key="index1">
          <div class="class-title">
            <i></i>
            <span>{{item1.courseName}}</span>
          </div>
          <div class="no-class" v-if="item1.classList.length === 0">暂无可转班级</div>
          <div class="class-lists" v-else v-for="(item2,index2) in item1.classList" :key="index2" @click="select(item1.courseId,index1,index2,item2.classId,item2.className,item2.studentCount,item2.studentLimit,item2.teacherName)">
            <div class="top">
              <span>{{item2.className}}</span>
              <i :ref="'radioIcon'+index1" :style="{'backgroundImage':item2.isHave ? 'url(' + require('@/assets/_images/public/select_in.png') + ')':''}"></i>
            </div>
            <div class="teacher-content">老师：{{item2.teacherName.join('、')}}</div>
            <div>班级人数: {{item2.studentCount}}</div>
            <div>人数限制: {{item2.studentLimit}}</div>
          </div>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import student from 'managerHome/student/api/student'
import teacher from 'managerHome/teacher/api/teacher'
import {mapGetters, mapMutations} from 'vuex'
import Scroll from 'common/components/scroll'
import {Toast} from 'vant'
export default {
  name: 'cEditClass',
  data () {
    return {
      data: [],
      radioLists: [],
      teacherArr: [],
      route: this.$route.name,
      api: this.$route.name === 'sEditMsg' ? student.getStudentCourseClassList : teacher.getTeacherClassList
    }
  },
  created () {
    this.$store.commit('managerCommon/SET_ISSAVE', true)
    this._initRadioLists()
  },
  computed: {
    ...mapGetters({
      studentId: 'managerStudent/userId',
      schoolId: 'managerCommon/schoolId',
      teacherId: 'managerTeacher/userId'
    })
  },
  methods: {
    _initRadioLists () {
      if (this.route === 'sEditMsg') {
        this._judeRoute(student.getStudentCourseClassList, {userId: this.studentId})
      } else if (this.route === 'tEditMsg') {
        if (this.$route.params.query) {
          this._judeRoute(teacher.getSchoolCourseClassList)
        } else {
          this._judeRoute(teacher.getTeacherClassList, {userId: this.teacherId})
        }
      }
    },
    _judeRoute (api, params) {
      let json = Object.assign({schoolId: this.schoolId}, params)
      api(json).then(r => {
        this.data = r.page.records
        if (this.route === 'sEditMsg') {
          let arr = []
          this.data.forEach((item, index) => {
            let json = {
              courseId: item.courseId,
              selectIndex: ''
            }
            item.classList.forEach((v, i) => {
              if (v.isHave) {
                json.selectIndex = v.classId
                arr.push(v.classId)
              }
            })
            this.radioLists.push(json)
          })
          this.setStudentClassLists(arr.join(','))
        }
        if (this.route === 'tEditMsg') {
          let arr = []
          this.data.forEach((item, index) => {
            let json = {
              courseId: item.courseId,
              checkBox: [],
              className: []
            }
            item.classList.forEach((v, i) => {
              if (v.isHave) {
                json.checkBox.push(v.classId)
                json.className.push(v.className)
                arr.push(v.classId)
              }
            })
            this.teacherArr.push(json)
          })
          this.setTeacherClassLists(arr.join(','))
        }
      })
    },
    select (courseId, index1, index2, classId, className, count, limit, teacherArr) {
      if (this.route === 'sEditMsg') {
        this.selectStudent(courseId, index1, index2, classId, className, count, limit, teacherArr)
      } else {
        this.selectTeacher(courseId, index1, index2, classId, className)
      }
    },
    selectStudent (courseId, index1, index2, classId, className, count, limit, teacherArr) { //  学生单选
      if (teacherArr.length !== 0) {
        if (parseInt(count) + 1 <= parseInt(limit)) {
          let self = this
          let radioIcon = `radioIcon${index1}`
          this.radioLists.forEach((item, index) => {
            if (courseId === item.courseId) {
              if (classId === item.selectIndex) {
                item.selectIndex = ''
                self.$refs[radioIcon][index2].style.backgroundImage = ''
              } else {
                item.selectIndex = classId
                self.$refs[radioIcon].forEach((v, i) => {
                  v.style.backgroundImage = ''
                })
                self.$refs[radioIcon][index2].style.backgroundImage = 'url(' + require('@/assets/_images/public/select_in.png') + ')'
              }
            }
          })
          let arr = []
          this.radioLists.forEach((v, i) => {
            if (v.selectIndex !== '')arr.push(v.selectIndex)
          })
          this.setStudentClassLists(arr.join(','))
        } else {
          Toast(`该班级人数超过限制`)
          return false
        }
      } else {
        Toast(`该班级没有老师！`)
        return false
      }
    },
    selectTeacher (courseId, index1, index2, classId, className) { //  老师多选
      let self = this
      let radioIcon = `radioIcon${index1}`
      this.teacherArr.forEach((item, index) => {
        if (courseId === item.courseId) {
          let idIndex = item.checkBox.indexOf(classId)
          if (idIndex >= 0) {
            item.checkBox.splice(idIndex, 1)
            item.className.splice(idIndex, 1)
            self.$refs[radioIcon][index2].style.backgroundImage = ''
          } else {
            item.checkBox.push(classId)
            item.className.push(className)
            self.$refs[radioIcon][index2].style.backgroundImage = 'url(' + require('@/assets/_images/public/select_in.png') + ')'
          }
        }
      })
      let arr1 = []
      let arr2 = []
      this.teacherArr.forEach((v, i) => {
        if (v.checkBox.length !== 0) {
          arr1 = arr1.concat(v.checkBox)
          arr2 = arr2.concat(v.className)
        }
      })
      if (this.$route.params.query) {
        this.setTeacherClassName(arr2)
      }
      this.setTeacherClassLists(arr1.join(','))
    },
    ...mapMutations({
      setStudentClassLists: 'managerStudent/SET_CLASSLISTS',
      setTeacherClassName: 'managerTeacher/SET_TEACHERCLASSNAME',
      setTeacherClassLists: 'managerTeacher/SET_CLASSLISTS'
    })
  },
  components: {
    Scroll
  }
}
</script>

<style scoped lang="scss">
 @import "@/style/variable.scss";
 .s-lists {
   position: fixed;
   top: calc(100px/2);
   bottom: 0;
   width: 100%;
   border-top: 1px solid $color-line;
   .no-course{
     width: 100%;
     margin-top: 200px;
     text-align: center;
     font-size: 28px;
     color: $color-text-d;
   }
   .classes{
     padding: 0 calc(26px/2);
     .class-title{
       display: flex;
       align-items: center;
       height: calc(80px/2);
       line-height: calc(80px/2);
       border-bottom: 1px solid $color-line;
       i{
         display: inline-block;
         width: calc(42px/2);
         height: calc(42px/2);
         margin-right:6px;
         background: url('../../../../assets/_images/public/icon_divide_class.png') no-repeat 0 0;
         background-size: 100% 100%;
         vertical-align: text-bottom;
       }
       span{
         display: inline-block;
         width: 80%;
         height: calc(42px/2);
         font-size: 16px;
         letter-spacing: 2px;
         line-height: calc(42px/2);
         overflow: hidden;
         text-overflow:ellipsis;
         white-space: nowrap;
       }
     }
     .no-class{
       padding: 20px 0;
       text-align: center;
       font-size: $header-list-s;
       color: $color-text-d;
     }
     .class-lists{
       font-size: $header-list-s;
       color: $color-text-d;
       border-bottom: 1px solid $color-line;
       div{
         height: calc(80px/2);
         line-height: calc(80px/2);
         margin-left: calc(55px/2);
         letter-spacing: calc(2px/2);
       }
       .teacher-content{
         white-space: nowrap;
         overflow: hidden;
         text-overflow: ellipsis;
       }
       .top{
         display: flex;
         justify-content: space-between;
         align-items: center;
         i{
           display: inline-block;
           width: calc(34px/2);
           height: calc(34px/2);
           background-image: url('../../../../assets/_images/public/select_out.png');
           background-repeat: no-repeat;
           background-position: 0 0;
           background-size: 100% 100%;
           vertical-align: text-bottom;
         }
         .in{
           background-image: url('../../../../assets/_images/public/select_in.png');
         }
       }
     }
   }
 }
</style>
