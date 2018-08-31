<template>
  <div id="teacher-details" class="page" style="z-index: 2">
    <div>
      <header-bar>
        <div slot="title-name">教师详情</div>
        <span class="page-right-save" v-show="status !== 'normal'" slot="right-area" @click="add">保存</span>
      </header-bar>
      <div class="ptouchpan">
        <h2 class="status" v-show="status === 'normal'">
          <span>账号状态：</span>
          <span class="mode">{{baseInfo.status?'正常':'已停用'}}</span>
        </h2>
        <div :class="{'details-content-add':addShow}" class="details-content" :style="resetoff">
          <scroll
            id="test-div"
            ref="scroll"
            :tap="tap"
            class="details-view"
            :data="isAddStatus ?addTeacher:teacherDetails">
            <div class="cell-lists">
              <cell title="照片" :value="isAddStatus ? (addTeacher.photoUrl === '' ||  !addTeacher.photoUrl ? defaultAvatar :addTeacher.photoUrl):(baseInfo.photo === '' ? defaultAvatar:baseInfo.photo)" :mode="mode[1]" to="cEditPhoto" configName="photo"/>
              <cell title="姓名" :value="isAddStatus ?addTeacher.name:baseInfo.name" :application="status" to="cFiled" configName="name" @onfocus="onfocus" @onblur="onblur"/>
              <cell title="账号" :value="isAddStatus ?addTeacher.loginnum:baseInfo.loginnum" :application="status" configName="user" @onfocus="onfocus" @onblur="onblur"/>
              <cell title="手机号" :value="isAddStatus ?addTeacher.mobile:baseInfo.mobile" :application="status" to="cFiled" configName="phone" @onfocus="onfocus" @onblur="onblur"/>
              <cell title="任教班级" :content="isAddStatus ?addTeacher.classNameList:classInfo" :mode="mode[2]" :more="more" to="tEditClass" configName="tEditClass"/>
              <cell title="身份证" :value="isAddStatus ?addTeacher.idNumber:baseInfo.idNumber" :application="status" to="cFiled" configName="cardId" @onfocus="onfocus" @onblur="onblur"/>
              <cell title="性别" :value="isAddStatus ? (addTeacher.sex==='0'?'女':'男') : (baseInfo.sex==='0'?'女':'男')" application="select" to="sex" configName="sex" @popup="popup"/>
              <cell title="出生年月" :value="(isAddStatus ? addTeacher.birthday : baseInfo.birthday) | date(true)" application="select" to="date_year-month" configName="birthday" @popup="popup"/>
              <cell title="政治面貌" :value="isAddStatus ?addTeacher.political:teacherInfo.political" application="select" to="political" configName="political" @popup="popup"/>
              <cell title="户籍所在" :value="householdAddressName" application="select" to="householdAddress" configName="householdAddress" @popup="popup"/>
              <cell title="学历" :value="degreeName" application="select" to="degree" configName="degree" @popup="popup"/>
              <cell title="毕业院校" :value="isAddStatus ?addTeacher.graduateSchool:teacherInfo.graduateSchool" :application="status" to="cFiled" configName="graduate"/>
              <cell title="所学专业" :value="isAddStatus ?addTeacher.professional:teacherInfo.professional" :application="status" to="cFiled" configName="professional"/>
              <cell title="教师资格证" :content="isAddStatus ?(addTeacher.teacherQcUrl === '' || !addTeacher.teacherQcUrl ? defaultTeacherQC:addTeacher.teacherQcUrl):(teacherInfo.teacherQc === ''?defaultTeacherQC:teacherInfo.teacherQc)" :mode="mode[6]" :more="more" to="cEditPhoto" configName="teacherQc"/>
              <cell title="所授学科" :value="isAddStatus ?addTeacher.teach:teacherInfo.teach" configName="tSubject" to="tSubject"/>
              <cell title="个人简介" :content="isAddStatus ?addTeacher.profile:teacherInfo.profile" :mode="mode[7]" :more="more" :application="status" to="cFiled" configName="resume" @onfocus="onfocus" @onblur="onblur"/>
              <cell title="邮箱" :value="isAddStatus ?addTeacher.email:baseInfo.email" :application="status" to="cFiled" configName="email" @onfocus="onfocus" @onblur="onblur"/>
              <cell title="家庭住址" :value="isAddStatus ?addTeacher.address:baseInfo.address" :application="status" to="cFiled" configName="address" @onfocus="onfocus" @onblur="onblur"/>
            </div>
          </scroll>
        </div>
        <bottom :statusProp="baseInfo.status" v-show="status === 'normal'" :bPath="bPath"></bottom>
      </div>
    </div>
    <c-select :arr="arr" :popShow="popShow" :popData="popData" @changePop="popShow = false"></c-select>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import HeaderBar from 'common/components/headerBar'
