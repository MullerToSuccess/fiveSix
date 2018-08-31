<template>
  <div class="page">
    <div v-if="!switchStudentShow">
      <header class="header van-hairline--bottom">
        <div class="back-btn" @click="goHomework"><i class="icon-back"></i></div>
        <div class="title-name" @click="clickSwitchStudent">
          {{studentOneDetail.real_name}}（{{studentOneDetail.num}}/{{studentListArray.length}}）<i class="fa fa-sort-down"></i>
        </div>
        <div class="right-area" @click="goQuondamTitle"><span style="color: rgb(8, 184, 132);">原题</span></div>
      </header>

      <!-- 学生答案 学生互评tab -->
      <div class="btns van-hairline--surround">
        <van-row>
          <van-col span="12" :class="{'active':activeBtn=='studentAnswer'}">
            <span @click="toggleContent('studentAnswer')">学生答案</span>
          </van-col>
          <van-col span="12" v-if="studentAnswerDetailData.qti_question_type_id != '5' && version !== 1" class="student" :class="{'active':activeBtn=='studentMutualComments'}">
            <span @click="toggleContent('studentMutualComments')">学生互评</span>
          </van-col>
        </van-row>
      </div>
      <studentAnswer @video-play="getVideoPlay" @emit-paint="emitPaint" v-if="activeBtn === 'studentAnswer'" :audioPlay="audioPlay" :answerInfo="answerInfo"></studentAnswer>
      <studentMutualComments v-if="activeBtn === 'studentMutualComments'" :listObj="listObj"></studentMutualComments>
    </div>

    <div v-if="switchStudentShow" style="height: 100%;">
      <header class="header van-hairline--bottom">
        <div class="back-btn" @click="goCorrectTheSubject"><i class="icon-back"></i></div>
        <div class="title-name">
          切换学生
        </div>
        <div class="right-area"><span style="color: rgb(8, 184, 132);"></span></div>
      </header>

      <div class="containerUl">
        <ul>
          <li class="list-item" v-for="(item, index) in studentListArray" :key="index" @click="clickStudent(item)">
            <div class="avatorSpanDiv">
              <span class="avatorSpan">
                <img class="avator" :src="item.avatar"/>
              </span>
              <div class="bg-class checkbox">
                <img src="@/assets/images/batchEvaluate/chooseAvator.png" v-if="item.selectState" class="selectStateImg"/>
              </div>
            </div>
            <div class="realName"><i class="statusStudent" v-if="item.status === 1"></i>{{ item.real_name }}</div>
          </li>
        </ul>
      </div>
    </div>

    <div class="toolBar" v-if="!switchStudentShow">
      <div class="publish-homework-btn-div bottomMargin" @click="emitPaint({idx: -1})">
        <div class="publish-homework-btn">
          <img src="@/assets/images/answerDetail/onePen.png" alt="画笔">
        </div>
      </div>

      <div class="publish-homework-btn-div bottomMarginSecond" @click="correctIdeaBtn">
        <div class="publish-homework-btn">
          <img src="@/assets/images/answerDetail/note.png" alt="批改意见">
          <i class="redp" v-if="studentAllInfo.comment != ''"></i>
        </div>
      </div>

      <div class="publish-homework-btn-div" @click="shareClassBtn" v-show="$route.params.hour_section_type_id != 20">
        <div class="publish-homework-btn">
          <img src="@/assets/images/answerDetail/share.png" alt="分享班级">
        </div>
      </div>
    </div>

    <div class="videoClass" v-if="videoShow">
      <video width="100%" height="100% " preload='auto' v-on:loadeddata="playerready" autoplay :src='videoUrl' webkit-playsinline='true' playsinline='true' x-webkit-airplay='true' x5-video-player-type='h5' x5-video-player-fullscreen='true' x5-video-ignore-metadata='true' >
        <p>不支持video</p>
      </video>
    </div>

    <div class="videoCloseIcon" v-if="videoShow" @click="closeVideoShow"><i class="fa fa-times-circle"></i></div>

    <!-- 底部按钮 -->
    <div class="bottom-btn">
      <div class="lastPerson" >
        <div @click="previousPersonFun" v-show="showPreviousPerson && studentListArray.length > 1">上一人</div>
      </div>

      <div class="bottomBar" v-if="!hasCheckShow">
        <div class="bottomDiv" @click="clickPercentageNum('0')">
          <img class="bottomImgWidth" v-if="percentageNum != '0'" src="@/assets/images/answerDetail/errorDefault.png" alt="错误-默认">
          <img class="bottomImgWidth" v-if="percentageNum == '0'" src="@/assets/images/answerDetail/errorChoose.png" alt="错误-选中">
        </div>
        <div class="bottomDiv" key="a" v-if="percentageNum.length > 0" @click="clickHalfRightDefault">
          <div class="bottomNum" v-if="percentageSymbolShow">{{Math.round(percentageNum)}}%</div>
          <div class="bottomNum" v-if="!percentageSymbolShow">{{percentageNum}}</div>
        </div>
        <div class="bottomDiv" key="b" v-else @click="clickHalfRightDefault">
          <img class="bottomImgWidth" v-if="!percentageShow" src="@/assets/images/answerDetail/halfRightDefault.png" alt="半对-默认">
          <img class="bottomImgWidth" v-if="percentageShow" src="@/assets/images/answerDetail/halfRightChoose.png" alt="半对-选中">
        </div>
        <div class="bottomDiv" @click="clickPercentageNum('全对')">
          <img class="bottomImgWidth" v-if="percentageNum != studentAllInfo.should_score" src="@/assets/images/answerDetail/rightDefault.png" alt="正确-默认">
          <img class="bottomImgWidth" v-if="percentageNum == studentAllInfo.should_score" src="@/assets/images/answerDetail/rightChoose.png" alt="正确-选中">
        </div>
      </div>

      <div class="bottomBarCheck" v-if="hasCheckShow">
        <div class="bottomDiv">
          <div class="bottomNum">阅</div>
        </div>
        <div class="bottomDiv">
          <div @click="hasCheckShow = false">修改</div>
        </div>
      </div>

      <div class="nextPerson">
        <div @click="nextPersonFun" v-show="showNextPerson && studentListArray.length > 1">下一人</div>
        <div @click="nextSubject" v-show="!showNextPerson && studentListArray.length > 0">下一题</div>
      </div>
    </div>

    <div class="cover" v-if="percentageShow && version === 1" @click="percentageShowFun" :class="{'active': activeItem > 0}"></div>
    <div class="percentage" v-if="percentageShow" :class="{'active': activeItem > 0}">
      <div class="percentage-line">
        <div class="percentage-num" @click="clickPercentageNum('0.1')">10%</div>
        <div class="percentage-num" @click="clickPercentageNum('0.2')">20%</div>
        <div class="percentage-num" @click="clickPercentageNum('0.3')">30%</div>
        <div class="percentage-num" @click="clickPercentageNum('0.4')">40%</div>
        <div class="percentage-num" @click="clickPercentageNum('0.5')">50%</div>
      </div>
      <div class="percentage-line">
        <div class="percentage-num" @click="clickPercentageNum('0.6')">60%</div>
        <div class="percentage-num" @click="clickPercentageNum('0.7')">70%</div>
        <div class="percentage-num" @click="clickPercentageNum('0.8')">80%</div>
        <div class="percentage-num" @click="clickPercentageNum('0.9')">90%</div>
      </div>
    </div>

    <div class="keyInputNumberDiv" v-if="keyboardShow">
      <div class="keyInputNumberDivNumber">{{keyInputNumber}}</div>
      <div class="keyInputNumberDivTip">满分：{{shouldScore}}分</div>
    </div>

    <div class="keybordTitle" v-if="keyboardShow">
      <span class="keybordTitleSpan"></span>
      <span class="keybordTitleText" @click="closeKeyBoard">完成</span>
    </div>

    <div class="coverKeyBoardClass" v-if="keyboardShow" @click="keyboardShow = false"></div>

    <van-number-keyboard
      :show="keyboardShow"
      extra-key="."
      @input="onInput"
      @delete="onDelete"
      :transition="false"
    />

    <div class="loading-mask" v-show="loading">
      <van-loading type="spinner" color="black" />
    </div>
  </div>
