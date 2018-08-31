<template>
  <div id="student-details" class="page" style="z-index: 3">
    <div>
      <header-bar>
        <div slot="title-name">学生详情</div>
        <i slot="right-area" class="search"></i>
      </header-bar>
      <div class="ptouchpan">
        <h2 class="status">
          <span>账号状态:&nbsp;&nbsp;</span>
          <span class="mode">{{baseInfo.status?'正常':'已停用'}}</span>
        </h2>
        <div class="details-content">
          <scroll
            ref="scroll"
            class="details-view"
            :data="details"
          >
            <div class="cell-lists">
              <cell title="照片" type="student" :value="baseInfo.photo === ''?defaultAvatar:baseInfo.photo" :mode="mode[1]" to="cEditPhoto" configName="photo"/>
              <cell title="姓名" type="student" :value="baseInfo.name" to="cFiled" configName="name"/>
              <cell title="账号" type="student" :value="baseInfo.loginnum"/>
              <cell title="班级" type="student" :content="classInfo" :mode="mode[2]" :more="more" to="sEditClass" configName="sEditClass"/>
              <cell title="课程" type="student" :content="courseInfo" :mode="mode[3]" :more="more" to="sCourse" :isSave='false'/>
              <cell title="性别" application="select" :value="baseInfo.sex==='0'?'女':'男'" configName="sex" to="sex" @popup="popup"/>
              <cell title="出生年月" application="select" :value="baseInfo.birthday | date(true)" configName="birthday" to="birthday" @popup="popup"/>
              <cell title="手机号" type="student" :value="baseInfo.mobile" to="cFiled" configName="phone"/>
              <cell title="所在学校" type="student" :value="studyInfo.school" to="sEditSchool" configName="localSchool"/>
              <cell title="年级班级" type="student" :value="gradeName+studyInfo.className" to="sEditGrade" configName="sEditGrade"/>
              <cell title="上次期末成绩" type="student" :content="studyInfo" :mode="mode[4]" :more="more" to="sEditScore" configName="sEditScore"/>
              <cell title="监护人信息" type="student" :content="familyInfo" :mode="mode[5]" :more="more" to="sEditGuardian" configName="sEditGuardian"/>
              <cell title="家庭住址" type="student" :value="baseInfo.address" to="cFiled" configName="address"/>
            </div>
          </scroll>
        </div>
        <bottom :bPath="bPath" :statusProp="baseInfo.status"></bottom>
      </div>
    </div>
    <c-select :popShow="popShow" :popData="popData" @changePop="popShow = false"></c-select>
   <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import HeaderBar from 'common/components/headerBar'
import Scroll from 'common/components/scroll'
import Cell from 'common/components/cell'
import CSelect from 'managerCommon/components/cSelect'
import Bottom from 'managerCommon/components/bottom'
import {MSelect} from 'managerCommon/js/mixin'
import {mapGetters, mapMutations, mapActions} from 'vuex'

export default {
  name: 'studentDetails',
  mixins: [MSelect],
  data () {
    return {
      defaultAvatar: require('@/assets/_images/public/my_default.png')
    }
  },
  created () {
    this.setIsCache(false)
    this._getStudentInfo()
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "studentManagement") {
      to.meta.isUseCache = !this.isCache
      next()
    } else {
      next()
    }
  },
  computed: {
    ...mapGetters({
      details: 'managerStudent/details',
      baseInfo: 'managerStudent/baseInfo',
      classInfo: 'managerStudent/classInfo',
      courseInfo: 'managerStudent/courseInfo',
      familyInfo: 'managerStudent/familyInfo',
      studyInfo: 'managerStudent/studyInfo',
      gradeName: 'managerStudent/gradeName',
      isCache: 'managerStudent/isCache'
    })
  },
  methods: {
    _getStudentInfo () {
      this.getStudentDetails().then(r => {
      })
    },
    ...mapMutations({
      setIsCache: 'managerStudent/SET_ISCACHE'
    }),
    ...mapActions({
      getStudentDetails: 'managerStudent/getStudentDetails'
    })
  },
  components: {
    HeaderBar,
    Scroll,
    Cell,
    CSelect,
    Bottom
  }
}

</script>

<style scoped lang="scss">
@import "@/style/variable.scss";
#student-details{
  font-size: $header-list;
  .ptouchpan{
    position: fixed;
    width: 100%;
    top: 50px;
    bottom: 0;
    transform: translate3d(0,0,0);
    .status{
      height: calc(72px/2);
      line-height: calc(72px/2);
      margin: 0;
      border: 0;
      font-size: 16px;
      font-weight: normal;
      vertical-align: baseline;
      padding: 0 calc(26px/2);
      background:$color-background ;
      .mode{
        color: $green-active-color;
      }
    }
    .details-content{
      position: fixed;
      top: 36px;
      bottom: calc(115px/2);
      width: 100%;
      border-top: 1px solid $color-line;
      border-bottom: 1px solid $color-line;
      .details-view{
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
    }
  }
}

</style>
