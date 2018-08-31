<template>
  <div id="waiting-management" class="page" style="z-index: 2">
    <header-bar>
      <div slot="title-name">待管理学生</div>
      <div slot="right-area">
      </div>
    </header-bar>
    <div class="s-handle">
      <div class="s-number">学生列表(<span class="s-number-red">{{total?total:0}}</span>人)</div>
      <div class="s-number">已选学生(<span class="s-number-red">{{checkboxLists.length}}</span>人)</div>
    </div>
    <van-tabs v-model="active" @click="selectTab">
      <van-tab v-for="(item1,index1) in tabLists" :key="index1" :title="item1.courseName">
        <div class="tab-lists">
          <scroll
            :ref="'scroll'+index1"
            :data="viewLists"
            :pullDownRefresh="pullDownRefreshObj"
            :pullUpLoad="pullUpLoadObj"
            :pullUpLoadComplete="pullUpLoadComplete"
            :pullDownRefreshComplete="pullDownRefreshComplete"
            @pullingDown="onPullingDown()"
            @pullingUp="onPullingUp()"
            >
            <div>
              <div v-if="isHaveStudent" class="noHaveStudent">当前课程下暂无待管理学生</div>
              <div v-else class="tab" v-for="(item2,index2) in viewLists" :key="index2" @click="select(item1.courseName,index1,index2,item2.id)">
                <div class="tab-content">
                  <div class="tab-photo">
                    <img class="avatar" v-lazy="item2.photo" v-if="item2.photo">
                    <span class="icon" v-else>{{item2.name.slice(-2)}}</span>
                  </div>
                  <div class="tab-text">
                    <div>
                      <span class="name">{{item2.name}}</span>
                      <span class="loginnum">({{item2.loginnum}})</span>
                    </div>
                    <div style="display: flex">
                      <div>
                        <span>课程:</span>
                      </div>
                      <div>
                        <span class="time">({{item2.validStart | date}}~{{item2.validEnd | date}})</span>
                      </div>
                    </div>
                  </div>
                  <div class="tab-icon">
                    <i :ref="'checkbox'+index1"></i>
                  </div>
                </div>
              </div>
            </div>
          </scroll>
        </div>
      </van-tab>
    </van-tabs>
    <div class="btn" @click="divideClass">
      <div class="btn-m">分班</div>
    </div>
  </div>
</template>