</template>

<script>
/* eslint-disable */
  import { mapState, mapGetters, mapMutations } from "vuex";
  import api from "@/module/answerDetail/axios/checkAnswerDetail.js";
  import mixinMethods from "./mixinMethods";
  import studentAnswer from "@/components/common/studentAnswer.vue";
  import studentMutualComments from "@/components/common/studentMutualComments.vue";

  export default {
    name: "checkAnswerDetail",
    components: {
      studentMutualComments,
      studentAnswer
    },
    data() {
      return {
        userid: "",
        listObj: {},
        hasCheckShow: false,
        activeBtn: "studentAnswer",
        loading: false,
        answerInfo: {
          audio: [],
          images: [],
          picsImage: [],
          video: [],
          inputarray: [],
          is_correct: [],
          qtiArray: []
        },
        listContainerStyle: {
          height: window.innerHeight - 50 + "px"
        },
        qti_question_type_id: '',
        studentListArray: [],
        studentAllInfo: {
          comment: ''
        },
        switchStudentShow: false,
        studentOneDetail: {},
        studentAnswerDetailData: this.$store.state.answerDetail.studentAnswerDetailData,
        activeItem: 0,
        percentageShow: false,
        showNextPerson: true,
        showPreviousPerson: false,
        percentageNum: "",
        inputarray: [],
        is_correct: [],
        keyboardShow: true,
        keyInputNumber: "",
        version: 0,
        shouldScore: 1,
        percentageSymbolShow: false,
        audioPlay: 0,
        videoUrl: "",
        videoShow: false
      };
    },
    mixins: [mixinMethods],
    computed: {
      ...mapGetters({
        env: "runEnv/old"
      })
    },
    activated() {
    },
    mounted: function() {
      console.log(this.$route.params);
      this.keyboardShow = false;
      this.userInfo = this.$store.state.account.userInfo;
      this.homeworkOneListInfoObj = this.$store.state.homeworkDetail.homeworkInfo;
      this.userid = JSON.parse(localStorage.getItem("userinfo") || "{}").userid;
      this.version = this.$store.state.answerDetail.studentAnswerDetailData.version ? this.$store.state.answerDetail.studentAnswerDetailData.version : 0;
      this.getUserStatusListFun();
      this.lastStudent();
      this.firstStudent();
    },
    methods: {
      ...mapMutations({
        setStudentOneDetail: 'answerDetail/setStudentOneDetail',
        setStudentAllInfoObj: 'answerDetail/setStudentAllInfoObj'
      }),
      goHomework() {
        this.$router.go(-1);
      },
      playerready() {
        this.$toast.clear()
      },
      goQuondamTitle() {
        sessionStorage.setItem('studentOneDetail.num', this.studentOneDetail.num);
        this.$router.push({
          name: "quondamTitle",
          params: {
            studentInfo: this.studentOneDetail
          }
        });
      },
      getVideoPlay(data) {
        console.log(data);
        this.$toast.loading({
          mask: true,
          message: "加载中...",
          duration: 0
        });
        this.videoUrl = data.videoUrl;
        this.videoShow = data.videoShow;
      },
      onInput(value) {
        var num = this.keyInputNumber + String(value);
        if ((num.length <= 3 && (num.match(/\./g) || []).length < 2) || (num.length == 4 && num.indexOf(".") === 2)) {

          if (num.indexOf(".") === 0) {
            num = "0" + num;
          } else if (num.indexOf(".") !== num.length - 1){
            num = parseFloat(num);
          }

          if (num >= this.shouldScore){
            num = this.shouldScore
          }

          this.keyInputNumber = num;
        }
      },
      onDelete() {
        this.keyInputNumber = "";
      },
      closeVideoShow() {
        this.videoShow = false;
      },
      round (v, e = 0){
        var t = Math.pow(10, e);
        return Math.round(v * t) / t;
      },
      closeKeyBoard() {
        this.keyboardShow = false;
        if (this.keyInputNumber !== "") {
          this.percentageNum = String(this.keyInputNumber);
          var num = this.keyInputNumber / this.studentAllInfo.should_score;
          var result = this.round(num, 3);
          this.setScore(result);
        }
      },
      percentageShowFun() {
        this.percentageShow = false;
      },
      lastStudent() {
        const array = this.studentListArray;
        for (let i = 0; i < array.length; i++) {
          if (this.studentOneDetail.userid === array[i].userid) {
            if (i + 1 >= array.length) {
              this.showNextPerson = false;
            } else {
              this.showNextPerson = true;
            }
          }
        }
      },
      firstStudent() {
        const array = this.studentListArray;
        for (let i = 0; i < array.length; i++) {
          if (this.studentOneDetail.userid === array[i].userid) {
            if (i === 0) {
              this.showPreviousPerson = false;
            } else {
              this.showPreviousPerson = true;
            }
          }
        }
      },
      previousPersonFun() {
        this.keyInputNumber = "";
        this.audioPlay -= 1;
        const array = this.studentListArray;
        this.showNextPerson = true;
        for (let i = 0; i < array.length; i++) {
          if (this.studentOneDetail.userid === array[i].userid) {
            this.studentOneDetail = this.studentListArray[i - 1];
            this.clickStudent(this.studentListArray[i - 1]);
            this.showPreviousPerson = true;
            break;
          }
        };
        this.activeBtn = 'studentAnswer';
        this.firstStudent();
      },
      nextPersonFun() {
        this.keyInputNumber = "";
        this.audioPlay += 1;
        const array = this.studentListArray;
        this.showPreviousPerson = true;
        for (let i = 0; i < array.length; i++) {
          if (this.studentOneDetail.userid === array[i].userid) {
            if (i + 1 >= array.length) {
              this.showNextPerson = false;
              break;
            } else {
              this.studentOneDetail = this.studentListArray[i + 1];
              this.clickStudent(this.studentListArray[i + 1]);
              this.showNextPerson = true;
              break;
            }
          }
        };
        this.activeBtn = 'studentAnswer';
        this.lastStudent();
      },
      clickSwitchStudent() {
        this.switchStudentShow = !this.switchStudentShow;
      },
      clickHalfRightDefault() {
        // if (this.version === 1) {
        //   this.percentageShow = !this.percentageShow;
        // } else {
        //   this.keyboardShow = true
        // }

        if (this.studentAllInfo.should_score >=0) {
          this.keyboardShow = true;
          this.shouldScore = this.studentAllInfo.should_score;
        } else {
          this.percentageShow = !this.percentageShow;
        }

      },
      toggleContent(items) {
        this.activeBtn = items;
      },
      clickPercentageNum(num) {
        this.percentageShow = false;
        if (num !== "全对") {
          this.percentageNum = String(num);
          this.setScore(num);
        } else {
          this.percentageNum = String(this.studentAllInfo.should_score);
          this.setScore("1");
        }
      },
      nextSubject() {
        window.bus.$emit('nextSubject', true);
        this.$router.go(-1);
      },
      setScore(num) {
        var self = this;
        var data = {
          publish_id: self.studentAnswerDetailData.course_hour_publish_id,
          course_resource_id: self.studentAnswerDetailData.course_resource_id,
          student_id: self.studentOneDetail.userid,
          teacher_id: self.userInfo.userid,
          dcom_entity_id: self.studentAnswerDetailData.dcom_entity_id,
          qti_question_id: self.studentAnswerDetailData.qti_question_id ? self.studentAnswerDetailData.qti_question_id : self.studentAnswerDetailData.source_pk_id,
          correct_rate: num
        };
        self.loading = true;
        api.setScore(data).then(
          response => {
            self.loading = false;
            self.studentListArray.filter((ele, index) => {
              if (self.studentOneDetail.userid === ele.userid) {
                self.studentListArray[index].status =  self.studentListArray[index].status === 4 ? 4 : 3 
              }
            })
            let bool = self.studentListArray.some(ele => {
              return ele.status === 1
            })
            // console.log(789, bool)
            window.bus.$emit('modifyScore', bool ? 1 : 3) // 按题批改数据更改
            window.bus.$emit('modifyStu') // 按人批改学生状态变更
            if (self.studentAnswerDetailData.yx_father) {
              window.bus.$emit('modifyMini',{
                publish_id: self.studentAnswerDetailData.course_hour_publish_id,
                course_resource_id: self.studentAnswerDetailData.course_resource_id,
                dcom_entity_id: self.studentAnswerDetailData.dcom_entity_id
              }, self.studentAnswerDetailData.yx_father.resource_id)
            }
          },
          err => {
            console.log(err);
            self.$toast("网络异常");
          }
        );
      },
      getUserStatusListFun: function() {
        var self = this;
        var data = {
          publish_id: self.studentAnswerDetailData.course_hour_publish_id,
          course_resource_id: self.studentAnswerDetailData.course_resource_id,
          qti_question_id: self.studentAnswerDetailData.source_pk_id,
          dcom_entity_id: self.studentAnswerDetailData.dcom_entity_id
        };
        api.getUserStatusList(data).then(
          response => {
            var array = response;
            array.forEach(element => {
              if (element.avatar.indexOf("http://") === -1) {
                element.avatar = self.env + element.avatar;
              }
            });
            self.studentList = array;
            self.formatStudentList();
            self.getStudentAnswerList();
            self.getStudentMutualCommentsList();
          },
          err => {
            console.log(err);
            self.$toast("网络异常");
          }
        );
      },
      formatStudentList() {
        let num = null;
        const array = this.studentList;
        this.studentListArray = [];
        for (let i = 0; i < array.length; i++) {
          if (array[i].status > 0) {
            this.studentListArray.push(array[i]);
          }
        }
        for (let i = 0; i < this.studentListArray.length; i++) {
          this.studentListArray[i].num = i + 1;
        }
        if (this.$route.params.detailData && !this.$route.params.studentInfo) {
          this.studentOneDetail = this.studentListArray[0];
        } else if(num = sessionStorage.getItem('studentOneDetail.num')) {
          sessionStorage.removeItem('studentOneDetail.num');
          this.studentOneDetail = this.studentListArray[num - 1];
        }  else if(this.$route.params.detailData && this.$route.params.studentInfo) {
          for (let i = 0; i < this.studentListArray.length; i++) {
            if(this.studentListArray[i].userid === this.$route.params.studentInfo.userid) {
              this.studentOneDetail = this.studentListArray[i];
            }
          }
        }

        if(this.studentListArray.length === 1){
          this.showNextPerson = false;
        }

        this.setStudentOneDetail(this.studentOneDetail);
      },
      getStudentMutualCommentsList: function() {
        var self = this;
        var data = {
          publish_id: self.studentAnswerDetailData.course_hour_publish_id,
          view_userid: self.userInfo.userid,
          course_resource_id: self.studentAnswerDetailData.course_resource_id,
          qti_question_id: self.studentAnswerDetailData.source_pk_id,
          user_id: self.studentOneDetail.userid,
          page: "1",
          per_page: "999"
        };
        api.studentMutualCommentsGetLists(data).then(
          response => {
            const listObj = response;
            var array = listObj.lists;
            array.forEach(element => {
              element.rank = Number(element.rank);
              if (element.avatar.indexOf("http://") === -1) {
                element.avatar = self.env + element.avatar;
              }
            });
            listObj.score = Math.round(Number(listObj.score));
            listObj.lists = array;
            listObj.studentsNum = listObj.lists.length;
            self.listObj = listObj;
          },
          err => {
            console.log(err);
            self.$toast("网络异常");
          }
        );
      },
      goCorrectTheSubject() {
        this.switchStudentShow = false;
      },
      clickStudent(item) {
        this.switchStudentShow = false;
        this.studentOneDetail = item;
        this.setStudentOneDetail(this.studentOneDetail);
        this.getStudentAnswerList();
        this.getStudentMutualCommentsList();
        this.firstStudent();
        this.lastStudent();
      },
      ToCDB(str) {
       var tmp = "";
       for (var i = 0; i < str.length; i++) {
          if (str.charCodeAt(i) > 65248 && str.charCodeAt(i) < 65375) {
            tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
          }
          else {
            tmp += String.fromCharCode(str.charCodeAt(i));
          }
       }
       return tmp
      },
      getStudentAnswerList: function(value) {
        var self = this;
        var data = {
          publish_id: self.studentAnswerDetailData.course_hour_publish_id,
          course_resource_id: self.studentAnswerDetailData.course_resource_id,
          dcom_entity_id: self.studentAnswerDetailData.dcom_entity_id,
          source_pk_id: self.studentAnswerDetailData.source_pk_id,
          user_id: self.studentOneDetail.userid,
          icom_id: self.studentAnswerDetailData.icom_id,
          dcom_id: self.studentAnswerDetailData.dcom_id
        };
        self.loading = true;
        api.getUserAnswerForMiniRs(data).then(
          response => {

            self.studentAllInfo = response;
            // 更改学生列表的批改状态，保持同步
            self.studentListArray.filter((ele, index) => {
              if (ele.userid === response.userid) {
                self.studentListArray[index].status = response.status
              }
            })
            // 是否显示百分号
            if (response.should_score >= 0) {
              self.percentageSymbolShow = false;
            } else {
              self.percentageSymbolShow = true;
            }

            // 是否已阅
            if (response.marked === 1){
              self.hasCheckShow = true;
            } else {
              self.hasCheckShow = false;
            }

            if (response.correct_rate !== "" && response.correct_rate !== -1) {
              self.percentageNum = Math.round(response.correct_rate * self.studentAllInfo.should_score * 10)/10 + "";
            } else {
              self.percentageNum = "";
            }

            // if (response.marked === 1 && response.correct_rate < 0) {
            //   self.percentageNum = "";
            // }

            // if (response.marked === 0 && response.correct_rate >= 0) {
            //   self.percentageNum = String(response.correct_rate);
            // }
            // debugger

            var answerObj = [];

            if (response.answer != false) {
              if (response.answer[0]) {
                answerObj = response.answer[0].answer_detail;
              } else {
                answerObj = response.answer.answer_detail;
              }
            } else {
              answerObj.images = [];
              answerObj.audio = [];
              answerObj.video = [];
              answerObj.inputarray = [];
              answerObj.is_correct = [];
              answerObj.characters = "";
            }
            this.inputarray = [];
            this.is_correct = [];
            this.qtiArray = [];
            if (String(answerObj.characters) != '' && Array.isArray(answerObj.characters) && answerObj.characters.length > 0) {
              for (var i = 0; i < answerObj.characters.length; i++) {
                this.inputarray[i] = answerObj.characters[i].value.length > 0 ? answerObj.characters[i].value : [{}];
                this.is_correct[i] = answerObj.characters[i].correct;
                this.qtiArray.push({
                  inputarray: answerObj.characters[i].value,
                  is_correct: new Array(answerObj.characters[i].correct)
                })
              }
            } else {
              answerObj.characters = decodeURIComponent(encodeURIComponent(String(answerObj.characters) === '' ? '' : answerObj.characters + ''));
              answerObj.characters = self.ToCDB(answerObj.characters);
            }
            answerObj.inputarray = this.inputarray;
            answerObj.is_correct = this.is_correct;
            answerObj.qtiArray = this.qtiArray;
            // debugger
            if (answerObj.images[0] && answerObj.images.length > 0) {
              var arrayImages = [];

              for (let i = 0; i < answerObj.images.length; i++) {
                let element = answerObj.images[i];
                if (element.indexOf("http://") === -1) {
                  element = self.env + element;
                  arrayImages.push(element);
                } else {
                  arrayImages.push(element);
                }
              }
              answerObj.images = arrayImages;
            }

            if (answerObj.video[0] && answerObj.video[0].length > 0) {
              if (Array.isArray(answerObj.video[0])) {
                var arrayVideo = [];
                var allVideoArray = answerObj.video;

                for (let j = 0; j < allVideoArray.length; j++) {
                  var array2 = allVideoArray[j];
                  for (let i = 0; i < array2.length; i++) {
                    var element2 = array2[i];
                    if (element2 && element2.length > 20 && element2.indexOf("http://") === -1) {
                      element2 = self.env + element2;

                      if (element2.substring(element2.length - 4) !== '.dms') {
                        arrayVideo.push(element2);
                      }
                    }
                  }
                }

                answerObj.video = arrayVideo;
              } else {
                var arrayVideo = [];
                var array2 = answerObj.video;
                for (let i = 0; i < array2.length; i++) {
                  var element2 = array2[i];
                  if (element2 && element2.indexOf("http://") === -1) {
                    element2 = self.env + element2;
                  }
                  if (element2.substring(element2.length - 4) !== '.dms') {
                    arrayVideo.push(element2);
                  }
                }
                answerObj.video = arrayVideo;
              }
            }

            if (answerObj.audio[0] && answerObj.audio[0].length > 0) {
              var arrayAudio = [];
              var allAudioArray = answerObj.audio;

              for (let j = 0; j < allAudioArray.length; j++) {
                var array3 = allAudioArray[j];
                for (let i = 0; i < array3.length; i++) {
                  var element3 = array3[i];
                  if (element3 && element3.length > 20 && element3.indexOf("http://") === -1) {
                    element3 = self.env + element3;
                    arrayAudio.push(element3);
                  }
                }
              }
              answerObj.audio = arrayAudio;
            }
            Object.assign(self.answerInfo, answerObj, {});
            self.loading = false;
          },
          err => {
            console.log(err);
            self.$toast("网络异常");
          }
        );
      },
      shareClassBtn() {
        sessionStorage.setItem('studentOneDetail.num', this.studentOneDetail.num);
        this.$router.push({
          name: "share",
          params: {
            classId: this.studentAllInfo.class_id,
            answer: this.answerInfo,
            course_hour_publish_id: this.studentAnswerDetailData['course_hour_publish_id'],
            studentInfo: this.studentAnswerDetailData,
            studentAllInfo: this.studentAllInfo
          }
        });
      },
      correctIdeaBtn() {
        sessionStorage.setItem('studentOneDetail.num', this.studentOneDetail.num);
        var data = {
          comment: this.studentAllInfo.comment,
          comment_audio: this.studentAllInfo.comment_audio.length > 0 ? this.studentAllInfo.comment_audio[0] : {}
        };
        this.setStudentAllInfoObj(data);
        this.setStudentOneDetail(this.studentOneDetail);
        this.$router.push({
          name: "correctIdea",
          params: {
            studentInfo: this.studentOneDetail,
            comment: this.studentAllInfo.comment
          }
        });
      },
    },
    beforeRouteLeave(to, from, next) {
      this.$destoryMp3();
      next();
    }
  };
