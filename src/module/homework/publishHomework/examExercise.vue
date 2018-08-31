<template>
  <div class="cube-page cube-view button-view page">
    <header class="header">
      <h1>试卷</h1>
      <i class="cubeic-back" @click="goSummerHomework"><i class="back-up-arrow"></i></i>
    </header>
    <div >
      <div style="padding: 5px 10px;height: 25px; line-height: 25px;">全部题目（{{setting.length}}）</div>
      <div class="listContainer" v-bind:style="listContainerStyle">
        <div v-for="(item, index) in setting" :key="index" style="position: relative;">
          <Qti :setting="item" @click.native ="goOneQtiDetail(item)"></Qti>
        </div>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  name: "examExercise",
  data() {
    return {
      setting: [],
      qti_ids: [],
      listContainerStyle: {
        height: window.innerHeight - 75 + 'px'
      },
      hasChoosePagesNumArray: []
    };
  },
  computed: {},
  mounted: function() {
    this.qti_ids = this.$store.state.homework.chooseExamExerciseQtiIdsArray;
    this.qtiFun();
  },
  methods: {
    qtiFun() {
      for (var i = 0; i < this.qti_ids.length; i++) {
        this.setting.push({
          domain: this.$store.getters["runEnv/old"],
          qid: this.qti_ids[i].qti_id,
          num: i + 1,
          caller: "PREVIEWOR",
          hide_result: 1,
          resource_type: "qti_question",
          resource_id: this.qti_ids[i].r_id
        });
      }
    },
    goOneQtiDetail(item) {
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
      this.$router.go(-1);
    },
    checkboxChange(item, event) {
      if (event.selecteState) {
        this.hasChoosePagesNumArray.push(item);
        this.hasChooseProblemsNum =
          parseInt(this.hasChooseProblemsNum) + parseInt(item.qti_num);
      } else {
        this.hasChoosePagesNumArray.splice(
          this.hasChoosePagesNumArray.indexOf(item),
          1
        );
        this.hasChooseProblemsNum =
          parseInt(this.hasChooseProblemsNum) - parseInt(item.qti_num);
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/assets/css/custom.scss";
.listContainer {
  overflow-y:auto;
  overflow-x:hidden;
  background: #fff;
}
.activeTabClass {
  color: #2ec2a9;
}
.list-item .checkbox {
  width: 25px;
  height: 25px;
  right: 3px;
  top: 42px;
  border-radius: 20px;
  position: absolute;
}
.list-item .checkboxAll {
  width: 25px;
  height: 25px;
  border-radius: 20px;
}
.checkboxAll img {
  width:100%;
  height:100%
}
.bg-class {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.back-up-arrow {
  display: inline-block;
  width: 10px;
  height: 17px;
  background: url('../../../assets/images/public/left.png') no-repeat 0 0;
  background-size: 100% 100%;
  vertical-align: text-bottom;
}
</style>
