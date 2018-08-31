<template>
  <div id="class-details" class="page" style="z-index: 2">
    <header-bar>
      <div slot="title-name">班级详情</div>
      <div slot="right-area" v-if="isEdit" @click="save">
        <span class="page-right-save">保存</span>
      </div>
    </header-bar>
    <div class="ptouchpan class-details-list">
        <scroll ref="scroll" :data="saveClass">
          <div>
            <div>
              <cell title="班级名称" :value="saveClass.className" type="class" application="normal" :to="isEdit?'cFiled':''" configName="className"/>
              <cell title="班级课程" :value="saveClass.courseName"/>
              <cell title="开课周期" :value="weekNameList.join(',')" application="select" :to="isEdit?'date_week':''" configName="week" @popup="isEdit?weekClick():''"/>
              <cell title="课程开始时间" :value="saveClass.startTime" application="select" :to="isEdit?'date_time-start':''" configName="startTime" @popup="popupp"/>
              <cell title="课程结束时间" :value="saveClass.endTime" application="select" :to="isEdit?'date_time-end':''" configName="endTime" @popup="popupp"/>
              <div class="sort">
                <div class="border">
                  <div class="label">班级排序</div>
                  <div class="input">
                    <input class="blur-text" type="text" v-model="sortValue" placeholder="请填写班级排序">
                  </div>
                </div>
              </div>
            </div>
            <div class="list-item">
              <div class="cell-msg" @click="isEdit?selectTeacher():''">
                <div class="left-title">班级教师</div>
                <div class="right" v-show="isEdit">
                  <div>
                    <i class="right-icon"></i>
                  </div>
                </div>
              </div>
              <div class="t-list">
                <div class="member" v-for="(item, index) in saveClass.teacherList" :key="'t'+index" @click="isEdit?selectTeacherDetails(item.id):''">
                  <div class="m-img">
                    <img class="avatar" v-lazy="item.photo" v-if="item.photo">
                    <span class="icon" v-else>{{item.name.slice(-2)}}</span>
                  </div>
                  <span class="text">{{item.name}}</span>
                  <span class="mode">老师</span>
                </div>
              </div>
              <div class="middle">
                <div>
                  <span class="left-title">班级成员</span>(<span style="color: red">{{members.studentCount}}人</span>)
                </div>
                <div>
                  <span>人数上限:</span>
                  <span style="color: red">{{members.studentLimit}}人</span>
                </div>
              </div>
              <div class="s-list">
                <scroll ref="scroll" :data="saveClass.teacherList">
                  <div class="member" v-for="(item, index) in studentList" :key="'s'+index" @click="isEdit?selectStudent(item.id):''">
                    <div class="m-img">
                      <img class="avatar" v-lazy="item.photo" v-if="item.photo">
                      <span class="icon" v-else>{{item.name.slice(-2)}}</span>
                    </div>
                    <span class="text">{{item.name}}</span>
                  </div>
                </scroll>
              </div>
            </div>
          </div>
        </scroll>
      </div>
    <c-select :popShow="popShow" :popData="popData" @changePop="popShow = false"></c-select>
    <week :weekShow="weekShow" @confirm="confirm" @changePop="weekShow = false"></week>
    <router-view></router-view>
  </div>
</template>