</script>

<style scoped lang="scss">
@import "@/style/variable.scss";
.redp {
  width: 7px;
  height: 7px;
  position: absolute;
  background: #ff0000;
  border-radius: 50%;
  top: 2px;
  right: 5px;
}
.statusStudent {
  width: 1rem;
  height: 1rem;
  background-size: auto 1rem;
  left: 0;
  vertical-align: text-bottom;
  background-image: url('../../../assets/images/public/status.png');
  display: inline-block;
}
.header{
  height: 45px;
  width: 100%;
  padding: 0 13px;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  .back-btn{
    display: inline-block;
    font-size: 15px;
    flex: 0 0 50px;
    // width: 50px;
    color: #4f4f50;
    line-height: 45px;
    .icon-back{
      display: inline-block;
      width: 10px;
      height: 17px;
      background: url('../../../assets/images/public/left.png') no-repeat 0 0;
      background-size: 100% 100%;
      vertical-align: text-bottom;
    }
    span{
      display: inline-block;
    }
  }
  .title-name{
    font-size: 16px;
    flex: 0 0 220px;
    text-align: center;
    line-height: 45px;
    margin-left: 20px;
    .name{
      display: inline-block;
      width: 90px;
      text-align: right;
    }
    .step{
      width: 80px;
      text-align: left;
      display: inline-block;
      vertical-align: top;
    }
  }
  .right-area{
    flex: 0 0 60px;
    line-height: 45px;
    font-size: 16px;
    text-align: right;
  }
}
.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10001;
  display: flex;
  justify-content: center;
  align-items: center;
}
.keybordTitleSpan {
  font-size: 3.73333vw;
  line-height: 8vw;
  text-align: center;
  color: #666;
}
.keybordTitle {
  height: 40px;
  width: 100%;
  font-size: 3.73333vw;
  line-height: 40px;
  text-align: center;
  position: relative;
  color: #666;
  position: absolute;
  bottom: 210px;
  z-index: 100;
  background: #fff;
  border: 1px solid #ccc;
}
.keybordTitle::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  -webkit-transform: scale(.5);
  transform: scale(.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  pointer-events: none;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border: 0 solid #e5e5e5;
  boter-top-width: 1px;
}
.keybordTitleText {
  right: 0;
  color: #38f;
  font-size: 3.73333vw;
  padding: 0 4vw;
  position: absolute;
}
.containerUl {
  height: calc(100% - 65px - 45px);
  overflow-y: scroll;
}
.videoCloseIcon {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 999;
  color: #fff;
  font-size: 30px;
}
.videoClass {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  z-index: 998;
  height: 100%;
  background: rgba(0,0,0,0.8);
}
.lastPerson {
  width: 21%;
  text-align: left;
  padding-left: 12px;
}
.nextPerson {
  width: 21%;
  text-align: right;
  padding-right: 12px;
}
.toolBar {
  position: absolute;
  right:-10px;
  bottom: 85px;
}
.bottomDiv {
  width: 50px;
  height: 50px;
  line-height: 50px;
}
.bottomImgWidth {
  width: 100%;
}
.bottomNum {
  border-radius: 50%;
  color: #fff;
  text-align: center;
  background: #ff8d13
}
.bottomBar {
  width: 58%;
  display: flex;
  margin: 0px auto;
  justify-content: space-between;
  padding:7.5px 0px;
}
.bottomBarCheck {
  width: 36%;
  display: flex;
  margin: 0px auto;
  justify-content: space-between;
  padding:7.5px 0px;
}
.keyInputNumberDiv {
  border: 1px solid #ccc;
  box-sizing: border-box;
  background: #fff;
  position: absolute;
  bottom: 246px;
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 22px;
  padding-left: 10px;
  z-index: 100;
}
.keyInputNumberDivTip {
  float: right;
  font-size: 16px;
  color: #333;
}
.keyInputNumberDivNumber {
  float: left;
}
.percentage-line {
  height: calc(#{$bottom-height}* 1);
  line-height: calc(#{$bottom-height}* 1);
  text-align: center;
}
.percentage-num {
  display: inline-block;
  font-size: 18px;
  padding: 0 10px;
}
.avatorSpanDiv {
  position: relative;
  margin-bottom: 8px;
}
.avatorSpan {
  width: 60px;
  height: 60px;
  display: inline-block;
  position: relative;
}
.avator {
  border-radius: 50%;
  width: 100%;
  height: 100%;
}
.selectStateImg {
  width: 100%;
  height: 100%;
}
.realName {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.activeTabClass {
  color: #2ec2a9;
}
.btns {
  line-height: 44px;
  height: 44px;
  box-sizing: border-box;
  text-align: center;
}
.btns .active span {
  color: #08b783;
  border-bottom: 2px solid #08b783;
}
.btns span {
  display: inline-block;
  height: 42px;
  border-bottom: 2px solid transparent;
}
li {
  display: inline-block;
  width: 20%;
  box-sizing: border-box;
  text-align: center;
  margin-top: 1rem;
  position: relative;
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
  width: 100%;
  height: 100%;
}
.bg-class {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.publish-homework-btn-div {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
.publish-homework-btn {
  height: 60px;
  width: 60px;
}
.publish-homework-btn img {
  width: 100%;
}
.bottomMargin {
  bottom: 200px;
}
.bottomMarginSecond {
  bottom: 110px;
}

/* 底部按钮 */

.bottom-btn {
  position: fixed;
  bottom: 0px;
  width: 100%;
  height: 65px;
  line-height: 65px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  border-top: 1px solid #e8ebee;
  z-index: 2;
}

.bottom-btn .btn {
  flex: 1 1 auto;
  background: #06bb9c;
  border-radius: 13px;
  color: #fff;
  height: 50px;
  line-height: 50px;
  margin-right: 15px;
  text-align: center;
  font-size: 17px;
  width: 100px;
}
.bottom-btn .btn:first-child {
  background: #08b783;
}
.bottom-btn .btn:nth-child(2) {
  background: #3ea2ff;
}
.bottom-btn .btn:last-child {
  background: #2ecbd0;
  margin-right: 0;
}
.cover {
  position: absolute;
  bottom: calc(#{$bottom-height}* 3 + 0.5vw);
  top: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  transition: all 0.2s ease-in;
  // display: none;
  z-index: 30;
  &.active {
    display: block;
  }
}
.percentage {
  position: absolute;
  bottom: calc(#{$bottom-height}* 1 + 3px);
  width: 100%;
  background: #fff;
  height: calc(#{$bottom-height}* 2);
  transition: all 0.2s ease-in;
  // display: none;
  z-index: 30;
  &.active {
    display: block;
  }
}
.coverKeyBoardClass {
  position: absolute;
  bottom: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  transition: all 0.2s ease-in;
  // display: none;
  z-index: 30;
  &.active {
    display: block;
  }
}

</style>

<style lang="scss">
.char-parent {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -2;
  width: 100%;
  background: #fff;
}

.char-item {
  font-size: 1rem;
  line-height: 1.2rem;
  letter-spacing: 1px;
  padding: 0.5rem;
  .order {
    padding: 0 1%;
  }
}
</style>
