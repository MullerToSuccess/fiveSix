<template>
  <div id="viewImage" class="page">
    <header-bar>
      <div slot="title-name">每日反馈-预览图片</div>
      <div slot="right-area" class="right">
      </div>
    </header-bar>

    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(item, index) in imgList" :key="index">
          <div class="img-container">
            <img class="img-container-img" :src="item">
          </div>
        </div>
      </div>
    </div>

    <div class="tabs">
      <span>{{activeNum}}/{{imgList.length}}</span>
      <!-- <span> -->
        <div class="delete-div">
          <!-- <img class="delete-img" src="@/assets/_images/teacher/delete_image.png"> -->
        </div>
      <!-- </span> -->
    </div>
  </div>
</template>

<script>
import HeaderBar from 'common/components/headerBar'
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'viewImage',
  data () {
    return {
      imgList: [],
      activeNum: 1,
      searchVal: '',
      teacherSummaryText: '',
      mySwiper: null // 滑动组件实例
    }
  },
  computed: {
    ...mapGetters({
      studentInfo: 'teacherStudent/studentDetails',
      studentHostingArray: 'teacherStudent/studentHostingArray',
      classInfo: 'teacherStudent/classInfo',
      currentImage: 'teacherStudent/currentImage'
    })
  },
  mounted() {
    if (this.currentImage.type === 'before') {
      this.imgList = this.currentImage.beforeCheckImagesView
    } else if (this.currentImage.type === 'after') {
      this.imgList = this.currentImage.afterCheckImagesView
    }
    this.renderView();
  },
  methods: {
    deleteVal () {
      this.searchVal = ''
    },
    goKnowledgePoint (key, index1, index2) {
      this.$router.push({
        path: '/teacher/student/knowledgePoint'
      })
    },
    renderView() {
      if (this.mySwiper) {
        return false
      }
      // let resource = this.resource
      // for (let i = 0; i < resource.length; i++) {
      //   this.imgList.push({})
      // }
      // this.currentIndex = this.params.index
      // this.imgList[this.params.index] = this.resource[this.params.index]
      this.$nextTick(() => {
        this.mySwiper = new this.Swiper('#viewImage .swiper-container', {
          init: false,
          observer: true, // 修改swiper自己或子元素时，自动初始化swiper
          observeParents: true, // 修改swiper的父元素时，自动初始化swiper
          on: {
            slideChange: () => {
              this.activeNum = this.mySwiper.activeIndex + 1
            }
          }
        })
        this.mySwiper.touchEvents = {
          end: 'touchend',
          move: 'touchmove',
          start: 'touchstart'
        }
        this.mySwiper.init()
        // if (this.params.index === 0) {
        //   this.slideEnd()
        // } else {
        //   this.mySwiper.slideTo(this.params.index, 0)
        // }
      })
    },
    slideEnd() {
      console.log('aa')
    }
  },
  watch: {
  },
  components: {
    HeaderBar
  }
}
</script>

