<template>
  <div id="search" class="page" style="z-index: 2">
    <header-bar>
      <div slot="title-name">搜索</div>
    </header-bar>
    <div class="input-box">
      <i class="login-input-icon"></i>
      <input ref="search" class="login-input" :placeholder="placeholder" v-model="searchVal" @input="on_input" @compositionstart="compositionstart" @compositionend="compositionend">
      <i class="clear-icon" @click="deleteVal"></i>
    </div>
    <div class="s-lists">
      <scroll ref="scroll"
              :data="data"
              :pullDownRefresh="pullDownRefreshObj"
              :pullUpLoad="pullUpLoadObj"
              :pullUpLoadComplete="pullUpLoadComplete"
              :pullDownRefreshComplete="pullDownRefreshComplete"
              @pullingDown="onPullingDown(api, {keyword: searchVal})"
              @pullingUp="onPullingUp(api, {keyword: searchVal})">
          <ul v-if="$route.params.type === 'teacher'">
            <li v-for="(group,index) in data" :key="index" class="list-group" ref="listGroup" @click="select(group.id,group.classNameList)">
              <img class="avatar" v-lazy="group.photo" v-if="group.photo">
              <span class="icon" v-else>{{group.name.slice(-2)}}</span>
              <span class="name">{{group.name.slice(0,1)}}老师</span>
              <div class="class-lists">
              <span>
                {{group.classNameList.length}}个班
              </span>
                <span class="class">
                {{group.classNameList.join('、')}}
              </span>
              </div>
              <i class="right-arrow"></i>
            </li>
          </ul>
          <ul v-else>
            <li v-for="(group,index) in data" :key="index" class="list-group" ref="listGroup" @click="select(group.id,group.classNameList)">
              <img class="avatar" v-lazy="group.photo" v-if="group.photo">
              <span class="icon" v-else>{{group.name.slice(-2)}}</span>
              <span class="name">{{group.name}}</span>
              <div class="class-lists">
              <span class="class">
                {{group.classNameList.join('、')}}
              </span>
              </div>
              <i class="right-arrow"></i>
            </li>
          </ul>
      </scroll>
    </div>
  </div>
</template>

<script>
import HeaderBar from 'common/components/headerBar'
import Scroll from 'common/components/scroll'
import studentAPI from 'managerHome/student/api/student'
import teacherAPI from 'managerHome/teacher/api/teacher'
import {mapGetters, mapMutations} from 'vuex'
import {Mscroll} from 'common/js/mixins'
import {debounce} from 'managerCommon/js/const'

export default {
  name: 'search',
  mixins: [Mscroll],
  data () {
    return {
      data: [],
      searchVal: '',
      placeholder: '',
      api: '',
      flag: true,
      path: '',
      setId: '',
      timer: null
    }
  },
  created () {
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === "studentDetails" || from.name === "studentManagement") {
      to.meta.isUseCache = true
      next(vm => {
        vm.placeholder = '请输入学生姓名'
        vm.api = studentAPI.list
        vm.path = '/manager/student/studentDetails'
        vm.setId = vm.set_studentId
      })
    } else if (from.name === "teacherDetails" || from.name === "teacherManagement") {
      next(vm => {
        vm.placeholder = '请输入老师姓名'
        vm.api = teacherAPI.list
        vm.path = '/manager/teacher/teacherDetails'
        vm.setId = vm.set_teacherId
      })
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "studentManagement" || to.name === "teacherManagement") {
      to.meta.isUseCache = true
      next()
    } else {
      next()
    }
  },
  computed: {
    ...mapGetters({
      schoolId: 'managerCommon/schoolId'
    })
  },
  methods: {
    compositionstart () {
      this.flag = false
    },
    compositionend () {
      this.flag = true
    },
    on_input () {
      if (this.flag) {
        this._debounce(this._getapi, 300)()
      }
    },
    select (id) {
      this.setId(id)
      this.$router.push({
        path: this.path
      })
      this.$refs.search.blur()
    },
    deleteVal () {
      this.searchVal = ''
    },
    _getapi () {
      this._getList(this.api)
    },
    _getList (api) {
      this.CURRENT = 1
      api({
        schoolId: this.schoolId,
        keyword: this.searchVal,
        current: this.CURRENT,
        size: this.SIZE
      }).then(r => {
        this.data = r.page.records
        this.pullDownRefreshComplete = true
        this.pullUpLoadComplete = true
      })
    },
    _debounce(func, delay) {
      let self = this
      return function (...args) {
        if (self.timer) {
          clearTimeout(self.timer)
        }
        self.timer = setTimeout(() => {
          func.apply(this, args)
        }, delay)
      }
    },
    ...mapMutations({
      set_studentId: 'managerStudent/SET_USERID',
      set_teacherId: 'managerTeacher/SET_USERID'
    })
  },
  components: {
    HeaderBar,
    Scroll
  }
}
</script>

<style lang="scss" scoped>
 @import "@/style/variable.scss";
  #search{
    .input-box{
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: calc(100px/2);
      padding: 5px 13px;
      box-sizing: border-box;
      .login-input-icon{
        display: inline-block;
        width: calc(38px/2);
        height: calc(38px/2);
        background: url('../../../../assets/_images/public/search.png') no-repeat 0 0;
        background-size: 100% 100%;
        vertical-align: text-bottom
      }
      input{
        width: 90%;
        font-size: $header-list;
        letter-spacing: calc(2px/2);
        padding: calc(4px/2);
      }
      .clear-icon{
        display: inline-block;
        width: calc(28px/2);
        height: calc(28px/2);
        background: url('../../../../assets/_images/public/search_delete.png') no-repeat 0 0;
        background-size: 100% 100%;
        vertical-align: text-bottom
      }
    }
    .s-lists {
      position: fixed;
      top: calc(200px/2);
      bottom: 0;
      width: 100%;
      border-top: 1px solid $color-line;
      ul{
        padding: 0 calc(26px/2);
        letter-spacing: calc(2px/2);
        .list-group {
          display: flex;
          height: calc(100px/2);
          line-height: calc(100px/2);
          border-bottom: 1px solid $color-line;
          align-items: center;
          .avatar {
            width: calc(86px/2);
            height: calc(86px/2);
            border-radius: 50%;
          }
          .icon{
            display: inline-block;
            width: calc(86px/2);
            height: calc(86px/2);
            line-height: calc(86px/2);
            text-align: center;
            border-radius: 50%;
            background: $color-background-y;
            vertical-align: text-bottom;
          }
          .name {
            width: calc(100px/2);
            margin-left: calc(20px/2);
            color: $color-text;
            font-size: $header-list;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .class-lists{
            display: inline-block;
            height: 100%;
            width: calc(350px/2);
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
            font-size:$header-list-s;
            color: $color-text-d;
            margin-left: calc(100px/2);
          }
          .right-arrow{
            display: inline-block;
            width: calc(30px/2);
            height: calc(30px/2);
            margin-left: calc(10px/2);
            background: url('../../../../assets/_images/public/right_arrow.png') no-repeat 0 0;
            background-size: 100% 100%;
            vertical-align: text-bottom;
          }
        }
      }
    }
  }
</style>
