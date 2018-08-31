<template>
  <div id="knowledgePoint" class="page" style="z-index: 6">
    <header-bar>
      <div slot="title-name">选择薄弱知识点</div>
      <div slot="right-area" class="right">
      </div>
    </header-bar>

    <div class="list-container">
      <div class="tree-div">
        <el-tree
          show-checkbox
          node-key="id"
          :default-expanded-keys="expandedKeys"
          :default-checked-keys="checkedKeys"
          :props="defaultProps"
          :load="loadNode1"
          lazy
          @check="handleNodeClick"
          ref="tree">
        </el-tree>
      </div>
    </div>

    <div class="btn">
      <div class="btn-n">已选<span class="selectedNumber"> {{selectedNumber}} </span>个知识点</div>
      <div class="btn-m" @click="sureBtn">确定</div>
    </div>

  </div>
</template>

<script>
import HeaderBar from 'common/components/headerBar'
import {tabList} from 'teacherCommon/js/const'
import Scroll from 'common/components/scroll'
import {mapGetters, mapActions} from 'vuex'
import hostingHttp from '../api/api'

export default {
  name: 'knowledgePoint',
  data () {
    return {
      list: tabList,
      active: 0,
      selectedNumber: 0,
      checkboxLists: [],
      expandedKeys: [],
      checkedKeys: [],
      halfCheckedKeys: [],
      searchVal: '',
      teacherSummaryText: '',
      data: [],
      defaultProps: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf'
      },
      weakKpIds: "",
      weakKpLabels: "",
      allKpIds: []
    };
  },
  mounted () {
    var array = this.$route.params.allKpIds || []
    if (array.length > 0) {
      for (let i = 0; i < array.length; i++) {
        // this.expandedKeys.push(array[i])
      }
    }

    var array2 = this.$route.params.weakKpIds || []
    if (array2.length > 0) {
      this.selectedNumber = array2.length
      for (let i = 0; i < array2.length; i++) {
        this.checkedKeys.push(array2[i].id)
      }
    }
  },
  computed: {
    ...mapGetters({
      currentTrusteeship: 'teacherStudent/currentTrusteeship',
      studentHostingArray: 'teacherStudent/studentHostingArray',
      classInfo: 'teacherStudent/classInfo'
    })
  },
  methods: {
    getCheckedNodes() {
      return this.$refs.tree.getCheckedNodes();
    },
    sureBtn () {
      var array = this.studentHostingArray;
      for (let i = 0; i < array.length; i++) {
        if (array[i].depositId === this.currentTrusteeship.depositId) {
          this.selectedNodes = this.getCheckedNodes();
          var array2 = this.selectedNodes;
          for (let i = 0; i < array2.length; i++) {
            if (i + 1 === array2.length) {
              this.weakKpIds += array2[i].id;
              this.weakKpLabels += array2[i].label;
            } else {
              this.weakKpIds += array2[i].id + ",";
              this.weakKpLabels += array2[i].label + " ";
            }
            this.allKpIds.push(array2[i].id)
          }

          array[i].weakKpIds = "";
          array[i].weakKpLabels = "";
          array[i].allKpIds = [];
          array[i].weakKpIds = this.selectedNodes;
          array[i].weakKpLabels = this.weakKpLabels;
          array[i].allKpIds = this.allKpIds;
        }
      }
      this.setStudentHostingArray(array)
      this.$router.back(-1);
    },
    loadNode1(node, resolve) {
      let pid = node.data === undefined ? 0 : node.data.gid;
      this.getChildKnowledgePoint(pid).then(r => {
        var array = r;
        for (let i = 0; i < array.length; i++) {
          array[i].label = array[i].name;
          if (array[i].type === 1) {
            array[i].leaf = true
          }
        }
        if (array.length === 0) {
          resolve([]);
        } else {
          resolve(array);
        }
      })
    },
    getChildKnowledgePoint (pid) {
      var self = this;
      var data = {
        info: {
          "subject": self.currentTrusteeship.subject,
          "period": 2,
          "pid": pid
        }
      };
      return hostingHttp.Kpoint(data)
    },
    getKnowledgePoint (pid) {
      var self = this;
      var data = {
        info: {
          "subject": self.currentTrusteeship.subject,
          "period": 2,
          "pid": pid
        }
      };
      return hostingHttp.Kpoint(data)
    },
    handleNodeClick(currentObj, data) {
      this.selectedNodes = data.checkedNodes;
      this.halfCheckedKeys = data.halfCheckedKeys;
      this.selectedNumber = data.checkedNodes.length;

      // for (let i = 0; i < this.halfCheckedKeys.length; i++) {
      //   this.allKpIds.push(this.halfCheckedKeys[i])
      // }

      // var arr = [...new Set(this.allKpIds)]

      // this.allKpIds = arr;
    },
    ...mapActions({
      setStudentHostingArray: 'teacherStudent/studentHostingArrayAction'
    })
  },
  watch: {
  },
  components: {
    HeaderBar,
    Scroll
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
.list-container {
  height: calc(100vh - 110px);
  overflow-y: auto;
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
.selectedNumber {
  color: red;
}
.btn{
  position: fixed;
  width: 100%;
  height: calc(115px/2);
  line-height: calc(115px/2);
  bottom: 0;
  background: #fff;
  border-top: 1px solid #f5f5f7;
  .btn-m{
    width: calc(190px/2);
    height: calc(90px/2);
    line-height: calc(90px/2);
    text-align: center;
    font-size: calc(34px/2);
    letter-spacing: calc(2px/2);
    color: #fff;
    background:$green-primary-color ;
    border-radius: calc(34px/2)/calc(42px/2);
    float: right;
    margin-right: calc(20px/2);
    margin-top: calc(12px/2);
  }
  .btn-n {
    float: left;
    color: #111111;
    margin-left: calc(20px/2);
    font-size: calc(32px/2);
  }
}
</style>
