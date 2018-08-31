<template>
  <div id="bottom">
    <ul v-if="!bShow" class="bottom">
      <li class="change-class" @click="toClass">转班</li>
      <li :class="item.class" v-for="(item,index) in sLists" :key="index" @click="showModel(index)">{{item.text}}</li>
    </ul>
    <ul v-else class="bottom teacher-bottom">
      <li :class="item.class" v-for="(item,index) in lists" :key="index" @click="showModel(index)">{{item.text}}</li>
    </ul>
    <van-popup v-model="show" @click-overlay="show = false">
      <div class="pop-box" v-show="showIndex === 0">
        <div class="stop" v-show="statusShow === index" v-for="(item,index) in appMode" :key="index">
          <div class="init">
            <div class="top">
              <div class="img">
                <i></i>
              </div>
              <div style="text-align: center">{{item.text}}</div>
            </div>
            <div class="bottom">
              <div class="cancel" @click="show = false">取消</div>
              <div class="sure" @click="selectMode(item.mode)">确定</div>
            </div>
          </div>
        </div>
        <!--<div class="pop" v-show="statusShow === index" v-for="(item,index) in appMode" :key="index" @click="selectMode(item.mode)">-->
          <!--<div class="pop-title">{{item.title}}</div>-->
          <!--<div class="pop-content">{{item.text}}</div>-->
        <!--</div>-->
      </div>
      <div class="pop-box" v-show="showIndex === 1">
        <div class="pop">
          <div class="pop-title">{{resetText.title}}</div>
          <div class="pop-content">{{resetText.content}}</div>
        </div>
      </div>
      <div class="pop-box" v-show="showIndex === 2">
        <div class="pop">
          <div class="pop-content">此功能暂未开放</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script type="text/ecmascript-6">
import {appMode} from '../js/const'
import studentAPI from 'managerHome/student/api/student'
import teacherAPI from 'managerHome/teacher/api/teacher'
import {Toast} from 'vant'
import {mapGetters, mapActions} from 'vuex'
import commonApi from 'common/api/api'
import {SHA256} from '@/utils/sha256'
export default {
  name: 'bottom',
  props: {
    bPath: {
      type: String
    },
    statusProp: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      lists: [{
        text: '停用',
        class: 'stop'
      }, {
        text: '重置密码',
        class: 'reset'
      }],
      sLists: [],
      show: false,
      appMode: appMode,
      showIndex: false,
      bShow: false,
      api: this.bPath === 'teacherDetails' ? teacherAPI.updateInfo : studentAPI.updateInfo,
      refresh: '',
      resetText: {},
      statusShow: 0
    }
  },
  computed: {
    ...mapGetters({
      studentId: 'managerStudent/userId',
      teacherId: 'managerTeacher/userId'
    })
  },
  created () {
    if (this.bPath === 'teacherDetails') {
      this.bShow = true
      this.id = this.teacherId
    } else {
      this.id = this.studentId
    }
    this.sLists = [].concat(this.lists)
    this.lists[0].text = this.statusProp ? '停用' : '启用'
    this.sLists[0].text = this.statusProp ? '停用' : '启用'
  },
  methods: {
    toClass () {
      this.$store.state.managerCommon.editMsgKey = 'sEditClass'
      this.$router.push({
        name: 'sEditMsg',
        params: {
          component: 'cEditClass',
          isSave: true
        }
      })
    },
    showModel (index) {
      this.show = true
      this.showIndex = index
      if (this.bPath === 'teacherDetails') {
        if (index === 0) this.statusShow = this.statusProp
        if (index === 1) this.reset(this.teacherId)
      } else {
        if (index === 0) this.statusShow = this.statusProp
        if (index === 1) this.reset(this.studentId)
      }
    },
    reset (id) {
      let pwd = this.random()
      commonApi.updatePassword({
        userId: id,
        newPassword: SHA256(pwd)
      }).then(r => {
        this.resetText = {
          title: '重置密码成功',
          content: `密码为${pwd}`
        }
      }, j => {
        this.resetText = {
          title: '重置密码失败',
          content: j.msg
        }
      })
    },
    selectMode (mode) {
      this.refresh = this.bPath === 'teacherDetails' ? this.getTeacherDetails : this.getStudentDetails
      this.api({
        userId: this.id,
        status: mode
      }).then(r => {
        this.refresh().then(r => {
          this.show = false
          Toast(`修改成功！`)
        })
      })
    },
    random () {
      let Num = "";
      for (let i = 0; i < 6; i++) {
        Num += Math.floor(Math.random() * 10);
      }
      return Num
    },
    ...mapActions({
      getStudentDetails: 'managerStudent/getStudentDetails',
      getTeacherDetails: 'managerTeacher/getTeacherDetails'
    })
  },
  watch: {
    statusProp (newVal) {
      this.lists[0].text = newVal ? '停用' : '启用'
      this.sLists[0].text = newVal ? '停用' : '启用'
    }
  }
}
</script>

<style scoped lang="scss">
 @import "@/style/variable.scss";
  #bottom {
    position: fixed;
    width: 100%;
    height: calc(115px/2);
    bottom: 0;
    background: $color-background;
    .bottom{
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 calc(30px/2);
      li {
        width: calc(200px/2);
        height: calc(90px/2);
        line-height: calc(90px/2);
        text-align: center;
        border: 2px solid transparent;
        border-radius: 19%/42%;
        margin-right: calc(45px/2);
        font-size: calc(34px/2);
      }
      li:last-child{
        margin-right: 0;
      }
      .change-class{
        background: $green-primary-color;
        color: #fff;
      }
      .stop{
        border: 2px solid $green-primary-color;
        color: $green-primary-color;
      }
      .reset{
        background: $reset-primary-color;
        color: #fff;
      }
      .delete{
        border: 2px solid $delete-primary-color;
        color: $delete-primary-color;
      }
    }
    .pop-box{
      padding: 0 calc(26px/2);
      .stop{
        width: calc(600px/2);
        height: calc(450px/2);
        font-size: $header-title-s;
        .img{
          text-align: center;
          margin-bottom: calc(30px/2);
          i{
            display: inline-block;
            width: calc(88px/2);
            height: calc(106px/2);
            vertical-align: text-bottom;
          }
        }
        .init{
          .top{
            margin: 65px 0 40px 0;
            i{
              background: url('../../../../assets/_images/public/cache.png') no-repeat 0 0;
              background-size: 100% 100%;
            }
          }
          .bottom{
            display: flex;
            justify-content: space-around;
            div{
              width: calc(200px/2);
              height: calc(90px/2);
              line-height: calc(90px/2);
              text-align: center;
              border: 2px solid transparent;
              border-radius: 19%/42%;
            }
            .cancel{
              border: 2px solid $green-primary-color;
              color: $green-primary-color;
            }
            .sure{
              background: $green-primary-color;
              color: #fff;
            }
          }
        }

      }
      .pop {
        border-bottom: 1px solid $color-line;
        .pop-title,.pop-content{
          height: calc(100px/2);
          line-height: calc(100px/2);
          font-size: calc(34px/2);
        }
        .pop-title{}
        .pop-content{
          font-size: calc(30px/2);
          color: $color-text-d;
        }
      }
    }
  }
</style>
