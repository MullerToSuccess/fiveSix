<template>
  <div id="divide-class" class="page" style="z-index: 3">
    <header-bar :newBack="newBack" @back="back">
      <div slot="title-name">分班</div>
      <div slot="right-area" @click="save">
        <span class="page-right-save">保存</span>
      </div>
    </header-bar>
    <div class="s-lists">
      <scroll
        ref="scroll"
        :data="data"
      >
        <div v-for="(item1,index1) in data" class="classes" :key="index1">
          <div class="class-title">
            <i></i>
            <span>{{item1.courseName}}</span>
          </div>
          <div class="no-class" v-if="item1.classList.length === 0">暂无可转班级</div>
          <div class="class-lists" v-else v-for="(item2,index2) in item1.classList" :key="index2" @click="select(item1.courseId,index1,index2,item2.studentCount,item2.studentLimit,item2.teacherName,item2.classId)">
            <div class="top">
              <span>{{item2.className}}</span>
              <i :ref="'radioIcon'+index1" :style="{'backgroundImage':item2.isHave ? 'url(' + require('@/assets/_images/public/select_in.png') + ')':''}"></i>
            </div>
            <div>老师：{{item2.teacherName.join('、')}}</div>
            <div>班级人数: {{item2.studentCount}}</div>
            <div>人数限制: {{item2.studentLimit}}</div>
          </div>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
import HeaderBar from 'common/components/headerBar'
import {divideClass} from 'managerCommon/js/const'
import Scroll from 'common/components/scroll'
import student from '../api/student'
import {mapGetters} from 'vuex'
import {Toast} from 'vant'
export default {
  name: 'divideClass',
  data () {
    return {
      data: [],
      radioLists: [],
      arr: [],
      api: student.getNoClassStudentCourseClass,
      refresh: false,
      newBack: true,
      isBackCache: false
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "waitingManagement") {
      to.meta.isUseCache = !this.refresh
      to.meta.isBackCache = this.isBackCache
      next()
    } else {
      next()
    }
  },
  created () {
    this._getClassByCourse()
  },
  computed: {
    ...mapGetters({
      schoolId: 'managerCommon/schoolId'
    })
  },
  methods: {
    back () {
      this.refresh = false
      this.$router.back(-1)
    },
    select (courseId, index1, index2, count, limit, teacherArr, classId) { //  学生单选
      if (teacherArr.length !== 0) {
        if (parseInt(count) + this.$route.params.userId.split(',').length <= parseInt(limit)) {
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
          let newArr = []
          this.radioLists.forEach((v, i) => {
            if (v.selectIndex !== '') newArr.push(v.selectIndex)
          })
          this.arr = newArr
        } else {
          Toast(`该班级人数超过限制`)
          return false
        }
      } else {
        Toast(`该班级没有老师！`)
        return false
      }
    },
    save () {
      student.saveStudentClassGroup({
        schoolId: this.schoolId,
        userId: this.$route.params.userId,
        classList: this.arr.join(',')
      }).then(r => {
        Toast(`保存成功`)
        this.refresh = true
        this.isBackCache = true
        setTimeout(() => {
          this.$router.back(-1)
        }, 300)
      })
    },
    _getClassByCourse () {
      let id = this.$route.params.id
      student.getNoClassStudentCourseClass({
        schoolId: this.schoolId,
        courseId: id
      }).then(r => {
        this.data = r.page.records
        this.data.forEach((item, index) => {
          let json = {
            courseId: item.courseId,
            selectIndex: ''
          }
          this.radioLists.push(json)
        })
      })
    }
  },
  components: {
    HeaderBar,
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
          background: url('../../../../../assets/_images/public/icon_divide_class.png') no-repeat 0 0;
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
        .top{
          display: flex;
          justify-content: space-between;
          align-items: center;
          i{
            display: inline-block;
            width: calc(34px/2);
            height: calc(34px/2);
            background-image: url('../../../../../assets/_images/public/select_out.png');
            background-repeat: no-repeat;
            background-position: 0 0;
            background-size: 100% 100%;
            vertical-align: text-bottom;
          }
          .in{
            background-image: url('../../../../../assets/_images/public/select_in.png');
          }
        }
      }
    }
  }
</style>
