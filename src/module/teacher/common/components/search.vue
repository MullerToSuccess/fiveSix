<template>
  <div id="search">
    <header-bar>
      <div slot="title-name">搜索</div>
    </header-bar>
    <div class="input-box">
      <i class="login-input-icon"></i>
      <input class="login-input" :placeholder="placeholder" v-model="searchVal" @focus="on_focus" @blur="on_blur">
      <i class="clear-icon" @click="deleteVal"></i>
    </div>
  </div>
</template>

<script>
import HeaderBar from 'common/components/headerBar'

export default {
  name: 'search',
  data () {
    return {
      searchVal: '',
      placeholder: ''
    }
  },
  created () {
    this.placeholder = this.$route.params.type === 'student' ? '请输入学生姓名' : '请输入老师姓名'
  },
  methods: {
    on_focus () {
    },
    on_blur () {
    },
    deleteVal () {
      this.searchVal = ''
    }
  },
  components: {
    HeaderBar
  }
}
</script>

<style lang="scss" scoped>
 @import "@/style/variable.scss";
  #search{
    .input-box{
      height: 90px;
      padding: 10px 26px;
      .login-input-icon{
        display: inline-block;
        width: 38px;
        height: 38px;
        margin-right: 20px;
        background: url('../../../../assets/_images/public/search.png') no-repeat 0 0;
        background-size: 100% 100%;
        vertical-align: text-bottom
      }
      input{
        font-size: $header-list;
        letter-spacing: 2px;
        padding: 4px;
      }
      .clear-icon{
        display: inline-block;
        width: 18px;
        height: 18px;
        margin-left: 220px;
        background: url('../../../../assets/_images/public/search_delete.png') no-repeat 0 0;
        background-size: 100% 100%;
        vertical-align: text-bottom
      }
    }
  }
</style>
