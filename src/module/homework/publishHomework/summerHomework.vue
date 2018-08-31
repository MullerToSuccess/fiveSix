<template>
  <div class="cube-page cube-view button-view page">
    <div v-show="!examExerciseShow" style="height:100%">
      <header class="header">
        <h1>暑假作业</h1>
        <i class="cubeic-back" @click="goPublishHomework"><i class="back-up-arrow"></i></i>
        <p class="select-all-p" @click="selectAll">{{hasChoosePagesNumArray.length==lists.length?'取消全选':'全选'}}</p>
      </header>

      <van-pull-refresh :class="{listdiv:this.hasChoosePagesNumArray.length === 0,listfooterdiv:this.hasChoosePagesNumArray.length !== 0}" class="van-pull-div" v-model="pullRefresIsLoading" @refresh="onRefresh">
        <van-list v-model="loading" loading-text="加载中。。。" :finished="finished" @load="loadMore" :offset="100" :immediate-check="false">
          <div class="list-item" v-for="(item, index) in lists" :key="index">
            <div style="float:left;margin-top: 3vw;" @click="clickTiltleName(item)">
                <p>{{(index+1)+"."+item.name}}</p>
                <p class="des-item">共<span>{{item.qti_num}}</span>道题</p>
            </div>
            <YxCheckBox class="checkbox" :selected="item.isSel" :ref="'cb-'+index" @select="checkboxChange(item, $event)"></YxCheckBox>
          </div>
        </van-list>
        <div v-if="lists.length==0" class="text-font">
          暂无内容
        </div>
      </van-pull-refresh>
    </div>

    <div v-if="examExerciseShow" style="height:100%">
      <header class="header">
        <h1>试卷</h1>
        <i class="cubeic-back" @click="goSummerHomework"><i class="back-up-arrow"></i></i>
        <div class="collect" @click="sendFavorite" :class="isFavorite ? 'collect-active' : 'collect-default'"></div>
      </header>
      <div :class="{listdiv:this.hasChoosePagesNumArray.length === 0,listfooterdiv:this.hasChoosePagesNumArray.length !== 0}">
        <div class="title">
          <div class="floatLeft">全部题目（{{setting.length}}）</div>
          <div class="floatRight" @click="clickChooseAll">{{currentPageSelectNum==qti_ids.length?'取消全选':'全选'}}</div>
        </div>
        <div class="listContainer">
          <div v-for="(item, index) in setting" :key="index" class="position">
            <Qti :setting="item" @click.native ="goOneQtiDetail(item)"></Qti>
            <YxCheckBox class="checkboxPosition" :selected="item.checked" :ref="'cbs-'+index" @select="exerciseCheckboxChange(item, $event)"></YxCheckBox>
          </div>
        </div>
      </div>
    </div>

    <div v-if="this.hasChoosePagesNumArray.length !== 0" class="footer-container">
      <p class="footer-p">已选试卷<span>{{this.hasChoosePagesNumArray.length}}</span>份，共<span>{{hasChooseProblemsNumAtlast}}</span>道题</p>
      <div class="yx-green-btn buzhi-div"  @click="clickPublish">布&nbsp;&nbsp;&nbsp;&nbsp;置</div>
    </div>
  </div>
</template>

<script>
import api from "@/module/homework/axios/publishHomeWork.js";
import YxCheckBox from "@/components/common/yx-check-box.vue";
import renderQti from "@/components/renderQti.vue";

