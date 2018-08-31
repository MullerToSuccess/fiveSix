<template>
  <div id="my-class" class="page">
    <header-bar @back="back"><span slot="title-name">{{title}}</span></header-bar>
    <div class="van-hairline--top" style="display: flex;flex-direction: column; align-items: center">
      <van-cell-group v-if="classes" v-for="(item,index) in classes" :key="index">
        <van-cell class="aboutus-van-cell myclass-van-cell" is-link @click="link(item.class_id)" style="padding-left: 0px;padding-right: 0px">
          <template slot="title">
            <div class="item-choice ft16"><div class="icondiv"><img :src="getSrc(item)" class="iconimage"/></div>{{item.class_name}}</div>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>
<script>
import api from '@/module/user-center/axios/usercenter'
import headerBar from '@/components/headerBar.vue'
import {mapState} from 'vuex'
export default {
  name: 'MyClass',
  data () {
    return {
      title: '我的班级',
      hasBack: true,
      classes: null,
      defaultClassIcon: require('@/assets/images/usercenter/myclassdefaulticon.png'),
      animateConfig: {
        forwardAnim: 'slideInRight'
      }
    }
  },
  computed: {
    ...mapState({
      userId: state => state.account.userInfo.userid
    })
  },
  mounted () {
    api.obtainclasses({
      user_id: this.userId
    }).then(succ => {
      succ.forEach(element => {
        element.student_counter = `班级人数:${element.student_counter}`
      })
      this.classes = succ
    })
  },
  methods: {
    link (classId) {
      this.$router.push({path: `/classInfo/${classId}`})
    },
    back () {
      this.$router.back(-1)
    },
    getSrc(item) {
      let iconsrc = item.class_icon
      if (iconsrc) {
        if (iconsrc.indexOf('http://') === -1) {
          iconsrc = this.$store.getters['runEnv/old'] + iconsrc
        }
      } else {
        iconsrc = this.defaultClassIcon
      }
      return iconsrc
    }
  },
  components: {
    headerBar
  }
}
</script>

<style scoped>
  div.item-choice
  {
    display: flex;
    align-items: center;
    height: 30px;
    width: 100%;
  }
  .van-cell-group.van-hairline--top-bottom
  {
    height:53px;
    width: 95%;
  }
  .icondiv{
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-left: 4px;
    margin-right: 10px;
    overflow:hidden;
  }
  .iconimage{
    width: 30px;
    height: 30px;
  }
</style>