import Scroll from 'common/components/scroll'
import Cell from 'common/components/cell'
import cSelect from 'managerCommon/components/cSelect'
import Bottom from 'managerCommon/components/bottom'
import teacher from 'managerHome/teacher/api/teacher'
import {MSelect} from 'managerCommon/js/mixin'
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {Toast} from 'vant'
import commonAPI from 'common/api/api'

export default {
  name: 'teacherDetails',
  mixins: [MSelect],
  data () {
    return {
      status: 'normal',
      addShow: false,
      isAddStatus: this.$route.query.status,
      arr: [],
      defaultTeacherQC: require('@/assets/_images/public/default.png'),
      defaultAvatar: require('@/assets/_images/public/my_default.png'),
      offy: 0,
      tap: true,
      clickflag: true
    }
  },
  created () {
    this.setIsCache(false)
    if (this.isAddStatus) {
      this.status = 'filed'
      this.addShow = true
      this.setTeacherId('')
      this.setHouseholdAddressName('')
      this.setDegreeName('')
    } else {
      this._getTeacherInfo()
    }
  },
  mounted () {
    if (this.$store.state.account.isAndroid && this.$route.query.status) {
      let test = document.getElementById('test-div')
      test.addEventListener('tap', function (e) {
        let activeElement
        let box = test.getElementsByClassName('blur-text')
        for (let i = 0; i < box.length; i++) {
          if (box[i] === document.activeElement) {
            activeElement = box[i]
          }
        }
        if (activeElement && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          activeElement.blur()
        }
      })
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "teacherManagement") {
      to.params.toScrollY = true
      to.meta.isUseCache = !this.isCache
      next()
    } else {
      next()
    }
  },
  computed: {
    resetoff () {
      return {
        transform: `translate3d(0, ${this.offy}vh, 0)`
      }
    },
    ...mapGetters({
      teacherDetails: 'managerTeacher/teacherDetails',
      baseInfo: 'managerTeacher/baseInfo',
      classInfo: 'managerTeacher/classInfo',
      teacherInfo: 'managerTeacher/teacherInfo',
      addTeacher: 'managerTeacher/addTeacher',
      isAdd: 'managerTeacher/isAdd',
      schoolId: 'managerCommon/schoolId',
      householdAddressArr: 'managerTeacher/householdAddressArr',
      degreeArr: 'managerTeacher/degreeArr',
      householdAddressName: 'managerTeacher/householdAddressName',
      degreeName: 'managerTeacher/degreeName',
      isCache: 'managerTeacher/isCache'
    })
  },
  methods: {
    onfocus (off) {
      this.offy = off
    },
    onblur (off) {
      this.offy = off
    },
    add () {
      if (!this.isAdd.name || !this.isAdd.mobile || !this.isAdd.password) {
        Toast(`姓名、手机、密码不能为空或填写不正确`)
        return false
      }
      if (!this.clickflag) return
      this.clickflag = false
      delete this.addTeacher.classNameList
      delete this.addTeacher.photoUrl
      delete this.addTeacher.teacherQcUrl
      this.householdAddressArr.forEach((v, i) => {
        if (v.name === this.householdAddressName) this.setAddTeacher({householdAddress: v.id})
      })
      this.degreeArr.forEach((v, i) => {
        if (v.codeName === this.degreeName) this.setAddTeacher({degree: v.codeValue})
      })
      let json = Object.assign({}, {schoolId: this.schoolId}, this.addTeacher)
      teacher.saveInfo(json).then(r => {
        this.clearAddTeacher()
        this.setIsAdd({
          name: false,
          password: false,
          mobile: false
        })
        this.setIsCache(true)
        Toast(`添加成功！`)
        setTimeout(() => {
          this.clickflag = true
          this.$router.back(-1)
        }, 300)
      })
    },
    popup (popData) {
      this.popShow = true
      if (popData.key === 'householdAddress') {
        if (this.householdAddressArr.length !== 0) {
          let arr = []
          this.householdAddressArr.forEach((v, i) => {
            arr.push(v.name)
          })
          this.popData = Object.assign({}, popData, {value: this.householdAddressName, columns: arr})
        } else {
          commonAPI.provinceList().then(r => {
            this.setHouseholdAddressArr(r.provinceList)
            let arr = []
            r.provinceList.forEach((v, i) => {
              arr.push(v.name)
            })
            this.popData = Object.assign({}, popData, {value: this.householdAddressName, columns: arr})
          })
        }
        this.arr = this.householdAddressArr
      } else if (popData.key === 'degree') {
        if (this.degreeArr.length !== 0) {
          let arr = []
          this.degreeArr.forEach((v, i) => {
            arr.push(v.codeName)
          })
          this.popData = Object.assign({}, popData, {value: this.degreeName, columns: arr})
        } else {
          commonAPI.clientConfigList({
            category: 'degree'
          }).then(r => {
            this.setDegreeArr(r.page)
            let arr = []
            r.page.forEach((v, i) => {
              arr.push(v.codeName)
            })
            this.popData = Object.assign({}, popData, {value: this.degreeName, columns: arr})
          })
        }
        this.arr = this.degreeArr
      } else {
        this.popData = popData
      }
    },
    _getTeacherInfo () {
      this.getTeacherDetails().then(r => {
      })
    },
    ...mapMutations({
      setTeacherId: 'managerTeacher/SET_USERID',
      setAddTeacher: 'managerTeacher/SET_ADDTEACHER',
      clearAddTeacher: 'managerTeacher/CLEAR_ADDTEACHER',
      setIsAdd: 'managerTeacher/SET_ISADD',
      setHouseholdAddressArr: 'managerTeacher/SET_HOUSEHOLDADDRESSARR',
      setDegreeArr: 'managerTeacher/SET_DEGREEARR',
      setHouseholdAddressName: 'managerTeacher/SET_HOUSEHOLDADDRESSNAME',
      setDegreeName: 'managerTeacher/SET_DEGREENAME',
      setIsCache: 'managerTeacher/SET_ISCACHE'
    }),
    ...mapActions({
      getTeacherDetails: 'managerTeacher/getTeacherDetails'
    })
  },
  watch: {
    addTeacher: {
      handler: function (val) {
      },
      deep: true
    },
    'addTeacher.sex': {
      handler: function (val) {
      },
      deep: true
    }
  },
  components: {
    HeaderBar,
    Scroll,
    Cell,
    cSelect,
    Bottom
  }
}

</script>

<style scoped lang="scss">
 @import "@/style/variable.scss";
  #teacher-details{
    .ptouchpan{
      position: fixed;
      width: 100%;
      top: 50px;
      bottom: 0;
      transform: translate3d(0,0,0);
      .status{
        margin: 0;
        border: 0;
        font-size: 16px;
        font-weight: normal;
        vertical-align: baseline;
        height: calc(72px/2);
        line-height: calc(72px/2);
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
        .details-view{
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
      }
      .details-content-add {
        top: 0;
        bottom: 0;
        transition: all 0.3s;
      }
    }
  }
</style>
