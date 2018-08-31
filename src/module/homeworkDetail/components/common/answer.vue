<template>
  <van-popup v-model="answer" class="urge-popup" @click-overlay="toggle">
    <div class="urge-container">
      <p>公布答案后，学生完成作答后可查看题目答案和解析，是否公布答案?</p>
      <div class="btn-group">
        <p class="cancel" @click="toggle">取消</p>
        <p class="confirm" @click="confirm">确认</p>
      </div>
    </div>
  </van-popup>
</template>
<script>
import homeworkDetil from "../../axios/detail.js";
import { Toast } from 'vant';
export default {
  name: "answer",
  props: {
    publishId: {
      type: String
    },
    classId: {
      type: String
    },
    sectionType: {
      type: String
    },
    students: {
      type: Array
    }
  },
  data() {
    return {
      answer: true
    };
  },
  methods: {
    toggle() {
      this.$emit("toggle");
    },
    confirm() {
      let params = {
        publish_id: this.publishId,
        class_id: this.classId,
        teacher_id: JSON.parse(window.localStorage.userinfo).userid
      };
      // if (this.sectionType !== '20') {
      //   params.student_id = []
      //   for (let i = 0; i < this.students.length; i++) {
      //     if (this.students[i].status === 3) {
      //       params.student_id.push(this.students[i].userid)
      //     }
      //   }
      //   params.student_id = params.student_id.join(',')
      // }
      homeworkDetil.sendAnswer(params).then(r => {
        Toast('答案已公布！')
        this.$emit("toggle", 1);
        // console.log(r);
      });
    }
  }
};
</script>
<style scoped>
.urge-popup {
  width: calc(100vw - 85px);
  border-radius: 10px;
  padding: 30px;
  box-sizing: border-box;
}
.urge-container > p {
  line-height: 25px;
  text-indent: 2rem;
}
.btn-group {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}
.btn-group > p {
  font-size: 17px;
  box-sizing: border-box;
  width: 100px;
  height: 50px;
  line-height: 48px;
  text-align: center;
  background: #fff;
  color: #08b783;
  border: 1px solid #08b783;
  border-radius: 13px;
}
.btn-group > p:first-child:active {
  background: #f3fff8;
  color: #8cd3be;
  border-color: #8cd9c2;
}
.btn-group > p.confirm {
  background: #08b783;
  color: #fff;
}
.btn-group > p.confirm:active {
  opacity: 0.5;
}
</style>
