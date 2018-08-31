<template>
  <div id="student-management" class="page" style="z-index: 1">
    <header-bar>
      <div slot="title-name">学生管理</div>
      <router-link slot="right-area" class="search" tag="i" :to="{ name: 'sSearch', params: { type: 'student'}}"></router-link>
    </header-bar>
    <router-link :to="{ name: 'waitingManagement'}" tag="div" class="s-wait" v-show="!isEdit">
      <span>待管理学生</span>
      <i class="right-arrow"></i>
    </router-link>
    <div class="s-handle">
      <div class="s-number">学生列表(<span class="s-number-red">{{total}}人</span>)</div>
    </div>
    <div class="s-lists">
      <scroll
        ref="scroll"
        :data="data"
        :pullDownRefresh="pullDownRefreshObj"
        :pullUpLoad="pullUpLoadObj"
        :pullUpLoadComplete="pullUpLoadComplete"
        :pullDownRefreshComplete="pullDownRefreshComplete"
        @pullingDown="onPullingDown(api)"
        @pullingUp="onPullingUp(api)"
        >
        <ul>
          <li v-for="(group,index) in data" :key="index" class="list-group" ref="listGroup" @click="select(group.id)">
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
import {mapGetters, mapMutations} from 'vuex'
import student from '../api/student'
import {Mscroll} from 'common/js/mixins'

export default {
  name: 'studentManagement',
  mixins: [Mscroll],
  data () {
    return {
      data: [],
      isEdit: false,
      api: student.list,
      total: ''
    }
  },
  created () {
  },
  activated() {
    // this.data = []
    // this._getDataList()
    if (!this.$route.meta.isUseCache) {
      this.data = []
      this._getDataList()
    }
    this.$route.meta.isUseCache = false
  },
  computed: {
    ...mapGetters({
      schoolId: 'managerCommon/schoolId'
    })
  },
  methods: {
    select (id) {
      this.set_userId(id)
      this.$router.push({
        path: '/manager/student/studentDetails'
      })
    },
    _getDataList () {
      this.CURRENT = 1
      student.list({
        schoolId: this.schoolId,
        current: 1,
        size: this.SIZE
      }).then(r => {
        this.data = r.page.records
        this.total = r.page.total
        this.pullDownRefreshComplete = true
        this.pullUpLoadComplete = true
      })
    },
    ...mapMutations({
      set_userId: 'managerStudent/SET_USERID'
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
  #student-management {
    .search {
      display: inline-block;
      width: calc(38px/2);
      height: calc(38px/2);
      margin-right: calc(25px/2);
      background: url('../../../../../assets/_images/public/search_state.png') no-repeat 0 0;
      background-size: 100% 100%;
      vertical-align: text-bottom;
    }
    .s-wait {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: calc(120px/2);
      padding: 0 calc(26px/2);
      border-bottom: 1px solid $color-line; /*no*/
      line-height: calc(120px/2);
      font-size: $header-title-s;
      .right-arrow {
        display: inline-block;
        width: calc(30px/2);
        height: calc(30px/2);
        background: url('../../../../../assets/_images/public/right_arrow.png') no-repeat 0 0;
        background-size: 100% 100%;
        vertical-align: text-bottom;
      }
    }
    .s-handle {
      height: calc(82px/2);
      padding: 0 calc(26px/2);
      font-size: $header-list;
      line-height: calc(82px/2);
      color: $color-text-d;
      background: $color-background;
      .s-number-red {
        color: #ff1503;
      }
    }
    .s-lists {
      position: fixed;
      top: calc(303px/2);
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
            font-size: $header-list;
            line-height: calc(86px/2);
            text-align: center;
            border-radius: 50%;
            background: $color-background-y;
            vertical-align: text-bottom;
          }
          .name {
            width: 70px;
            margin-left: calc(20px/2);
            color: $color-text;
            font-size: $header-list;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
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
            margin-left: 30px;
          }
          .right-arrow{
            display: inline-block;
            width: calc(30px/2);
            height: calc(30px/2);
            margin-left: calc(10px/2);
            background: url('../../../../../assets/_images/public/right_arrow.png') no-repeat 0 0;
            background-size: 100% 100%;
            vertical-align: text-bottom;
          }
        }
      }
    }
  }
</style>