export default {
  name: "summerHomework",
  components: { YxCheckBox, renderQti },
  data() {
    return {
      checkList: [],
      lists: [],
      result: [],
      hasChooseProblemsNumAtlast: 0,
      olded: false,
      pullRefresIsLoading: false,
      pullRefresh: false,
      hasChoosePagesNumArray: [],
      loading: false,
      finished: false,
      noMore: true,
      page: 0,
      examExerciseShow: false,
      setting: [],
      qti_ids: [],
      currentPageSelectNum: 0,
      isFavorite: false
    };
  },
  computed: {},
  activated: function() {},
  created: function() {},
  mounted: function() {},
  beforeRouteEnter(to, from, next) {
    if (from.name === "oneExamExercise") {
      next(vm => {
        if (vm.lists.length !== 0) {
          vm.$nextTick(() => {
            document.querySelector(".listContainer") &&
              (document.querySelector(".listContainer").scrollTop = to.meta.scrollY);
            vm.pullScrollY = to.meta.pullScrollY;
          });
        } else {
          vm.lists.length = 0;
          vm.isFavorite = false;
          vm.isFavoriteRequest = false;
          vm.currentItem = {};
          vm.userInfo = vm.$store.state.account.userInfo;
          vm.chooseTextBookObj = vm.$store.state.homework.chooseTextBookObj;
          vm.currentResourceID =
            vm.$store.state.homework.summerHomeworkResouceId;
          if (vm.currentResourceID.length > 0) {
            vm.examExerciseShow = true;
          } else {
            vm.examExerciseShow = false;
          }
          vm.summerHomeworkPackId =
            vm.$store.state.homework.summerHomeworkPackId;
          vm.olded = vm.$store.state.homework.isOldPackId === "1";
          if (vm.$store.state.homework.hasChoosePagesArray.length > 0) {
            vm.hasChoosePagesNumArray = JSON.parse(
              JSON.stringify(vm.$store.state.homework.hasChoosePagesArray)
            );
          }
          vm.page = 0;
          vm.finished = false;
          vm.pullRefresh = true;
          vm.getList();
        }
      });
    } else {
      next(vm => {
        vm.lists.length = 0;
        vm.isFavorite = false;
        vm.isFavoriteRequest = false;
        vm.currentItem = {};
        vm.userInfo = vm.$store.state.account.userInfo;
        vm.chooseTextBookObj = vm.$store.state.homework.chooseTextBookObj;
        vm.currentResourceID = vm.$store.state.homework.summerHomeworkResouceId;
        if (vm.currentResourceID.length > 0) {
          vm.examExerciseShow = true;
        } else {
          vm.examExerciseShow = false;
        }
        vm.summerHomeworkPackId = vm.$store.state.homework.summerHomeworkPackId;
        vm.olded = vm.$store.state.homework.isOldPackId === "1";
        if (vm.$store.state.homework.hasChoosePagesArray.length > 0) {
          vm.hasChoosePagesNumArray = JSON.parse(
            JSON.stringify(vm.$store.state.homework.hasChoosePagesArray)
          );
        }
        vm.page = 0;
        vm.finished = false;
        vm.pullRefresh = true;
        vm.getList();
      });
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "oneExamExercise") {
      from.meta.scrollY = document.querySelector(".listContainer").scrollTop;
      from.meta.pullScrollY = this.pullScrollY;
    } else {
      from.meta.scrollY = 0;
      from.meta.pullScrollY = 0;
    }
    next();
  },
  methods: {
    goPublishHomework() {
      this.examExerciseShow = false;
      this.lists.length = 0;
      this.$store.dispatch("summerHomeworkResouceId", "");
      this.$store.dispatch("hasChoosePagesArray", this.hasChoosePagesNumArray);
      this.$store.dispatch("isOldPackId", "1");
      this.$router.push({
        path: "/publishHomework"
      });
    },
    goOneQtiDetail(item) {
      this.$store.dispatch("hasChoosePagesArray", this.hasChoosePagesNumArray);
      this.$store.dispatch("isOldPackId", "1");
      var data = JSON.parse(JSON.stringify(item));
      this.$store.dispatch("oneExamExercise", data);
      this.$router.push({
        name: "oneExamExercise",
        params: {
          oneExamExerciseInfo: data
        }
      });
    },
    goSummerHomework() {
      this.examExerciseShow = false;
      this.$store.state.homework.summerHomeworkResouceId = "";
      this.currentResourceID = "";
      this.$nextTick(() => {
        document.querySelector(".van-pull-div") &&
          (document.querySelector(".van-pull-div").scrollTop = this.pullScrollY);
      });
    },
    getHasChooseExerciseNum() {
      var num = 0;
      var array = this.hasChoosePagesNumArray;
      this.currentPageSelectNum = 0;
      for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].qti_ids_obj.length; j++) {
          if (array[i].qti_ids_obj[j].checked) {
            num += 1;
            if (
              this.currentItem &&
              array[i].resource_id === this.currentItem.resource_id
            ) {
              this.currentPageSelectNum++;
            }
          }
        }
      }
      this.hasChooseProblemsNumAtlast = num;
    },
    quickSort(arr) {
      // 如果数组<=1,则直接返回
      if (arr.length <= 1) {
        return arr;
      }
      var pivotIndex = Math.floor(arr.length / 2);
      // 找基准，并把基准从原数组删除
      var pivot = arr.splice(pivotIndex, 1)[0].index;
      // 定义左右数组
      var left = [];
      var right = [];

      // 比基准小的放在left，比基准大的放在right
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].index <= pivot) {
          left.push(arr[i]);
        } else {
          right.push(arr[i]);
        }
      }
      // 递归
      return this.quickSort(left).concat([pivot], this.quickSort(right));
    },
    clickPublish() {
      this.lists.length = 0;
      if (this.hasChoosePagesNumArray.length === 0) {
        this.$toast({
          message: "请选择试卷！",
          duration: 1000
        });
        return;
      }
      var result = [];
      for (var i = 0; i < this.hasChoosePagesNumArray.length; i++) {
        var tempArr = [];
        let selectAll = true;
        for (
          let index = 0;
          index < this.hasChoosePagesNumArray[i].qti_ids_obj.length;
          index++
        ) {
          const element = this.hasChoosePagesNumArray[i].qti_ids_obj[index];
          if (element.checked) {
            tempArr.push(element.r_id);
          } else {
            selectAll = false;
          }
        }
        result.push({
          name: this.hasChoosePagesNumArray[i].name,
          selectAll: selectAll,
          index: this.hasChoosePagesNumArray[i].listIndex,
          r_ids: tempArr,
          resource_id: this.hasChoosePagesNumArray[i].resource_id
        });
      }
      var array = result.sort((m, n) => {
        return (m.index - n.index)
      });
      console.log(array)
      this.lists.length = 0;
      this.$store.dispatch("hasChoosePagesArray", this.hasChoosePagesNumArray);
      this.$store.dispatch("isOldPackId", "1");
      this.result = array;
      this.$store.dispatch("chooseSummerHomeworkArray", this.result);
      // console.log(this.hasChoosePagesNumArray);
      // return
      this.$router.push({
        path: "/homeworkPublishSetting"
      });
    },
    selectAll() {
      var self = this;
      if (this.hasChoosePagesNumArray.length === this.lists.length) {
        this.hasChoosePagesNumArray = [];
        let i = 0;
        while (i < this.lists.length) {
          self.$refs["cb-" + i][0].selecteState = false;
          for (let j = 0; j < this.lists[i].qti_ids_obj.length; j++) {
            this.lists[i].qti_ids_obj[j].checked = false;
          }
          ++i;
        }
      } else {
        let j = 0;
        while (j < this.lists.length) {
          self.$refs["cb-" + j][0].selecteState = true;
          let element = this.lists[j];
          if (self.hasChoosePagesNumArray.indexOf(element) < 0) {
            self.hasChoosePagesNumArray.push(element);
          }

          for (let q = 0; q < this.lists[j].qti_ids_obj.length; q++) {
            this.lists[j].qti_ids_obj[q].checked = true;
          }
          ++j;
        }
      }

      this.getHasChooseExerciseNum();
    },
    checkboxChange(item, event) {
      if (event.selecteState) {
        let isHas = false;
        for (let i = 0; i < this.hasChoosePagesNumArray.length; i++) {
          if (this.hasChoosePagesNumArray[i].resource_id === item.resource_id) {
            isHas = true;
            break;
          }
        }

        if (!isHas) {
          this.hasChoosePagesNumArray.push(item);
          for (let j = 0; j < item.qti_ids_obj.length; j++) {
            item.qti_ids_obj[j].checked = true;
          }
        }
      } else {
        for (let i = 0; i < this.hasChoosePagesNumArray.length; i++) {
          if (this.hasChoosePagesNumArray[i].resource_id === item.resource_id) {
            for (
              let j = 0;
              j < this.hasChoosePagesNumArray[i].qti_ids_obj.length;
              j++
            ) {
              this.hasChoosePagesNumArray[i].qti_ids_obj[j].checked = false;
            }
            this.hasChoosePagesNumArray.splice(i, 1);
          }
        }
      }
      this.getHasChooseExerciseNum();
    },
    exerciseCheckboxChange(item, event) {
      if (event.selecteState) {
        let isHas = false;
        for (let i = 0; i < this.hasChoosePagesNumArray.length; i++) {
          if (
            this.hasChoosePagesNumArray[i].resource_id ===
            this.currentItem.resource_id
          ) {
            isHas = true;
            break;
          }
        }

        if (!isHas) {
          this.hasChoosePagesNumArray.push(this.currentItem);
          let arr = this.$refs["cb-" + this.currentItem.listIndex];
          if (arr && arr.length > 0) {
            arr[0].selecteState = true;
          }
        }
        for (let j = 0; j < this.currentItem.qti_ids_obj.length; j++) {
          if (item.qid === this.currentItem.qti_ids_obj[j].value) {
            this.currentItem.qti_ids_obj[j].checked = true;
          }
        }
      } else {
        var chooseOne = false;
        for (let j = 0; j < this.currentItem.qti_ids_obj.length; j++) {
          if (item.qid === this.currentItem.qti_ids_obj[j].value) {
            this.currentItem.qti_ids_obj[j].checked = false;
          } else {
            if (this.currentItem.qti_ids_obj[j].checked) {
              chooseOne = true;
            }
          }
        }

        if (!chooseOne) {
          for (
            let index = 0;
            index < this.hasChoosePagesNumArray.length;
            index++
          ) {
            const element = this.hasChoosePagesNumArray[index];
            if (element.resource_id === this.currentItem.resource_id) {
              this.hasChoosePagesNumArray.splice(index, 1);
              break;
            }
          }
          let arr = this.$refs["cb-" + this.currentItem.listIndex];
          if (arr && arr.length > 0) {
            arr[0].selecteState = false;
          }
        }
      }
      this.getHasChooseExerciseNum();
    },
    onRefresh() {
      this.page = 0;
      this.finished = false;
      this.pullRefresh = true;
      this.$store.dispatch("hasChoosePagesArray", this.hasChoosePagesNumArray);
      this.$store.dispatch("isOldPackId", "1");
      this.getList();
    },
    loadMore() {
      if (this.noMore) {
        this.loading = false;
      } else {
        this.getList();
      }
    },
    clickChooseAll() {
      if (this.currentPageSelectNum === this.qti_ids.length) {
        for (let j = 0; j < this.currentItem.qti_ids_obj.length; j++) {
          this.currentItem.qti_ids_obj[j].checked = false;
          let arr = this.$refs["cbs-" + j];
          if (arr && arr.length > 0) {
            arr[0].selecteState = false;
          }
        }
        for (
          let index = 0;
          index < this.hasChoosePagesNumArray.length;
          index++
        ) {
          const element = this.hasChoosePagesNumArray[index];
          if (element.resource_id === this.currentItem.resource_id) {
            this.hasChoosePagesNumArray.splice(index, 1);
            break;
          }
        }
        let arr = this.$refs["cb-" + this.currentItem.listIndex];
        if (arr && arr.length > 0) {
          arr[0].selecteState = false;
        }
        this.getHasChooseExerciseNum();
        return false;
      }
      if (!this.isSelect(this.currentItem)) {
        this.hasChoosePagesNumArray.push(this.currentItem);
        let arr = this.$refs["cb-" + this.currentItem.listIndex];
        if (arr && arr.length > 0) {
          arr[0].selecteState = true;
        }
      }
      for (let j = 0; j < this.currentItem.qti_ids_obj.length; j++) {
        this.currentItem.qti_ids_obj[j].checked = true;
        let arr = this.$refs["cbs-" + j];
        if (arr && arr.length > 0) {
          arr[0].selecteState = true;
        }
      }
      this.getHasChooseExerciseNum();
    },
    sendFavorite: function() {
      var self = this;
      var data = {
        user_id: self.userInfo.userid,
        resource_id: self.currentItem.resource_id
      };
      if (this.isFavoriteRequest) return;
      this.isFavoriteRequest = true;
      api.favoriteUpdate(data).then(
        success => {
          self.isFavoriteRequest = false;
          self.isFavorite = success.status !== 0;
          self.currentItem.is_favorite = success.status;
          if (self.isFavorite) {
            self.$toast("收藏成功");
          } else {
            self.$toast("取消收藏");
          }
        },
        err => {
          console.log(err);
          self.isFavoriteRequest = false;
          self.$toast("网络异常");
        }
      );
    },
    getList: function(value) {
      var self = this;
      self.page++;
      var data = {
        user_id: self.userInfo.userid,
        pack_id: self.summerHomeworkPackId,
        page: self.page,
        per_page: 1000
      };

      api.getResourceLists(data).then(
        success => {
          self.loading = false;
          self.pullRefresIsLoading = false;
          if (success.lists.length < 1) {
            self.noMore = true;
          } else {
            if (self.pullRefresh || parseInt(success.page) === 1) {
              self.olded = self.$store.state.homework.isOldPackId === "1";
              if (self.$store.state.homework.hasChoosePagesArray.length > 0) {
                self.hasChoosePagesNumArray = JSON.parse(
                  JSON.stringify(self.$store.state.homework.hasChoosePagesArray)
                );
              } else {
                self.hasChoosePagesNumArray = [];
              }
              self.lists.length = 0;
            }

            success.lists.forEach(element => {
              if (self.olded) {
                let selElement = self.getSelectItem(element);
                if (selElement !== null) {
                  element = selElement;
                  element.isSel = true;
                  let arr = self.$refs["cb-" + self.lists.length];
                  if (arr && arr.length > 0) {
                    arr[0].selecteState = true;
                  }
                } else {
                  element.qti_ids_obj = [];
                  for (let j = 0; j < element.qti_ids.length; j++) {
                    element.qti_ids_obj.push({
                      value: element.qti_ids[j].qti_id,
                      r_id: element.qti_ids[j].r_id,
                      checked: false
                    });
                  }
                }
              } else {
                self.hasChoosePagesNumArray.push(element);
                element.isSel = true;
                let arr = self.$refs["cb-" + self.lists.length];
                if (arr && arr.length > 0) {
                  arr[0].selecteState = true;
                }
                element.qti_ids_obj = [];
                for (let j = 0; j < element.qti_ids.length; j++) {
                  element.qti_ids_obj.push({
                    value: element.qti_ids[j].qti_id,
                    r_id: element.qti_ids[j].r_id,
                    checked: true
                  });
                }
              }
              element.listIndex = self.lists.length;
              if (self.currentResourceID === element.resource_id) {
                self.currentItem = element;
                self.clickTiltleName(element);
              }
              self.lists.push(element);
            });
          }
          self.pullRefresh = false;
          self.getHasChooseExerciseNum();
        },
        err => {
          console.log(err);
          self.loading = false;
          self.pullRefresIsLoading = false;
          self.pullRefresh = false;
          self.$toast("网络异常");
        }
      );
    },
    getSelectItem(item) {
      var res = null;
      this.hasChoosePagesNumArray.forEach(elements => {
        if (elements.resource_id === item.resource_id) res = elements;
      });
      return res;
    },
    isSelect(item) {
      var isContain = false;
      this.hasChoosePagesNumArray.forEach(elements => {
        if (elements.resource_id === item.resource_id) isContain = true;
      });
      return isContain;
    },
    qtiFun() {
      for (var i = 0; i < item.qti_ids_obj.length; i++) {
        this.setting.push({
          domain: "e.dev.anoah.com",
          qid: item.qti_ids_obj[i].value,
          checked: item.qti_ids_obj[i].checked,
          num: i + 1,
          caller: "PREVIEWOR",
          hide_result: 1,
          resource_type: "qti_question",
          isSel: true
        });
      }
    },
    clickTiltleName(item) {
      this.setting = [];
      this.pullScrollY = document.querySelector(".van-pull-div") && document.querySelector(".van-pull-div").scrollTop;
      this.examExerciseShow = true;
      // this.$store.dispatch("chooseExamExerciseQtiIdsArray", item.qti_ids);
      this.$store.dispatch("summerHomeworkResouceId", item.resource_id);
      this.qti_ids = item.qti_ids_obj;
      this.currentPageSelectNum = 0;
      this.currentItem = item;
      this.currentResourceID = item.resource_id;
      this.isFavorite = item.is_favorite !== 0;
      // this.qtiFun();
      for (var i = 0; i < item.qti_ids_obj.length; i++) {
        this.setting.push({
          domain: this.$store.getters["runEnv/old"],
          qid: item.qti_ids_obj[i].value,
          checked: item.qti_ids_obj[i].checked,
          num: i + 1,
          caller: "PREVIEWOR",
          hide_result: 1,
          user_id: '',
          resource_type: "qti_question",
          isSel: true,
          resource_id: item.qti_ids_obj[i].r_id
        });
        let arr = this.$refs["cbs-" + i];
        if (arr && arr.length > 0) {
          arr[0].selecteState = item.qti_ids_obj[i].checked;
        }
      }

      this.getHasChooseExerciseNum();
      // debugger
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/assets/css/custom.scss";
.page {
  background: #fff;
}
.van-pull-div {
  overflow-y: auto;
}
.position {
  position: relative;
}
.listContainerStyle {
  // height: calc(100% - #{$header-height} - #{$bottom-height} - #{$header-title-height});
  height: calc(100% - #{$header-height} - #{$bottom-height});
}
.listContainer {
  overflow-y: auto;
  overflow-x: hidden;
  background: #fff;
  height: calc(100% - #{$header-title-height});
}
.title {
  padding: 5px 10px;
  height: 25px;
  line-height: 25px;
  background: #f5f7f8;
}
.floatLeft {
  float: left;
}
.floatRight {
  float: right;
}
.collect {
  display: inline-block;
  width: 24px;
  height: 24px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100% 100%;
  margin-top: 3px;
  vertical-align: text-bottom;
  margin-right: 5px;
  position: absolute;
  top: 1.5vw;
  right: 2vw;
}
.collect-active {
  background-image: url("../../../assets/images/homeworkDetail/collect.png");
}
.collect-default {
  background-image: url("../../../assets/images/homeworkDetail/collect-default.png");
}
.listfooterdiv {
  height: calc(100% - #{$header-height} - #{$bottom-height});
}
.listdiv {
  height: calc(100% - #{$header-height});
}
.list-item {
  height: 20vw;
  background-color: #fff;
  margin: 0px 14px;
  font-size: 18px;
  border-bottom: $border-state;
  p {
    @extend .single-line;
    width: 70vw;
  }
  .checkbox {
    width: 25px;
    height: 25px;
    float: right;
    top: 7vw;
    border-radius: 20px;
    position: relative;
  }
  .des-item {
    font-size: 16px;
    color: #7f8184;
    padding-left: 4vw;
    padding-top: 1vw;
    span {
      color: #4e4e50;
    }
  }
}
.des-item:active {
  color: $green-primary-color;
}
.select-all-p {
  color: $green-primary-color;
  position: absolute;
  right: 4vw;
  top: 0;
  font-size: 18px;
}
.footer-p {
  @extend .single-line;
  line-height: $bottom-height;
  font-size: 18px;
  display: inline-block;
  padding-left: 14px;
  span {
    color: $orange-active-color;
  }
}
.buzhi-div {
  width: 100px;
  position: absolute;
  top: calc((#{$bottom-height} - 54px) / 2);
  right: 14px;
}
.position .checkboxPosition {
  position: absolute;
  right: 10px;
  bottom: 5px;
  width: 25px;
  height: 25px;
}
</style>
