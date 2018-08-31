<template>
  <transition name="slide">
    <div id="about">
      <header-bar>
        <div slot="title-name">关于我们</div>
      </header-bar>
      <div class="a-logo">
        <div>
          <img src="@/assets/_images/public/about.png" alt="">
        </div>
      </div>
      <p class="a-text">
        五六点教育是一家成长顾问式连锁托管机构，经过4年的探索与实践，已经研发出基础学生“作业托管”上的日日清，周周清，月月清的课程体系，帮助孩子们减轻学习压力的同时又提高综合素质能力，极大扩展了业界对托管业务的想像，使托管业务成为真正的、重要的教育环节，除了课程研发外，五六点教育更进一步将学生的教育情况形成“成长报告”每日反馈给家长，家长可以全景查看孩子在五六点的整体学习情况，这就是为什么五六点定位于“成长顾问式托管”的原因。
      </p>
    </div>
  </transition>
</template>

<script>
import HeaderBar from 'common/components/headerBar'

export default {
  name: 'about',
  components: {
    HeaderBar
  }
}
</script>

<style scoped lang="scss">
 @import "@/style/variable.scss";
 .slide-enter-active, .slide-leave-active {
   transition: all 0.5s;
 }

 .slide-enter, .slide-leave-to {
   transform: translate3d(100%, 0, 0);
 }
 #about{
   position: fixed;
   z-index: 100;
   top: 0;
   left: 0;
   bottom: 0;
   right: 0;
   background: #fff;
   .a-logo{
     margin-top: calc(40px/2);
     div{
       width: calc(248px/2);
       height: calc(264px/2);
       margin: auto;
       img{
         width: 100%;
         height: 100%;
       }
     }
   }
   .a-text{
     margin-top: calc(20px/2);
     padding: 0 calc(26px/2);
     font-size: calc(26px/2);
     line-height: calc(44px/2);
     letter-spacing: calc(3px/2);
     text-indent: calc(52px/2);
   }
 }

</style>
