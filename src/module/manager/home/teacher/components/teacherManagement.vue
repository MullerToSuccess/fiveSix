<template>
  <div id="teacher-management" class="page" style="z-index: 1">
    <header-bar :newBack="newBack" @back="back">
      <div slot="title-name">教师管理</div>
      <div slot="right-area" class="right">
        <router-link slot="right-area" class="search" tag="i" :to="{ name: 'tSearch', params: { type: 'teacher'}}"></router-link>
        <span @click="toAdd">添加教师</span>
      </div>
    </header-bar>
    <div class="s-handle">
      <div class="s-number">教师列表(<span class="s-number-red">{{total}}人</span>)</div>
    </div>
    <div class="s-lists">
      <scroll
        @scroll="scroll"
        ref="scroll"
        :data="data"
        :listen-scroll="listenScroll"
        :pullDownRefresh="pullDownRefreshObj"
        :pullDownRefreshComplete="pullDownRefreshComplete"
        @pullingDown="_getDataList"
      >
        <ul>
          <li v-for="(group,index) in data" :key="index" class="list-group" ref="listGroup" @click="select(group.id)">
            <img class="avatar" v-lazy="group.photo" v-if="group.photo">
            <span class="icon" v-else>{{group.name.slice(-2)}}</span>
            <span class="name">{{group.name}}</span>
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
      </scroll>
    </div>
  </div>
</template>

<script>
import HeaderBar from 'common/components/headerBar'
import Scroll from 'common/components/scroll'
import {mapGetters, mapMutations} from 'vuex'
import teacher from '../api/teacher'
import {Mscroll} from 'common/js/mixins'

export default {
  name: 'teacherManagement',
  mixins: [Mscroll],
  data () {
    return {
      data: [],
      total: '',
      newBack: true,
      listenScroll: true
    }
  },
  created () {
  },
  activated() {
    if (!this.$route.meta.isUseCache) {
      this.data = []
      this._getDataList()
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
    back () {
      this.$router.push({
        path: '/manager/home'
      })
    },
    toAdd () {
      this.$router.push({
        path: '/manager/teacher/teacherDetails',
        query: {
          status: 1
        }
      })
    },
    select (id) {
      this.set_scrollY(this.scrollY)
      this.set_userId(id)
      this.$router.push({
        path: '/manager/teacher/teacherDetails'
      })
    },
    _getDataList () {
      teacher.list({
        schoolId: this.schoolId
      }).then(r => {
        this.pullDownRefreshComplete = true
        this.data = r.page.records
        this.total = r.page.total
        if (!this.$route.meta.isUseCache && this.$route.params.toScrollY) {
          this.$refs.scroll.scrollTo(0, this.scrollToY, 0)
          this.$route.params.toScrollY = false
        }
      })
    },
    ...mapMutations({
      set_userId: 'managerTeacher/SET_USERID',
      set_scrollY: 'managerCommon/SET_SCROLLY'
    })
  },
  components: {
    HeaderBar,
    Scroll
  }
}
</script>

<style  lang="scss" scoped>
 @import "@/style/variable.scss";
  .right{
    position: absolute;
    width: calc(200px/2);
    display: flex;
    left: calc(-120px/2);
    top: 0;
    .search{
      display: inline-block;
      width: calc(38px/2);
      height: calc(38px/2);
      margin:15px 15px 0 0;
      background: url('../../../../../assets/_images/public/search_state.png') no-repeat 0 0;
      background-size: 100% 100%;
      vertical-align: text-bottom;
    }
    span{
      font-size: $header-list-s;
    }
  }
  .s-handle{
    height: calc(82px/2);
    padding: 0 calc(26px/2);
    font-size: $header-list;
    line-height: calc(82px/2);
    color: $color-text-d;
    background: $color-background;
    .s-number-red{
      color: #ff1503;
    }
  }
  .s-lists {
   position: fixed;
   top: calc(182px/2);
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
           font-size: $header-list;
           text-align: center;
           border-radius: 50%;
           background: $color-background-y;
           vertical-align: text-bottom;
         }
         .name {
           width: 60px;
           margin-left: calc(20px/2);
           color: $color-text;
           font-size: $header-list;
           white-space:nowrap;
           overflow:hidden;
           text-overflow:ellipsis;
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
</style>
