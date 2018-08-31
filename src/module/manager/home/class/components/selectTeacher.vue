<template>
  <transition name="slide">
    <v-touch
      @panstart="onPanStart"
      @panend="onPanEnd"
      @pan="onPan"
      tag="div"
      id="select-teacher"
      class="touchpan"
    >
      <header-bar :newBack="newBack" @back="back">
        <div slot="title-name">选择教师</div>
        <span class="page-right-save" slot="right-area" @click="save">保存</span>
      </header-bar>
      <div class="input-box">
        <i class="login-input-icon"></i>
        <input class="login-input" placeholder="请输入老师姓名" v-model="searchVal" @input="on_input" @compositionstart="compositionstart" @compositionend="compositionend">
        <i class="clear-icon" @click="clear"></i>
      </div>
      <div class="s-lists">
        <scroll ref="scroll"
                :data="data"
                :pullDownRefresh="pullDownRefreshObj"
                :pullDownRefreshComplete="pullDownRefreshComplete"
                @pullingDown="_getTeacherList"
        >
          <div class="list">
            <div class="member" v-for="(item,index) in data" :key="index" @click="selectTeacher(index, item.id)">
              <div class="m-img">
                <img class="avatar" v-lazy="item.photo" v-if="item.photo">
                <span class="icon" v-else>{{item.name.slice(-2)}}</span>
              </div>
              <span class="text">{{item.name}}</span>
              <i ref="radioIcon" :style="{'backgroundImage':item.isHave ? 'url(' + require('@/assets/_images/public/select_in.png') + ')':''}"></i>
            </div>
          </div>
        </scroll>
      </div>
    </v-touch>
  </transition>
</template>

<script>
import classAPI from '../api/class'
import HeaderBar from 'common/components/headerBar'
import Scroll from 'common/components/scroll'
import {mapGetters, mapMutations} from 'vuex'
import {Mscroll, Mpan} from 'common/js/mixins'

export default {
  name: 'selectTeacher',
  mixins: [Mscroll, Mpan],
  data () {
    return {
      data: [],
      searchVal: '',
      checkBox: [],
      SIZE: 20,
      flag: true,
      timer: null
    }
  },
  created () {
    this._getTeacherList()
  },
  computed: {
    params () {
      if (this.$route.name === 'aSelectTeacher') {
        if (this.searchVal === '') {
          return {}
        } else {
          return {keyword: this.searchVal}
        }
      } else {
        if (this.searchVal === '') {
          return {classId: this.classId}
        } else {
          return {keyword: this.searchVal, classId: this.classId}
        }
      }
    },
    ...mapGetters({
      schoolId: 'managerCommon/schoolId',
      classId: 'managerClass/classId',
      saveClass: 'managerClass/saveClass'
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
      if (this.flag) this._debounce(this._getTeacherList, 300)()
    },
    clear () {
      this.searchVal = ''
      this._getTeacherList()
    },
    selectTeacher (index, id) {
      let idIndex = this.checkBox.indexOf(id)
      if (idIndex >= 0) {
        this.checkBox.splice(idIndex, 1)
        this.$refs.radioIcon[index].style.backgroundImage = ''
      } else {
        this.checkBox.push(id)
        this.$refs.radioIcon[index].style.backgroundImage = 'url(' + require('@/assets/_images/public/select_in.png') + ')'
      }
    },
    save () {
      let arr = this.checkBox
      let teacherList = []
      if (this.$route.name === 'aSelectTeacher') {
        this.data.forEach((v1, i) => {
          arr.forEach((v2, i) => {
            if (v2 === v1.id) teacherList.push(v1)
          })
        })
      } else {
        this.data.forEach((v1, i) => {
          arr.forEach((v2, i) => {
            if (v2 === v1.id) teacherList.push(v1)
          })
        })
      }
      arr.filter(ele => {
        return ele !== ''
      })
      this.setSaveClass({teacherId: arr.join(','), teacherList: teacherList})
      this.back()
    },
    _getTeacherList () {
      let api, json
      let str = this.searchVal === '' ? {} : {keyword: this.searchVal}
      if (this.$route.name === 'aSelectTeacher') {
        api = classAPI.getTeacherList
        json = Object.assign({}, {schoolId: this.schoolId}, str)
      } else {
        api = classAPI.getClassTeacherList
        this.checkBox = this.saveClass.teacherId.split(',')
        json = Object.assign({}, {schoolId: this.schoolId, classId: this.classId}, str)
      }
      api(json).then(r => {
        this.pullDownRefreshComplete = true
        this.data = r.page
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
      setSaveClass: 'managerClass/SET_SAVECLASS'
    })
  },
  watch: {
    data (newVal) {
      if (this.saveClass.teacherList) {
        if (this.$route.name === 'aSelectTeacher') {
          if (this.saveClass.teacherList.length !== 0) {
            this.checkBox = this.saveClass.teacherId.split(',')
          }
        }
        this.saveClass.teacherList.forEach((v, i) => {
          this.data.forEach(item => {
            if (v.id === item.id) item.isHave = 1
          })
        })
      }
    }
  },
  components: {
    HeaderBar,
    Scroll
  }
}
</script>

<style lang="scss" scoped>
  @import "@/style/variable.scss";

  .slide-enter-active, .slide-leave-active {
    transition: all 0.5s;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }

  #select-teacher {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: #fff;
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
        background: url('../../../../../assets/_images/public/search.png') no-repeat 0 0;
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
        background: url('../../../../../assets/_images/public/search_delete.png') no-repeat 0 0;
        background-size: 100% 100%;
        vertical-align: text-bottom
      }
    }
    .s-lists{
      position: fixed;
      top: calc(200px/2);
      bottom: 0;
      width: 100%;
      .list{
        padding: 0 calc(26px/2);
        .member{
          position: relative;
          display: flex;
          height: calc(100px/2);
          line-height: calc(100px/2);
          align-items: center;
          border-bottom: 1px solid $color-line;;
          .m-img,.text,.mode{
          }
          .m-img{
            width: calc(86px/2);
            height: calc(86px/2);
            img{
              width: 100%;
              height: 100%;
              border-radius:50% ;
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
          }
          .text{
            margin-left: calc(20px/2);
            font-size: $header-list;
          }
          /*.mode{
            width: calc(80px/2);
            height: calc(40px/2);
            margin-left: calc(20px/2);
            line-height: calc(40px/2);
            text-align: center;
            color: #fff;
            font-size: $header-list-s;
            background: $green-primary-color;
            border-radius: 10px/calc(10px/2);
          }*/
          i{
            position: absolute;
            right: 0;
            display: inline-block;
            width: calc(34px/2);
            height: calc(34px/2);
            background-image: url('../../../../../assets/_images/public/select_out.png');
            background-repeat: no-repeat;
            background-position: 0 0;
            background-size: 100% 100%;
            vertical-align: text-bottom;
          }
        }
      }
    }
  }
</style>
