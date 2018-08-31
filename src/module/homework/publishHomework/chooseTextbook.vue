<template>
  <div class="cube-page cube-view button-view page" style="overflow: hidden;background:#f5f7f8">
    <header class="header">
      <h1>选择教材</h1>
      <i class="cubeic-back" @click="goHomework"><i class="back-up-arrow"></i></i>
    </header>

    <div class="gradelist">
        <div v-for="items in gradeLists" :key="items.period_name">
            <p class="section-div">{{items.period_name}}</p>
           <div v-for='item in items.grade_list' :key="item.name" class="grade-div" v-bind:class="{activegradeselclass:activeGradeId === item.id}"  @click="clickGrade(item.id)">
             <p class="grade-p" v-bind:class="{activetxtclass:activeGradeId === item.id}">
               {{item.name}}
              </p>
          </div>
           <div style="clear:both;"></div>
        </div>
    </div>

    <div style="width: 75%;float: left;padding-top: 2vw;height: 100%;text-align: center;background-color: #fff;">
      <div class="unit-tab-div">
        <div class="unit-tab-class" @click="clickTerm(1)" v-bind:class="{cubebtnactive:activeTermId === 1}">上册</div>
        <div class="unit-tab-class" @click="clickTerm(2)" v-bind:class="{cubebtnactive: activeTermId === 2}">下册</div>
        <div class="unit-tab-class" @click="clickTerm(3)" v-bind:class="{cubebtnactive: activeTermId === 3}">全册</div>
      </div>

          <van-pull-refresh class="list-container" v-model="pullRefresIsLoading" @refresh="onRefresh">
            <van-list v-model="loading" loading-text="加载中。。。" :finished="finished" @load="loadMore" :offset="100" :immediate-check="false">
              <div class="text-book" v-for="(textBook, index) in textBookList" :key="index" @click="clickTextBook(textBook)"
            v-bind:class="{activerighttabclass: chooseTextbookId === textBook.edu_book_id}">{{textBook.name}}</div>
            </van-list>
          <div v-if="textBookList.length==0" class="text-font">
            暂无内容
          </div>
          </van-pull-refresh>
    </div>
    <div class="footer-container div-center">
      <div class="yx-green-btn" :outline="true" @click="goSummerHomework">确认</div>
    </div>
  </div>
</template>

<script>
import api from "@/module/homework/axios/publishHomeWork.js";

