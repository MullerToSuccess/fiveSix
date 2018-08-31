<template>
  <div id="class-management" class="page" style="z-index: 1">
    <header-bar>
      <div slot="title-name">班级管理</div>
      <div slot="right-area">
        <router-link class="page-right-save" :to="{ name: 'addClass'}" tag="div">添加</router-link>
      </div>
    </header-bar>
    <div class="classes-content">
      <scroll
        @scroll="scroll"
        ref="scroll"
        :data="data"
        :listen-scroll="listenScroll"
        :pullDownRefresh="pullDownRefreshObj"
        :pullDownRefreshComplete="pullDownRefreshComplete"
        @pullingDown="_getClassList"
      >
        <div>
          <div v-for="(item1,index1) in data" class="classes" :key="index1">
            <div class="class-title">
              <i></i>
              <span>{{item1.courseName}}</span>
            </div>
            <div class="no-class" v-if="item1.classList.length === 0">该课程下暂无班级</div>
            <div class="class-lists" v-for="(item2,index2) in item1.classList" :key="index2" @click="select(item2.classId)">
              <div class="top">
                <span>{{item2.className}}</span>
              </div>
              <div class="teacher-content">老师：{{item2.teacherName.join('、')}}</div>
              <div>班级人数: {{item2.studentCount}}</div>
              <div>人数限制: {{item2.studentLimit}}</div>
            </div>
          </div>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
import HeaderBar from 'common/components/headerBar'
import Scroll from 'common/components/scroll'
import classApi from '../api/class'
import {mapGetters, mapMutations} from 'vuex'
import {Mscroll} from 'common/js/mixins'

export default {
  name: 'classManagement',
  mixins: [Mscroll],
  data () {
    return {
      data: [],
      listenScroll: true
    }
  },
  created () {
  },
  activated() {
    if (!this.$route.meta.isUseCache) {
      this.data = []
      this._getClassList()
    }
    this.$route.meta.isUseCache = false
  },
  computed: {
    ...mapGetters({
      schoolId: 'managerCommon/schoolId',
      scrollToY: 'managerCommon/scrollY'
    })
  },
  methods: {
    select (id) {
      this.setClassId(id)
      this.set_scrollY(this.scrollY)
      this.$router.push({
        name: 'classDetails'
      })
    },
    _getClassList () {
      classApi.list({
        schoolId: this.schoolId
      }).then(r => {
        this.data = r.page.records
        this.pullDownRefreshComplete = true
        if (!this.$route.meta.isUseCache && this.$route.params.toScrollY) {
          this.$refs.scroll.scrollTo(0, this.scrollToY, 0)
          this.$route.params.toScrollY = false
        }
      })
    },
    ...mapMutations({
      setClassId: 'managerClass/SET_CLASSID',
      set_scrollY: 'managerCommon/SET_SCROLLY'
    })
  },
  components: {
    HeaderBar,
    Scroll
  }
}
</script>

<style scoped lang="scss">
 @import "@/style/variable.scss";
  .classes-content{
    position: fixed;
    top: calc(100px/2);
    bottom: 0;
    width: 100%;
    .classes{
      padding: 0 calc(26px/2);
      .class-title{
        display: flex;
        height: calc(80px/2);
        align-items: center;
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
        .teacher-content{
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .top{
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
  }
</style>
