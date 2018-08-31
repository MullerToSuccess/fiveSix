<template>
<div class="share page">
  <header-bar @back="goBack">
    <div slot="title-name">分享到班级空间</div>
    <div slot="right-area" @click="share">分享</div>
  </header-bar>
  <div class="wrapper">
    <textarea name="content"  placeholder="说点什么吧" v-model="content" @input="contentLengh"></textarea>
    <p>
      <span>还可以输入<b>{{maxLength-content.length}}</b>个字</span>
      <span class="clear" @click="clear">清空</span>
    </p>
    <div class="info">
      {{student}}的答案
    </div>
    <div class="answer">
      <student-answer :answerInfo="this.$route.params.answer" :isScroll='true'></student-answer>
    </div>
  </div>
</div>
</template>

<script>
import axios from './axios/share.js'
import headerBar from '@/components/headerBar.vue'
import storage from "@/store/stroage";
import studentAnswer from "@/components/common/studentAnswer.vue";
import { Toast } from 'vant';
export default {
  name: "share",
  data() {
    return {
      content: '',
      maxLength: 120,
      classId: this.$route.params.classId,
      answer: this.$route.params.answer,
      studentInfo: this.$route.params.studentInfo,
      studentAllInfo: this.$route.params.studentAllInfo
    }
  },
  created() {
  },
  computed: {
    title() {
      let teachr = storage['persistent'].get('userinfo').real_name;
      return teachr + '分享了' + this.student + '的答案'
    },
    shareParma() {
      let param = this.studentInfo;
      param.userAnswer = this.studentAllInfo;
      return JSON.stringify(param)
    },
    student() {
      return this.studentAllInfo.real_name
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    share() {
      let params = {
        class_id: this.classId,
        userid: JSON.parse(localStorage.userinfo).userid,
        title: this.title,
        content: this.content,
        share_param: this.shareParma
      }
      axios.share(params).then(r => {
        console.log(r)
        Toast.success({
          duration: 1500,
          message: '分享成功'
        });
        setTimeout(() => {
          this.goBack();
        }, 1500)
      })
    },
    clear() {
      this.content = "";
    },
    contentLengh() {
      if (this.content.length >= this.maxLength) {
        this.content = this.content.substring(0, this.maxLength)
      }
    }
  },
  components: {
    headerBar,
    studentAnswer
  }
};
</script>

<style lang="scss">
.share{
  padding:0 13px;
  height:100%;
  .wrapper{
    margin-top:13px;
    height: calc(100% - 45px);
    overflow-y: scroll;
    textarea{
      width: 100%;
      height: 148px;
      resize: none;
      border-radius: 5px;
      box-sizing: border-box;
      padding: 10px;
      border:1px solid #e8ebee;
    }
    p{
      margin:10px auto;
      color:#4e4e50;
      font-size: 14px;
      b{
        color:#ff5266;
      }
      span.clear{
        float:right;
      }
    }
  }
  .info{
    margin:30px auto 20px;
    font-size: 14px;
  }
  .answer{
    // padding-bottom: 20px;
    text-align: center;
    &>div{
      margin-bottom: 20px;
    }
  }
}
::-webkit-input-placeholder{
  font-size: 12px;
}
</style>