<style lang="scss" scoped>
@import "@/style/reset.scss";
 @import "@/style/variable.scss";
  #todayHostingName {
    height: 100%;
    background: #f5f5f7;
  }
  .img-container {
    height: calc(100vh - 50px);
    width: 100%;
  }
  .img-container-img {
    width: 100%;
  }
  .delete-div {
    width: calc(60px/2);
    height: calc(60px/2);
    position: absolute;
    right: calc(20px/2);
  }
  .delete-img {
    width: 100%;
    vertical-align: middle;
  }
  .tabs {
    display: flex;
    justify-content: center;
    height: calc(110px/2);
    line-height: calc(110px/2);
    position: fixed;
    bottom: 0;
    padding-top:calc(5px/2);
    border-top:1px solid $color-line;
    background: #fafcfd;
    width: 100%;
  }
  .teacher-summary {
    background-color: #f5f5f7;
    height: calc(90px/2);
    line-height: calc(90px/2);
    font-weight: 700;
    padding-left: calc(26px/2);
  }
  .teacher-summary-textarea {
    margin-bottom: calc(20px/2);
  }
  .mistake-number-add-btn {
    color: #25d6e3;
    float: right;
  }
  .right{
    position: absolute;
    width: calc(200px/2);
    display: flex;
    left: -calc(80px/2);
    top: 0;
    span{
      font-size: $header-list-s;
    }
  }
  .check-image-div {
    // width: calc(80px/2);
    // height: calc(80px/2);
  }
  .homework-list-one-img-div {
    border-bottom: 1px solid #f5f5f7;
  }
  .check-image {
    margin: 20px 0;
  }
  .check-image-div-img {
    width: 100%;
  }
  .homework-list-one-check-before {
    width: calc(110px/2);
  }
  .check-image {
    // background-color: #f5f5f7;
    width: calc(240px/2);
    height: calc(240px/2);
    border-radius: calc(12px/2);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: calc(20px/2);
  }
  .check-before-img {
    width: 100%;
  }
  .homework-list-one {
    background-color: #ffffff;
    margin-bottom: calc(20px/2);
    padding: 0 calc(26px/2);
  }
  .homework-list-one-title {
    height: calc(80px/2);
    line-height: calc(80px/2);
    border-bottom: 1px solid #f5f5f7;
  }
  .mistake-number {
    height: calc(80px/2);
    line-height: calc(80px/2);
    font-size: calc(28px/2);
  }
  .mistake-number-input {
    border-bottom: 1px solid #f5f5f7;
    width: calc(200px/2);
    text-align: center;
  }
  .checkTime {
    // display: inline-block;
  }
  .homeworkTimes {
    color: red;
  }
  .checkFeedback {
    display: inline-block;
    float: right;
  }
  .input-box{
    height: calc(82px/2);
    line-height: calc(82px/2);
    padding: 0 calc(26px/2);
    .login-input-icon{
      display: inline-block;
      width: calc(38px/2);
      height: calc(38px/2);
      margin-right: calc(20px/2);
      background: url('../../../../../assets/_images/public/search.png') no-repeat 0 0;
      background-size: 100% 100%;
      vertical-align: text-bottom
    }
    input{
      font-size: $header-list;
      letter-spacing: calc(2px/2);
    }
    .clear-icon{
      display: inline-block;
      width: calc(18px/2);
      height: calc(18px/2);
      margin-left: calc(220px/2);
      background: url('../../../../../assets/_images/public/search_delete.png') no-repeat 0 0;
      background-size: 100% 100%;
      vertical-align: text-bottom
    }
  }
   .van-tabs--line {
     padding-top: 13.33333vw;
   }
   .s-search{
    height: calc(82px/2);
    padding: 0 calc(26px/2);
    font-size:$header-list;
    line-height: calc(82px/2);
    color: $color-text-d;
    background: #ffffff;
    .s-number-red{
      color: #ff1503;
    }
  }
  .tab-lists{
    // margin-bottom: calc(20px/2);
    .tab-view{
      height: 100%;
      overflow: hidden;
      .tab{
        padding: 0 calc(26px/2);
        background: #fff;
        .tab-content{
          display: flex;
          justify-content: space-between;
          height: calc(130px/2);
          .tab-photo{
            width: calc(86px/2);
            height: calc(86px/2);
            margin-top: calc(25px/2);
            img{
              width: 100%;
              height: 100%;
              border-radius:50% ;
            }
          }
          .tab-text{
            width: 76%;
            margin-top: calc(30px/2);
            font-size: $header-list-s;
            letter-spacing: calc(2px/2);
            div{
              margin-bottom: calc(20px/2);
            }
            div:last-child{
              // margin-right: calc(70px/2);
            }
            .user,.course,.time{
              color: $color-text-d;
            }
            .mode{
              color: $green-primary-color;
            }
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
      border-radius: 17px/21px;
    }
  }
</style>
