<template>
  <div id="s-course">
    <div class="c-content">
      <div class="s-lists">
        <scroll
          ref="scroll"
          :data="data"
        >
        <div class="no-course" v-if="data.length === 0">暂时没有课程</div>
        <div v-else class="c-item" v-for="(item, index) in data" :key="index">
          <div class="course-name">
            <span>{{item.courseName}}</span>
            <span class="mode mode1" v-if="item.isAvailable === 1">进行中</span>
            <span class="mode mode2" v-else-if="item.isAvailable === 0">未开始</span>
            <span class="mode mode2" v-else-if="item.isAvailable === 3">即将过期</span>
          </div>
          <div class="course-start">
            <span>开始时间</span>
            <span>{{item.validStart | date}}</span>
          </div>
          <div class="course-end">
            <span>结束时间</span>
            <span>{{item.validEnd | date}}</span>
          </div>
        </div>
        </scroll>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from 'common/components/scroll'
import {mapGetters} from 'vuex'
import student from 'managerHome/student/api/student'
export default {
  name: 'sCourse',
  data () {
    return {
      data: [],
      api: student.getStudentCourseList
    }
  },
  created () {
    this._initClassify()
  },
  computed: {
    ...mapGetters({
      schoolId: 'managerCommon/schoolId',
      studentId: 'managerStudent/userId',
      cStudentId: 'managerClass/cStudentId',
      courseInfo: 'managerStudent/courseInfo'
    })
  },
  methods: {
    _initClassify () {
      this.data = this.courseInfo
    }
  },
  components: {
    Scroll
  }
}
</script>

<style scoped lang="scss">
 @import "@/style/variable.scss";
  .s-lists{
    position: fixed;
    top: calc(100px/2);
    bottom: 0;
    width: 100%;
    .no-course{
      width: 100%;
      margin-top: 200px;
      text-align: center;
      font-size: 28px;
      color: $color-text-d;
    }
    .c-item{
        padding: 0 calc(26px/2);
        margin-bottom: calc(10px/2);
        background: #fff;
        div{
          display: flex;
          height: calc(100px/2);
          line-height: calc(100px/2);
          font-size: $header-list-s;
          justify-content: space-between;
        }
        .course-name{
          align-items: center;
          font-size: calc(32px/2);
          border-bottom: 1px solid $color-line;
          .mode{
            display: inline-block;
            width: calc(115px/2);
            height: calc(47px/2);
            font-size: calc(28px/2);
            line-height: calc(47px/2);
            text-align: center;
            color: #fff;
            background: $green-primary-color;
            border-radius: 5px/7.5px;
          }
          .mode1{
            background: $green-primary-color;
          }
          .mode2{
            background: yellow;
          }
          .mode3{
            background: red;
          }
        }
      }
  }
</style>