<script>
import {MSelect, week} from 'managerCommon/js/mixin'
import HeaderBar from 'common/components/headerBar'
import Cell from 'common/components/cell'
import CSelect from 'managerCommon/components/cSelect'
import Scroll from 'common/components/scroll'
import {mapGetters, mapMutations} from 'vuex'
import classAPI from '../api/class'
import {Toast} from 'vant'
import * as filters from '@/filter/index'
import Week from './week'
export default {
  name: 'classDetails',
  mixins: [MSelect, week],
  data () {
    return {
      data: {},
      weekShow: false,
      studentList: [],
      members: [],
      week: '',
      weekData: '',
      isEdit: true,
      isCache: false,
      cacheTeacherId: '',
      clickflag: true
    }
  },
  created () {
    this.isEdit = this.$route.name !== 'tClassDetails'
    this._getClassMemberList()
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "classManagement") {
      to.params.toScrollY = true
      to.meta.isUseCache = !this.isCache
      next()
    } else {
      next()
    }
  },
  computed: {
    sortValue: {
      get () {
        return this.$store.state.managerClass.saveClass.sortValue
      },
      set (val) {
        this.setSaveClass({sortValue: parseInt(val)})
      }
    },
    ...mapGetters({
      schoolId: 'managerCommon/schoolId',
      classId: 'managerClass/classId',
      saveClass: 'managerClass/saveClass',
      weekNameList: 'managerClass/weekNameList'
    })
  },
  methods: {
    popupp (popData) {
      if (this.isEdit) {
        this.popup(popData)
      } else {
        return false
      }
    },
    selectTeacherDetails (id) {
      this.setTeacherId(id)
      this.$router.push({
        path: '/manager/teacher/teacherDetails'
      })
    },
    selectTeacher () {
      this.$router.push({
        name: 'cSelectTeacher'
      })
    },
    selectStudent (id) {
      this.setStudentID(id)
      this.$router.push({
        name: 'studentDetails'
      })
    },
    weekClick () {
      this.weekShow = true
    },
    save () {
      if (this.saveClass.teacherId === this.cacheTeacherId) delete this.saveClass.teacherId
      if (this.saveClass.teacherId === '') this.setSaveClass({teacherId: 0})
      if (!this.saveClass.week && this.saveClass.week === '') {
        Toast(`开课周期不能为空`)
        return
      }
      if (!this.clickflag) return
      this.clickflag = false
      delete this.saveClass.teacherList
      let date = {
        startTime: this.saveClass.startTime + ':00',
        endTime: this.saveClass.endTime + ':00'
      }
      let params = Object.assign({id: this.classId}, this.saveClass, date)
      classAPI.update(params).then(r => {
        this.isCache = true
        this._getClassMemberList()
      })
    },
    _jugeKey (obj, key) {
      return obj && obj.hasOwnProperty(key) && obj[key] !== ''
    },
    _getClassMemberList () {
      classAPI.info({
        schooId: this.schooId,
        classId: this.classId
      }).then(r => {
        let teacherIdArr = []
        let json1 = {
          courseId: r.classId,
          className: r.className,
          courseName: r.courseName,
          sortValue: r.sortValue,
          startTime: filters.spaceDate(r.startTime),
          endTime: filters.spaceDate(r.endTime),
          week: r.weekList.join(','),
          teacherList: r.teacherList
        }
        let arr = []
        this.clearSaveClass()
        this.members = r
        this.studentList = r.studentList
        r.teacherList.forEach((v, i) => {
          teacherIdArr.push(v.id)
        })
        r.weekList.forEach((v, i) => {
          let str
          switch (v) {
            case 0:
              str = '周日'
              break
            case 1:
              str = '周一'
              break
            case 2:
              str = '周二'
              break
            case 3:
              str = '周三'
              break
            case 4:
              str = '周四'
              break
            case 5:
              str = '周五'
              break
            case 6:
              str = '周六'
              break
          }
          arr.push(str)
        })
        this.setWeekNameList(arr)
        this.cacheTeacherId = teacherIdArr.join(',')
        let json2 = Object.assign(json1, {teacherId: teacherIdArr.join(',')})
        this.setSaveClass(json2)
        if (this.isCache) {
          Toast(`修改班级成功`)
          this.clickflag = true
        }
      })
    },
    ...mapMutations({
      setSaveClass: 'managerClass/SET_SAVECLASS',
      setStudentID: 'managerStudent/SET_USERID',
      setTeacherId: 'managerTeacher/SET_USERID',
      clearSaveClass: 'managerClass/CLEAR_SAVECLASS',
      setWeekNameList: 'managerClass/SET_WEEKNAMELIST'
    })
  },
  components: {
    HeaderBar,
    Cell,
    CSelect,
    Scroll,
    Week
  }
}
</script>

<style scoped lang="scss">
  @import "@/style/variable.scss";
  .class-details-list{
    position: fixed;
    width: 100%;
    top: 50px;
    bottom: 0;
    transform: translate3d(0,0,0);
    .sort{
      padding: 0 13px;
      .border{
        display: flex;
        justify-content: space-between;
        letter-spacing:calc(2px/2);
        height: calc(100px/2);
        line-height: calc(100px/2);
        font-size: $header-list;
        border-bottom: 1px solid $color-line;
        input{
          width: 32px;
          margin-right: 20px;
          text-align: left;
          color: $color-text-d;
          text-indent: calc(15px/2);
          font-size: $header-list-s;
        }
      }
    }
    .list-item {
      padding: 0 calc(26px / 2);
      .left-title {
        font-size: calc(38px / 2);
        letter-spacing: calc(2px / 2);
      }
      .middle {
        display: flex;
        justify-content: space-between;
        height: calc(80px / 2);
        margin-top: calc(5px / 2);
        line-height: calc(80px / 2);
        font-size: $header-list;
        border-bottom: 1px solid $color-line;
      }
      .s-list {
        height: 200px;
        width: 100%;
      }
      .member {
        display: flex;
        height: calc(100px / 2);
        line-height: calc(100px / 2);
        align-items: center;
        border-bottom: 1px solid $color-line;;
        .m-img, .text, .mode {
        }
        .m-img {
          width: calc(86px / 2);
          height: calc(86px / 2);
          .avatar {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
          .icon {
            display: inline-block;
            width: calc(86px / 2);
            height: calc(86px / 2);
            font-size: $header-list;
            line-height: calc(86px / 2);
            text-align: center;
            border-radius: 50%;
            background: $color-background-y;
            vertical-align: text-bottom;
          }
        }
        .text {
          margin-left: calc(20px / 2);
          font-size: $header-list;
        }
        .mode {
          width: calc(80px / 2);
          height: calc(40px / 2);
          margin-left: calc(20px / 2);
          line-height: calc(40px / 2);
          text-align: center;
          color: #fff;
          font-size: $header-list-s;
          background: $green-primary-color;
          border-radius: 10px/calc(10px/2);
        }
        .expire {
          margin-left: calc(280px / 2);
          letter-spacing: calc(2px / 2);
          font-size: calc(26px / 2);
        }
      }
      .cell-msg {
        display: flex;
        justify-content: space-between;
        height: calc(100px / 2);
        line-height: calc(100px / 2);
        font-size: $header-list;
        border-bottom: 1px solid $color-line;
        .right {
          display: flex;
          div {
            height: calc(100px / 2);
          }
          .right-icon {
            display: inline-block;
            width: calc(30px / 2);
            height: calc(30px / 2);
            background: url('../../../../../assets/_images/public/right_arrow.png') no-repeat 0 0;
            background-size: 100% 100%;
            vertical-align: text-bottom;
          }
        }
      }
    }
  }
</style>