export default {
  name: "chooseTextbook",
  data() {
    return {
      page: 1,
      activeGradeId: 1,
      loading: false,
      finished: false,
      noMore: false,
      pullRefresIsLoading: false,
      pullRefresh: false,
      activeTermId: 1,
      textBookList: [],
      gradeLists: [],
      selBook: {},
      chooseTextbookId: ""
    };
  },
  mounted: function() {
    // this.getTextBookLists();
    this.getGradeLists();
  },
  activated: function() {
    this.selBook = this.$store.state.homework.chooseTextBookObj;
    if (this.selBook.hasOwnProperty("term_id")) {
      this.activeTermId = parseInt(this.selBook.term_id);
      this.activeGradeId = parseInt(this.selBook.grade_id);
      this.oldBookId = this.chooseTextbookId = this.selBook.edu_book_id;
    } else {
      this.oldBookId = "";
    }
    this.textBookList.length = 0;
    this.onRefresh();
  },
  created: function() {
    this.userInfo = this.$store.state.account.userInfo;
    this.selBook = this.$store.state.homework.chooseTextBookObj;
    if (this.selBook.hasOwnProperty("term_id")) {
      this.activeTermId = parseInt(this.selBook.term_id);
      this.activeGradeId = parseInt(this.selBook.grade_id);
      this.oldBookId = this.chooseTextbookId = this.selBook.edu_book_id;
    } else {
      this.oldBookId = "";
    }
  },
  methods: {
    goHomework() {
      var tempStr =
        this.$store.state.homework.chooseBackPage.length > 0
          ? this.$store.state.homework.chooseBackPage
          : "homework";
      this.$router.push({
        path: "/" + tempStr
      });
    },
    reset() {
      this.noMore = false;
      this.finished = false;
      this.loading = false;
      this.page = 1;
      this.chooseTextbookId = this.oldBookId;
      this.textBookList.length = 0;
    },
    clickGrade(id) {
      this.activeGradeId = id;
      this.reset();
      this.getTextBookLists();
    },
    clickTerm(id) {
      this.activeTermId = id;
      this.reset();
      this.getTextBookLists();
    },
    onRefresh() {
      this.page = 1;
      this.finished = false;
      this.pullRefresh = true;
      this.getTextBookLists();
    },
    loadMore() {
      if (this.noMore) {
        this.loading = false;
      } else {
        this.getTextBookLists();
      }
    },
    getGradeLists() {
      var self = this;
      var data = {
        user_id: self.userInfo.userid
      };
      api.getGradeLists(data).then(
        success => {
          self.gradeLists = success;
        },
        err => {
          console.log(err);
          self.$toast("网络异常");
        }
      );
    },
    getTextBookLists() {
      var self = this;
      var data = {
        user_id: self.userInfo.userid,
        page: self.page,
        per_page: 15,
        grade_id: self.activeGradeId,
        term_id: self.activeTermId
      };
      self.page++;
      api.getBookLists(data).then(
        success => {
          if (parseInt(success.page) === 1) self.textBookList.length = 0;
          self.pullRefresIsLoading = false;
          self.loading = false;
          if (self.pullRefresh) {
            self.textBookList.length = 0;
          }
          if (success.lists.length < 1) {
            self.noMore = true;
          } else {
            self.textBookList = self.textBookList.concat(success.lists);
            self.noMore = false;
          }
          self.pullRefresh = false;
        },
        err => {
          console.log(err);
          self.pullRefresh = false;
          self.pullRefresIsLoading = false;
          self.loading = false;
          self.$toast("网络异常");
        }
      );
    },
    clickTextBook(book) {
      this.chooseTextbookId = book.edu_book_id;
      this.selBook = book;
    },
    goSummerHomework() {
      if (!this.chooseTextbookId) {
        this.$toast({
          message: "请选择教材！",
          duration: 750
        });
        return;
      }
      this.selBook.grade_id = this.activeGradeId;
      this.selBook.term_id = this.activeTermId;
      this.$store.dispatch("chooseTextBookObj", this.selBook);
      if (this.$store.state.homework.publishHWBackPage.length < 1) {
        this.$store.dispatch("publishHWBackPage", "chooseTextbook");
      }
      this.selBook.user_id = this.userInfo.userid;
      api.saveRecord(this.selBook).then(
        success => {},
        err => {
          console.log(err);
          self.$toast("网络异常");
        }
      );

      this.$router.push({
        path: "/publishHomework"
      });
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/assets/css/custom.scss";
.list-container {
  margin-top: 1vw;
  overflow-y: scroll;
  height: calc(100% - #{$header-height} - #{$bottom-height} - 13vw);
}

.unit-tab-class {
  @extend .single-line;
  background-color: #ffffff;
  color: #000;
  border: $border-state;
  display: inline-block;
  width: 27%;
  padding: 2vw;
  border-radius: 1vw;
  margin: 0 1.5vw;
  text-align: center;
  cursor: pointer;
  font-size: 4.26667vw;
  line-height: 1;
  outline: none;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}
.gradelist {
  width: 25%;
  float: left;
  height: calc(100% - #{$header-height} - #{$bottom-height} - 2vw);
  overflow: auto;
  padding-top: 2vw;
  .section-div {
    font-size: 15px;
    color: #9c9ea1;
  }
  .grade-p {
    font-size: 16px;
  }
  .grade-div {
    line-height: 11vw;
    height: 11vw;
  }
  p {
    padding-left: 15px;
    margin: 7px 0 0 0;
  }
}
.unit-tab-div {
  display: inline-block;
  vertical-align: top;
  width: 100%;
  .cubebtnactive {
    background-color: #2ec2a9 !important;
    border: 1px solid #2ec2a9;
    color: #fff !important;
  }
  .cube-btn {
    background-color: #ffffff;
    color: #000;
    border: $border-state;
    display: inline-block;
    width: 30%;
    padding: 2vw;
    border-radius: 1.3vw;
  }
}
.comfirm-txt-btn {
  position: absolute;
  right: 0px;
  top: 0%;
  height: 100%;
  background: #fff;
  color: $green-primary-color;
  padding: 0 4vw;
}
.text-book {
  @extend .single-line;
  border-bottom: $border-state;
  line-height: 12vw;
  margin: 0 auto;
  width: 93%;
  text-align: left;
  font-size: 16px;
}
.activerighttabclass {
  color: $green-primary-color;
}
.activegradeselclass {
  background-color: #fff;
  color: #000;
}
.activetxtclass {
  @extend .single-line;
  border-left: 2px solid $green-primary-color;
}
</style>
