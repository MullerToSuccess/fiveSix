<template>
  <div id="add-class" class="page" style="z-index: 2">
    <header-bar :newBack="newBack" @back="back">
      <div slot="title-name">班级添加</div>
      <div slot="right-area" @click="save">
        <span class="page-right-save">保存</span>
      </div>
    </header-bar>
    <div class="ptouchpan">
      <div class="top">
        <div class="c-course">
          <div class="c-c-title">
            <i class="icon"></i>
            <span>课程管理</span>
          </div>
          <div class="c-c-tabs">
            <van-tabs type="card" swipeable @click="selectTab">
              <van-tab v-for="(item, index) in tabLists" :key="index" :title="item.courseName">
              </van-tab>
            </van-tabs>
          </div>
        </div>
        <div class="c-name">
          <div class="c-n-title">
            <i class="icon"></i>
            <span>班级名称</span>
          </div>
          <div class="c-n-input">
            <input ref="className" type="text" v-model="className" placeholder="请输入班级名称">
          </div>
        </div>
      </div>
      <div class="bottom">
        <cell title="课程开始时间" :value="saveClass.startTime" application="select" to="date_time-start" configName="startTime" @popup="popup"/>
        <cell title="课程结束时间" :value="saveClass.endTime" application="select" to="date_time-end" configName="endTime" @popup="popup"/>
        <cell title="开课周期" :value="weekNameList.join(',')" application="select" to="date_week" configName="week" @popup="weekShow = true"/>
        <div class="sort">
          <div class="border">
            <div class="label">班级排序</div>
            <div class="input">
              <input class="blur-text" type="text" v-model="sortValue" placeholder="请填写班级排序">
            </div>
          </div>
        </div>
        <div class="select-teacher">
          <router-link class="cell-msg" tag="div" :to="{name:'aSelectTeacher'}">
            <div>选择任教老师</div>
            <div class="right">
              <div class="teacher-name">
                <span v-for="(item,index) in saveClass.teacherList" :key="index">{{index===saveClass.teacherList.length-1?item.name:item.name+'、'}}</span>
              </div>
              <div>
                <i class="right-icon"></i>
              </div>
            </div>
          </router-link>
        </div>
        <cell title="人数上限" :value="maxNumber+'名学生'"/>
      </div>
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
import classAPI from '../api/class'
import {mapGetters, mapMutations} from 'vuex'
import {Toast} from 'vant'
import Week from './week'
export default {
  name: 'addClass',
  mixins: [MSelect, week],
  data () {
    return {
      maxNumber: 15,
      addTeacher: true,
      tabLists: [],
      tabId: '',
      weekShow: false,
      isCache: false,
      newBack: true,
      name: '',
      clickflag: true
    }
  },
  created () {
    this._getCourseList()
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "classManagement") {
      to.meta.isUseCache = !this.isCache
      next()
    } else {
      next()
    }
  },
  computed: {
    className: {
      get () {
        return this.name
      },
      set (val) {
        this.setSaveClass({className: val})
      }
    },
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
      saveClass: 'managerClass/saveClass',
      weekNameList: 'managerClass/weekNameList'
    })
  },
  methods: {
    back () {
      this.isCache = false
      this.$router.back(-1)
    },
    selectTab (index, title) {
      this.tabId = this.tabLists[index].id
      this.name = title
      this.$refs.className.focus()
      this.setSaveClass({courseId: this.tabId, className: title})
    },
    save () {
      let json = {
        courseId: '您还没有选取课程',
        className: '您还没有填写班级名称',
        startTime: '您还没有填写课程开始时间',
        endTime: '您还没有填写课程结束时间',
        week: '您还没有填写开课周期'
      }
      let judgArr = []
      for (let key in json) {
        if (!this._jugeKey(this.saveClass, key)) judgArr.push(json[key])
      }
      if (judgArr.length !== 0) {
        Toast(`${judgArr[0]}`)
      } else {
        if (!this.clickflag) return
        this.clickflag = false
        delete this.saveClass.teacherList
        let date = {
          startTime: this.saveClass.startTime + ':00',
          endTime: this.saveClass.endTime + ':00'
        }
        let params = Object.assign({schoolId: this.schoolId, studentLimit: 15}, this.saveClass, date)
        classAPI.save(params).then(r => {
          Toast(`添加班级成功`)
          this.isCache = true
          setTimeout(() => {
            this.clickflag = true
            this.$router.back(-1)
          }, 300)
        })
      }
    },
    _jugeKey (obj, key) {
      return obj && obj.hasOwnProperty(key) && obj[key] !== ''
    },
    _getCourseList () {
      classAPI.getCourseList({
        schoolId: this.schoolId
      }).then(r => {
        this.tabLists = r.page
        this.tabId = this.tabLists[0].id
        this.name = this.tabLists[0].courseName
        this.$refs.className.focus()
        this._initSaveClass()
      })
    },
    _initSaveClass () {
      this.clearSaveClass()
      this.setWeekNameList(['周一'])
      let json = {
        className: this.tabLists[0].courseName,
        startTime: '16:00',
        endTime: '18:00',
        sortValue: 50,
        week: 1,
        courseId: this.tabId
      }
      this.setSaveClass(json)
    },
    ...mapMutations({
      setSaveClass: 'managerClass/SET_SAVECLASS',
      clearSaveClass: 'managerClass/CLEAR_SAVECLASS',
      setWeekNameList: 'managerClass/SET_WEEKNAMELIST'
    })
  },
  components: {
    HeaderBar,
    Cell,
    CSelect,
    Week
  }
}
</script>

<style scoped lang="scss">
  @import "@/style/variable.scss";
  .ptouchpan{
    position: fixed;
    width: 100%;
    top: 50px;
    bottom: 0;
    transform: translate3d(0,0,0);
    .top{
      padding: 0 calc(26px/2);
      .c-course,.c-name{
        border-bottom: 1px solid $color-line;
      }
      .c-course{
        .c-c-title{
          height: calc(100px/2);
          line-height: calc(100px/2);
          font-size: $header-title-s;
        }
        .c-c-tabs{
          height: calc(100px/2);
        }
      }
      .c-name{
        .c-n-title{
          height: calc(100px/2);
          line-height: calc(100px/2);
          font-size: $header-title-s;
        }
        .c-n-input{
          input{
            width: 100%;
            height: calc(100px/2);
            font-size: $header-list-s;
            letter-spacing: calc(2px/2);
            text-indent: calc(16px/2);
          }
        }
      }
      .icon{
        display: inline-block;
        width: calc(42px/2);
        height: calc(42px/2);
        margin-right:calc(5px/2);
        background: url('../../../../../assets/_images/public/icon_divide_class.png') no-repeat 0 0;
        background-size: 100% 100%;
        vertical-align: text-bottom;
      }
    }
    .bottom {
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
      .select-teacher{
        padding: 0 calc(26px/2);
        .cell-msg{
          display: flex;
          justify-content: space-between;
          height: calc(100px/2);
          line-height: calc(100px/2);
          font-size: $header-list;
          border-bottom: 1px solid $color-line;
          .right{
            display: flex;
            div{
              height: calc(100px/2);
            }
            .teacher-name{
              text-align: right;
              width: calc(400px/2);
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
              color: #888888;
            }
            .right-icon{
              display: inline-block;
              width: calc(30px/2);
              height: calc(30px/2);
              background: url('../../../../../assets/_images/public/right_arrow.png') no-repeat 0 0;
              background-size: 100% 100%;
              vertical-align: text-bottom;
            }
          }
        }
      }
    }
  }
</style>