<script>
import HeaderBar from 'common/components/headerBar'
import {waitingManagement} from 'managerCommon/js/const'
import Scroll from 'common/components/scroll'
import {mapGetters} from 'vuex'
import student from '../api/student'
import {Toast} from 'vant'
export default {
  name: 'waitingManagement',
  data () {
    return {
      viewLists: [],
      active: '',
      checkboxLists: [],
      tabLists: [],
      id: '',
      pullDownRefresh: true,
      pullDownRefreshThreshold: 90,
      pullDownRefreshStop: 40,
      pullUpLoad: true,
      pullUpLoadThreshold: 0,
      pullUpLoadComplete: false, //  保证数据加载完成后在显示下拉div
      pullDownRefreshComplete: false, //  保证数据加载完成后在显示上拉div
      pullUpLoadMoreTxt: '上拉加载更多',
      pullUpLoadNoMoreTxt: '没有更多数据了',
      CURRENT: 1,
      SIZE: 20,
      total: '',
      courseId: '',
      index: 0,
      isHaveStudent: false
    }
  },
  activated() {
    if (!this.$route.meta.isUseCache) {
      this.viewLists = []
      this._initCheckboxLists()
    }
    this.$route.meta.isUseCache = false
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "studentManagement" && !this.$route.meta.isBackCache) {
      to.meta.isUseCache = true
      next()
    } else {
      next()
    }
  },
  computed: {
    pullDownRefreshObj: function () {
      return this.pullDownRefresh ? {
        threshold: parseInt(this.pullDownRefreshThreshold),
        stop: parseInt(this.pullDownRefreshStop),
        txt: '已是最新数据'
      } : false
    },
    pullUpLoadObj: function () {
      return this.pullUpLoad ? {
        threshold: parseInt(this.pullUpLoadThreshold),
        txt: {more: this.pullUpLoadMoreTxt, noMore: this.pullUpLoadNoMoreTxt}
      } : false
    },
    ...mapGetters({
      schoolId: 'managerCommon/schoolId'
    })
  },
  methods: {
    selectTab (index) {
      this.index = index
      this.courseId = this.tabLists[index].id
      this.pullDownRefreshComplete = false
      this.pullUpLoadComplete = false
      this.checkboxLists = []
      this.viewLists = []
      student.getNoClassStudentList({
        schoolId: this.schoolId,
        courseId: this.tabLists[index].id,
        current: this.CURRENT,
        size: this.SIZE
      }).then(r => {
        this.id = this.tabLists[index].id
        this.viewLists = r.page.records
        this.isHaveStudent = this.viewLists.length === 0
        this.total = r.page.total
        setTimeout(() => {
          this.pullDownRefreshComplete = true
          this.pullUpLoadComplete = true
        }, 20)
      })
    },
    select (key, index1, index2, id) {
      let checkbox = `checkbox${index1}`
      let idIndex = this.checkboxLists.indexOf(id)
      if (idIndex >= 0) {
        this.checkboxLists.splice(idIndex, 1)
        this.$refs[checkbox][index2].style.backgroundImage = ''
      } else {
        this.checkboxLists.push(id)
        this.$refs[checkbox][index2].style.backgroundImage = 'url(' + require('@/assets/_images/public/select_in.png') + ')'
      }
    },
    divideClass () {
      if (this.checkboxLists.length === 0) {
        Toast(`请先选择学生再进行分班`)
      } else {
        this.$router.push({
          name: 'divideClass',
          params: {
            id: this.id,
            userId: this.checkboxLists.join(',')
          }
        })
      }
    },
    onPullingDown() {
      // 模拟更新数据
      console.log('pulling down and load data')
      this.CURRENT = 1
      student.getNoClassStudentList({
        schoolId: this.schoolId,
        courseId: this.id,
        current: 1,
        size: this.SIZE
      }).then(r => {
        if (r.page.records.length !== 0) {
          this.viewLists = r.page.records
        } else {
          // 如果没有新数据
          this.$refs[`scroll${this.index}`][0].forceUpdate()
        }
      })
    },
    onPullingUp() {
      // 更新数据
      console.log('pulling up and load data')
      student.getNoClassStudentList({
        schoolId: this.schoolId,
        courseId: this.id,
        current: ++this.CURRENT,
        size: this.SIZE
      }).then(r => {
        if (r.page.records.length !== 0) {
          this.viewLists = this.viewLists.concat(r.page.records)
        } else {
          // 如果没有新数据
          this.CURRENT--
          this.$refs[`scroll${this.index}`][0].forceUpdate()
        }
      })
    },
    _initCheckboxLists () {
      student.getNoClassStudentList({
        schoolId: this.schoolId,
        current: 1,
        size: this.SIZE
      }).then(r => {
        this.tabLists = r.courseList
        this.viewLists = r.page.records
        this.isHaveStudent = this.viewLists.length === 0
        this.total = r.page.total
        this.id = this.tabLists[0].id
        this.index = 0
        this.active = 0
        setTimeout(() => {
          this.pullDownRefreshComplete = true
          this.pullUpLoadComplete = true
        }, 20)
      })
    }
  },
  watch: {
  },
  components: {
    HeaderBar,
    Scroll
  }
}
</script>

<style lang="scss" scoped>
 @import "@/style/variable.scss";
  .s-handle{
    display: flex;
    justify-content: space-between;
    height: calc(82px/2);
    padding: 0 calc(26px/2);
    font-size:$header-list;
    line-height: calc(82px/2);
    color: $color-text-d;
    background: $color-background;
  .s-number-red{
    color: #ff1503;
    }
  }
  .tab-lists{
    position: fixed;
    width: 100%;
    top: calc(282px/2);
    bottom: calc(115px/2);
    background: $color-background;
    .noHaveStudent{
      padding-top: 100px;
      text-align: center;
      font-size: 26px;
      color: $color-text-d;
    }
    .tab{
        padding: 0 calc(26px/2);
        background: #fff;
        .tab-content{
          display: flex;
          justify-content: space-between;
          height: calc(220px/2);
          border-bottom: 1px solid $color-line;
          .tab-photo{
            width: calc(86px/2);
            height: calc(86px/2);
            margin-top: calc(40px/2);
            img{
              width: 100%;
              height: 100%;
              border-radius:50% ;
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
          }
          .tab-text{
            margin-left: calc(-80px/2);
            margin-top: calc(70px/2);
            font-size: $header-list-s;
            letter-spacing: calc(2px/2);
            div{
              margin-bottom: calc(20px/2);
            }
            .user,.course,.time,.loginnum{
              color: $color-text-d;
            }
          }
          .tab-icon{
            display: flex;
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
          }
        }
      }
  }
  .btn{
    display: flex;
    position: fixed;
    width: 100%;
    height: calc(115px/2);
    bottom: 0;
    background: #fff;
    justify-content: center;
    align-items: center;
    .btn-m{
      width: calc(420px/2);
      height: calc(90px/2);
      line-height: calc(90px/2);
      text-align: center;
      font-size: calc(34px/2);
      letter-spacing: calc(2px/2);
      color: #fff;
      background:$green-primary-color ;
      border-radius: calc(34px/2)/calc(42px/2);
    }
  }
</style>
