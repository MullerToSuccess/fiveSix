<template>
  <div id="modify-name" class="page">
    <header-bar @back="back"><span slot="title-name">{{title}}</span></header-bar>
    <van-field v-model.trim="newName" placeholder="请输入修改后的姓名" icon="clear" @click-icon="newName = ''" :error-message="errMsg"/>
    <bottom-button-area :disabled="noInput" @click="set" buttonText="保 存"></bottom-button-area>
  </div>
</template>

<script>
import api from '@/module/user-center/axios/usercenter'
import headerBar from '@/components/headerBar.vue'
import BottomButtonArea from '@/module/user-center/components/common/bottomButtonArea'
import {mapState} from 'vuex'
import { Toast } from 'vant'
export default {
  name: 'ModifyName',
  data () {
    return {
      title: '修改姓名',
      hasBack: true,
      name: this.$route.params.name,
      newName: '',
      errMsg: '',
      noInput: true
    }
  },
  activated () {
    this.newName = ''
    this.errMsg = ''
  },
  computed: {
    ...mapState({
      userId: state => state.account.userInfo.userid
    })
  },
  watch: {
    newName (value) {
      if (value.length) {
        this.noInput = false
        // this.errMsg = ''
      } else {
        this.noInput = true
        // this.errMsg = '输入内容不能为空'
      }
    }
  },
  methods: {
    back () {
      this.$router.back(-1)
    },
    set () {
      api.modify({
        user_id: this.userId,
        data: {
          real_name: this.newName
        }
      }).then(succ => {
        Toast({position: 'bottom', message: '修改成功'})
        setTimeout(() => {
          this.$route.meta.real_name = this.newName
          this.back()
        }, 1000)
      }, err => {
        console.log(err)
      })
    }
  },
  components: {
    headerBar,
    BottomButtonArea
  }
}
</script>

<style scoped>
  #modify-name{
    width: 100%;
    height: 100%;
  }
</style>
