<template>
  <div id="group-detail">
    <!-- 按题统计 -->
    <div v-if="!loading && type != 2 || !userId">
      <!-- 5011(口算训练)、5013（小熊射手） -->
      <div v-if="icomId == 5013 || icomId == 5011">
        <div class="header van-hairline--bottom" v-show="type!=3">
          <span>{{params.icom_name | questionName(params)}}</span>
          <span>正确率：<span style="color:#ff4e00">{{correctRate | percent}}</span></span>
        </div>
        <div class="row list-title van-hairline--bottom">
          <div class="cell kwg">知识点</div>
          <div class="cell len">数量</div>
          <div class="cell correct">正确率</div>
          <div class="cell arrow"></div>
        </div>
        <div class="list-body">
          <div class="row" v-for="(qus, index) in homeworkInfo" :key="index">
            <div class="kwg van-hairline--bottom ellipsis">{{qus.name}}</div>
            <div class="len van-hairline--bottom">
              <span>{{qus.child.length}}</span>
            </div>
            <div class="correct van-hairline--bottom">
              <span>{{Math.round((qus.average_rate || qus.correct_rate) * 100)}}%</span>
              <div class="progress">
                <van-progress :percentage="Math.round((qus.average_rate || qus.correct_rate) * 100)" :show-pivot = 'showPovit' color="#34c988"/>
              </div>
            </div>
            <div class="children van-hairline--bottom" v-show="qus.child.length" v-for="(i, r) in qus.child" :key="r" @click="linkToAnswer(homeworkInfo, index, r)">
              <div class="cell placeholder"></div>
              <div class="cell content ellipsis">{{i.content}}</div>
              <div class="cell correct">
                <span>{{Math.round((i.correct_rate) * 100)}}%</span>
                <div class="progress">
                  <van-progress :percentage="Math.round((i.correct_rate) * 100)" :show-pivot = 'showPovit' color="#34c988"/>
                </div>
                <i class="fa fa-angle-right"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- -->
      <div v-if="icomId == 5018">
        <div class="header van-hairline--bottom" v-show="type!=3">
          <span>{{params.icom_name | questionName(params)}}</span>
          <span>正确率：<span style="color:#ff4e00">{{correctRate | percent}}</span></span>
        </div>
        <div class="list-row title van-hairline--bottom">
          <div class="list-cell">题目</div>
          <div class="list-cell">正确率</div>
        </div>
        <div class="list-body">
          <div class="list-row van-hairline--bottom" v-for="(item, index) in homeworkInfo" :key="index" @click="nextPage(homeworkInfo, index)">
            <div class="list-cell ellipsis" v-html="replaceAnswer(item.question, item.right_answer, item.distracts)"></div>
            <div class="list-cell correct">
              <span>{{item.correct_rate | percent}}</span>
              <div class="progress">
                <van-progress :percentage="item.correct_rate * 100" :show-pivot = 'showPovit' color="#34c988"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 口语训练 -->
      <div v-if="icomId == 4629">
        <div class="header van-hairline--bottom" v-show="type!=3">
          <span>{{params.icom_name | questionName(params)}}</span>
          <span>正确率：<span style="color:#ff4e00">{{correctRate | percent}}</span></span>
        </div>
        <div class="list-row title van-hairline--bottom">
          <div class="list-cell">题目</div>
          <div class="list-cell">正确率</div>
        </div>
        <div class="list-body">
          <div class="list-row van-hairline--bottom" v-for="(item, index) in homeworkInfo" :key="index" @click="oraltest(homeworkInfo, index)">
            <div class="list-cell ellipsis" v-html="item.content.text"></div>
            <div class="list-cell correct">
              <div v-if="item.correct_rate >= 0.7">优秀</div>
              <div v-else-if="item.correct_rate >= 0.6 && item.correct_rate < 0.7">良</div>
              <div v-else-if="item.correct_rate >= 0.5 && item.correct_rate < 0.6">中</div>
              <div v-else>待提升</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 汉字听写 -->
      <div v-if="icomId == 5009">
        <div class="header van-hairline--bottom" v-show="type!=3">
          <span>{{params.icom_name | questionName(params)}}</span>
          <span>正确率：<span style="color:#ff4e00">{{this.info[this.index].average_rate | percent}}</span></span>
        </div>
        <div class="list-row title van-hairline--bottom">
          <div class="list-cell">题目</div>
          <div class="list-cell">正确率</div>
        </div>
        <div class="list-body">
          <div class="list-row van-hairline--bottom" v-for="(item, index) in homeworkInfo" :key="index" @click="hanzitingxie(homeworkInfo, index)">
            <div class="list-cell ellipsis" v-html="item.content"></div>
            <div class="list-cell correct">
              <span>{{item.correct_rate | percent}}</span>
              <div class="progress">
                <van-progress :percentage="item.correct_rate * 100" :show-pivot = 'showPovit' color="#34c988"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 文章阅读(5021) 微课(5007) -->
      <div v-if="icomId == 5021 || icomId == 5007">
        <div class="header van-hairline--bottom" v-show="type != 3">
          <span>{{params.icom_name}}&nbsp;&nbsp;&nbsp;<span v-if="icomId == 5021">已阅读</span><span v-if="icomId == 5007">已观看</span> :{{classView}}</span>
          <span>平均用时：<span style="color:#ff4e00">{{averageTime}}秒</span></span>
        </div>
        <div class="list-row title van-hairline--bottom" v-if="icomId == 5021">
          <div class="list-cell">姓名</div>
          <div class="list-cell">阅读次数</div>
          <div class="list-cell">阅读总时长</div>
        </div>
        <div class="list-row title van-hairline--bottom" v-if="icomId == 5007">
          <div class="list-cell">姓名</div>
          <div class="list-cell">观看次数</div>
          <div class="list-cell">观看总时长</div>
        </div>
        <div class="list-body">
          <div class="list-row van-hairline--bottom" v-for="(item, index) in homeworkInfo" :key="index">
            <div class="list-cell">
              <span class="status" v-if="!item.filished"></span>
              <span>{{item.real_name}}</span>
            </div>
            <div class="list-cell">{{item.view_num}}</div>
            <div class="list-cell">{{item.total_time_length}}秒</div>
          </div>
        </div>
      </div>
      <!-- 英语听写 -->
      <div v-if="icomId == 5020">
        <div class="header van-hairline--bottom" v-show="type!=3">
          <span>{{params.icom_name}}</span>
          <span>正确率：<span style="color:#ff4e00">{{correctRate | percent}}</span></span>
        </div>
        <div class="list-row title van-hairline--bottom">
          <div class="list-cell">题目</div>
          <div class="list-cell">正确率</div>
        </div>
        <div class="list-body">
          <div class="list-row van-hairline--bottom" v-for="(item, index) in homeworkInfo" :key="index" @click="engLW(homeworkInfo, index)">
            <div class="list-cell ellipsis">{{item[0]}}</div>
            <div class="list-cell correct">
              <span>{{item[1] | percent}}</span>
              <div class="progress">
                <van-progress :percentage="item[1] * 100" :show-pivot = 'showPovit' color="#34c988"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 508(成功营救)、507(单词汉堡),4643(宝瓶收妖)、4630(单词速记)、5001(字母书写)、5000(闻英起舞)、504(老鹰捉小鸡)、84(群英争霸(句子版))、420(闻英起舞)、4642(宝瓶收妖（听音辨词）)、4424(虎口拔牙)、4423(吃火锅)、503(群英争霸) -->
      <div v-if="icomId == 508 || icomId == 507 || icomId == 4643 || icomId == 4630 || icomId == 5001 || icomId == 5000 || icomId == 504 || icomId == 84 || icomId == 420 || icomId == 4642 || icomId == 4424 || icomId == 4423 || icomId == 503">
        <div class="header van-hairline--bottom" v-show="type!=3">
          <span>{{params.icom_name | questionName(params)}}</span>
          <span>正确率：<span style="color:#ff4e00">{{correctRate | percent}}</span></span>
        </div>
        <div class="list-row title van-hairline--bottom">
          <div class="list-cell">题目</div>
          <div class="list-cell">正确率</div>
        </div>
        <div class="list-body">
          <div class="list-row van-hairline--bottom" v-for="(item, index) in homeworkInfo" :key="index" @click="dchb(homeworkInfo, index)">
            <div class="list-cell ellipsis" v-html="item[0]"></div>
            <div class="list-cell correct">
              <span>{{item[1] | percent}}</span>
              <div class="progress">
                <van-progress :percentage="item[1] * 100" :show-pivot = 'showPovit' color="#34c988"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 5015(斗地鼠) -->
      <div v-if="icomId == 5015">
        <div class="header van-hairline--bottom" v-show="type!=3">
          <span>{{params.icom_name}}</span>
          <span>正确率：<span style="color:#ff4e00">{{correctRate | percent}}</span></span>
        </div>
        <div class="list-row title van-hairline--bottom">
          <div class="list-cell">题目</div>
          <div class="list-cell">正确率</div>
        </div>
        <div class="list-body">
          <div class="list-row van-hairline--bottom" v-for="(item, index) in homeworkInfo" :key="index" @click="dds(homeworkInfo, index)">
            <div class="list-cell ellipsis">
              <span v-for="(val, idx) in item.word" :key="idx" :class='{check: item.checkIndex.replace("\"", "").replace("\"", "") == idx}'>{{val[1]}}</span>
            </div>
            <div class="list-cell correct">
              <span>{{item.correct_rate | percent}}</span>
              <div class="progress">
                <van-progress :percentage="item.correct_rate * 100" :show-pivot = 'showPovit' color="#34c988"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 按人统计 -->
    <div v-if="!loading && type == 2 && userId" class="student-personal">
      <!-- 5011(口算训练)、5013（小熊射手） -->
      <div v-if="icomId == 5013 || icomId == 5011">
        <div class="header van-hairline--bottom">
          <span>{{params.icom_name | questionName(params)}}</span>
          <span>用时: {{userAnswer.time_lenght / 1000 | timeFormatSecond}}</span>
          <span>正确率：<span style="color:#ff4e00">{{userAnswer.correct_rate | percent}}</span></span>
        </div>
        <div class="row list-title van-hairline--bottom">
          <div class="cell kwg">知识点</div>
          <div class="cell len">数量</div>
          <div class="cell correct">正确率</div>
          <div class="cell arrow"></div>
        </div>
        <div class="list-body">
          <div class="row" v-for="(qus, index) in homeworkInfo" :key="index">
            <div class="kwg van-hairline--bottom ellipsis">{{qus.name}}</div>
            <div class="len van-hairline--bottom">
              <span>{{qus.child.length}}</span>
            </div>
            <div class="correct van-hairline--bottom">
              <!-- <span>{{Math.round((qus.average_rate || qus.correct_rate) * 100)}}%</span> -->
              <span>{{userAnswer.items[qus.name].filter((ele) => { return ele[2] === 'right' }).length / userAnswer.items[qus.name].length | percent}}</span>
              <div class="progress">
                <van-progress :percentage="Math.round(userAnswer.items[qus.name].filter((ele) => { return ele[2] === 'right' }).length / userAnswer.items[qus.name].length * 100)" :show-pivot = 'showPovit' color="#34c988"/>
              </div>
            </div>
            <div class="children van-hairline--bottom" v-show="qus.child.length" v-for="(i, r) in qus.child" :key="r">
              <div class="cell placeholder"></div>
              <div class="cell content ellipsis">{{i.content}}</div>
              <div class="cell correct">
                <span class="icon" :class="{right: userAnswer.items[qus.name][r][2] === 'right', wrong: userAnswer.items[qus.name][r][2] === 'none' || userAnswer.items[qus.name][r][2] === 'wrong'}"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 小熊射手-->
      <div v-if="icomId == 5018">
        <div class="header van-hairline--bottom" v-show="type!=3">
          <span>{{params.icom_name | questionName(params)}}</span>
          <span>正确率：<span style="color:#ff4e00">{{correctRate || userAnswer.correct_rate | percent}}</span></span>
        </div>
        <div class="list-row title van-hairline--bottom">
          <div class="list-cell">题目</div>
          <div class="list-cell">正确率</div>
        </div>
        <div class="list-body">
          <div class="list-row van-hairline--bottom" v-for="(item, index) in homeworkInfo" :key="index">
            <div class="list-cell ellipsis" v-html="replaceAnswer(item.question, item.right_answer, item.distracts)"></div>
            <div class="list-cell correct">
              <!-- <span>{{item.correct_rate | percent}}</span>
              <div class="progress">
                <van-progress :percentage="item.correct_rate * 100" :show-pivot = 'showPovit' color="#34c988"/>
              </div> -->
              <span class="icon" :class="{right: userAnswer.items[index][1] === 'right', wrong: userAnswer.items[index][1] === 'none' || userAnswer.items[index][1] === 'wrong'}"></span>
            </div>
          </div>
        </div>
      </div>
      <!-- 口语训练 -->
      <div v-if="icomId == 4629">
        <div class="header van-hairline--bottom">
          <span>{{params.icom_name | questionName(params)}}</span>
          <span>用时: {{userAnswer.time_length | timeFormatSecond}}</span>
          <span>正确率：<span style="color:#ff4e00">{{userAnswer.correct_rate | percent}}</span></span>
        </div>
        <div class="list-row title van-hairline--bottom">
          <div class="list-cell">题目</div>
          <div class="list-cell">学生录音</div>
          <div class="list-cell">正确率</div>
        </div>
        <div class="list-body">
          <div class="list-row van-hairline--bottom" v-for="(item, index) in userAnswer.answer[0].answer_detail.audio" :key="index">
            <div class="list-cell ellipsis" v-html="homeworkInfo[index].content.text"></div>
            <div class="list-cell">
              <span id="autio" style="vertival-align:middle" @click="mp3Click($event, item[0])"></span>
            </div>
            <div class="list-cell correct">
              <div v-if="homeworkInfo[index].correct_rate >= 0.7">优秀</div>
              <div v-else-if="homeworkInfo[index].correct_rate >= 0.6 && homeworkInfo[index].correct_rate < 0.7">良</div>
              <div v-else-if="homeworkInfo[index].correct_rate >= 0.5 && homeworkInfo[index].correct_rate < 0.6">中</div>
              <div v-else>待提升</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 汉字听写 -->
      <div v-if="icomId == 5009">
        <div class="header van-hairline--bottom">
          <span>{{params.icom_name | questionName(params)}}</span>
          <span>用时: {{userAnswer.time_lenght / 1000 | timeFormatSecond}}</span>
          <span>正确率：<span style="color:#ff4e00">{{userAnswer.correct_rate | percent}}</span></span>
        </div>
        <div class="list-row title van-hairline--bottom">
          <div class="list-cell">题目</div>
          <div class="list-cell" style="flex: 2">学生答案</div>
          <div class="list-cell">结果</div>
        </div>
        <div class="list-body">
          <div class="list-row van-hairline--bottom" v-for="(item, index) in userAnswer.items" :key="index">
            <div class="list-cell ellipsis" v-html="item[0]"></div>
            <div class="list-cell answer">
              <img :class="{right: val.isRight == '1', wrong: val.isRight == '0'}" :src="val.path" alt="" v-for="(val, idx) in item[1]" :key="idx">
            </div>
            <div class="list-cell">
              <span class="icon" :class="{right: item[2] === 'right', wrong: item[2] === 'none' || item[2] === 'wrong'}"></span>
            </div>
          </div>
        </div>
      </div>
      <!-- 文章阅读(5021) 微课(5007) -->
      <div v-if="icomId == 5021 || icomId == 5007">
        <div class="header van-hairline--bottom" v-show="type!=3">
          <span>{{params.icom_name}}&nbsp;&nbsp;&nbsp;<span v-if="icomId == 5021">已阅读:{{classView}}</span></span>
          <span v-if="icomId == 5021">平均用时：<span style="color:#ff4e00">{{averageTime}}秒</span></span>
        </div>
        <div v-if="icomId == 5021" class="list-row title van-hairline--bottom">
          <div class="list-cell">姓名</div>
          <div class="list-cell">阅读次数</div>
          <div class="list-cell">阅读总时长</div>
        </div>
        <div v-if="icomId == 5007" class="list-row title van-hairline--bottom">
          <div class="list-cell">观看次数</div>
          <div class="list-cell">观看时间</div>
          <div class="list-cell">观看时长</div>
        </div>
        <div class="list-body">
          <div v-if="icomId == 5021" class="list-row van-hairline--bottom" v-for="(item, index) in homeworkInfo" :key="index">
            <div class="list-cell">
              <span class="status" v-if="!item.filished"></span>
              <span>{{item.real_name}}</span>
            </div>
            <div class="list-cell">{{item.view_num}}</div>
            <div class="list-cell">{{item.total_time_length}}秒</div>
          </div>
          <div v-if="icomId == 5007" class="list-row van-hairline--bottom" v-for="(item, index) in homeworkInfo.answer" :key="index">
            <div class="list-cell">
              <span>{{index + 1}}</span>
            </div>
            <div class="list-cell weike">
              <span>{{item.create_time.split(' ')[0]}}</span>
              <br>
              <span>{{item.create_time.split(' ')[1]}}</span>
            </div>
            <div class="list-cell">{{item.time_length}}秒</div>
          </div>
        </div>
      </div>
      <!-- 英语听写 -->
      <div v-if="icomId == 5020">
        <div class="header van-hairline--bottom">
          <span>{{params.icom_name}}</span>
          <span>用时: {{userAnswer.time_lenght / 1000 | timeFormatSecond}}</span>
          <span>正确率：<span style="color:#ff4e00">{{userAnswer.correct_rate | percent}}</span></span>
        </div>
        <div class="list-row title van-hairline--bottom">
          <div class="list-cell">题目</div>
          <div class="list-cell">学生答案</div>
          <div class="list-cell">结果</div>
        </div>
        <div class="list-body">
          <div class="list-row van-hairline--bottom" v-for="(item, index) in homeworkInfo" :key="index" @click="engLW(homeworkInfo, index)">
            <div class="list-cell ellipsis">{{item[0]}}</div>
            <div class="list-cell">{{userAnswer.items[index][1]}}</div>
            <div class="list-cell">
              <span class="icon" :class="{right: userAnswer.items[index][2] === 'right', wrong: userAnswer.items[index][2] === 'none' || userAnswer.items[index][2] === 'wrong'}"></span>
            </div>
          </div>
        </div>
      </div>
      <!-- 507(单词汉堡)、508(成功营救),4643(宝瓶收妖)、4630(单词速记)、5001(字母书写)、5000(闻英起舞)、504(老鹰捉小鸡)、84(群英争霸(句子版))、420(闻英起舞)、4642(宝瓶收妖（听音辨词）)、4424(虎口拔牙)、4423(吃火锅)、503(群英争霸) -->
      <div v-if="icomId == 507 || icomId == 508 || icomId == 4643 || icomId == 4630 || icomId == 5001 || icomId == 5000 || icomId == 504 || icomId == 84 || icomId == 420 || icomId == 4642 || icomId == 4424 || icomId == 4423 || icomId == 503">
        <div class="header van-hairline--bottom">
          <span>{{params.icom_name | questionName(params)}}</span>
          <span>用时: {{userAnswer.time_lenght / 1000 | timeFormatSecond}}</span>
          <span>正确率：<span style="color:#ff4e00">{{userAnswer.correct_rate | percent}}</span></span>
        </div>
        <div class="list-row title van-hairline--bottom">
          <div class="list-cell">题目</div>
          <div class="list-cell">结果</div>
        </div>
        <div class="list-body">
          <div class="list-row van-hairline--bottom" v-for="(item, index) in homeworkInfo" :key="index" @click="dchb(homeworkInfo, index)">
            <div class="list-cell ellipsis" v-html="item[0]"></div>
            <div class="list-cell">
              <van-rate v-if="icomId == 5001" v-model="userAnswer.items[index][1]" disabled-color="#ffe901" void-color="#ddd" disabled/>
              <span v-else class="icon" :class="{right: userAnswer.items[index][2] === 'right', wrong: userAnswer.items[index][2] === 'none' || userAnswer.items[index][2] === 'wrong'}"></span>
            </div>
          </div>
        </div>
      </div>
      <!-- 5015(斗地鼠) -->
      <div v-if="icomId == 5015">
        <div class="header van-hairline--bottom" v-show="type!=3">
          <span>{{params.icom_name}}</span>
          <span>用时: {{userAnswer.time_lenght / 1000 | timeFormatSecond}}</span>
          <span>正确率：<span style="color:#ff4e00">{{userAnswer.correct_rate | percent}}</span></span>
        </div>
        <div class="list-row title van-hairline--bottom">
          <div class="list-cell" style="flex: 2">题目</div>
          <div class="list-cell">结果</div>
        </div>
        <div class="list-body">
          <div class="list-row van-hairline--bottom" v-for="(item, index) in userAnswer.items" :key="index">
            <div class="list-cell answer5015 ellipsis" style="flex:2">
              <span v-for="(val, idx) in item[0].word" :key="idx + Math.random()">{{val[0].replace('"', '').replace('"', '')}}</span>
              <br/>
              <span v-for="(val, idx) in item[0].word" :key="idx + Math.random()" :class='{check: item[0].checkIndex.replace("\"", "").replace("\"", "") == idx}'>{{val[1]}}</span>
            </div>
            <div class="list-cell">
              <span class="icon" :class="{right: item[1] === 'right', wrong: item[1] === 'none' || item[1] === 'wrong'}"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- loading动画 -->
    <div v-if="loading" class="place-holder">
      <i class="fa fa-spinner fa-spin"></i>
      <span>加载中...</span>
    </div>
  </div>
</template>

<script>
import getStatistics from '../../axios/getQuestionStatistics.js'
import checkAnswerDetail from '../../axios/checkAnswerDetail.js'
import {mapMutations, mapState} from 'vuex'
import { Progress } from 'vant'
export default {
  name: 'groupDetail',
  props: ['params', 'icomId', 'type', 'userId'],
  data() {
    return {
      showPovit: false,
      homeworkInfo: null,
      correctRate: null,
      averageTime: null, // 班级平均用时
      classView: null, // 班级阅读人数
      users: null,
      loading: true,
      userAnswer: null // 当查看单个学生的学习记录时储存学生答案信息
    }
  },
  computed: {
    ...mapState({
      info: state => state.homeworkDetail.homeworkQuestionInfo.list,
      index: state => state.answerDetail.params.index
    })
  },
  mounted() {
    this.getInfo()
    window.bus.$on('hanzitingxie', (correctRate, icomId) => {
      if (Number(icomId) === 5009) {
        this.getInfo(correctRate)
      }
    })
  },
  methods: {
    ...mapMutations({
      setIcomDetail: 'answerDetail/setIcomDetail'
    }),
    mp3Click(e, url) {
      let audioUrl = window.bus.$store.getters['runEnv/old'] + url
      this.$mp3playerpause()
      this.$mp3player(audioUrl, e.currentTarget)
    },
    getInfo(correctRate) {
      this.loading = true
      let param = {
        "publish_id": this.params.course_hour_publish_id,
        "course_resource_id": this.params.course_resource_id,
        'icom_id': this.params.icom_id,
        'dcom_entity_id': this.params.dcom_entity_id,
        'h': 1,
        'qti_question_id': this.params.source_pk_id,
        'qti_question_sheet': (this.params.resource_type === 'qti_exam_sheet' || this.params.resource_type === 'qti_question_sheet') ? 1 : 0
      }
      let weikeParams = {
        "course_resource_id": this.params.course_resource_id,
        "publish_id": this.params.course_hour_publish_id,
        'icom_id': this.params.icom_id,
        'dcom_entity_id': this.params.dcom_entity_id,
        'user_id': this.userId,
        'dcom_id': this.params.dcom_id,
        'source_pk_id': 0
      }
      if (Number(this.icomId) === 5007 && Number(this.type) === 2 && this.userId) {
        checkAnswerDetail.getUserAnswerForMiniRs(weikeParams).then(succ => {
          this.homeworkInfo = succ
          this.loading = false
        })
        return false
      }
      getStatistics.getinfo(param).then(succ => {
        // 数学分知识点
        if (Number(this.params.icom_id) === 5013 || Number(this.params.icom_id) === 5011) {
          this.correctRate = succ.average_correct_rate || this.params.average_rate
          this.homeworkInfo = succ.resource
          this.users = succ.user
        // 按题
        } else if (Number(this.params.icom_id) === 5018) {
          this.correctRate = this.params.average_rate
          this.homeworkInfo = succ.resource
          this.users = succ.user
        } else if (Number(this.params.icom_id) === 4629) { // 口语训练
          this.correctRate = this.params.average_rate
          this.homeworkInfo = succ.detail.item
          this.users = succ.user
        } else if (Number(this.params.icom_id) === 5009) { // 汉字听写
          this.correctRate = 1
          this.homeworkInfo = succ.resource
          this.users = succ.user
        } else if (Number(this.params.icom_id) === 5021 || Number(this.params.icom_id) === 5007) { // 文章阅读 微课
          this.averageTime = succ.class_average_time_length
          this.homeworkInfo = succ.detail
          this.classView = succ.class_view
        } else if (Number(this.params.icom_id) === 5020) { // 英语听写
          this.correctRate = this.params.average_rate
          this.homeworkInfo = succ.resource
          this.users = succ.user
        } else if (Number(this.params.icom_id) === 507 || Number(this.params.icom_id) === 508 || Number(this.params.icom_id) === 4643 || Number(this.params.icom_id) === 4630 || Number(this.params.icom_id) === 5001 || Number(this.params.icom_id) === 5000 || Number(this.params.icom_id) === 504 || Number(this.params.icom_id) === 84 || Number(this.params.icom_id) === 420 || Number(this.params.icom_id) === 4642 || Number(this.params.icom_id) === 4424 || Number(this.params.icom_id) === 4423 || Number(this.params.icom_id) === 503) { // 单词汉堡，成功营救、宝瓶收妖,单词速记、字母书写、闻英起舞、老鹰捉小鸡、群英争霸、闻英起舞、宝瓶收妖（听音辨词）、虎口拔牙、吃火锅、群英争霸
          this.correctRate = this.params.average_rate
          this.homeworkInfo = succ.resource
          this.users = succ.user
        } else if (Number(this.params.icom_id) === 5015) { // 斗地鼠
          this.correctRate = this.params.average_rate
          this.homeworkInfo = succ.resource
          this.users = succ.user
        }
        if (this.userId && this.users) {
          this.users.filter(ele => {
            if (Number(ele.userid) === Number(this.userId)) {
              this.userAnswer = ele.answer
              if (Number(this.params.icom_id) === 5001) {
                this.userAnswer.items.forEach(ele => {
                  ele[1] = ele[1] * 5
                })
              }
              if (Number(this.params.icom_id) === 4629) {
                this.userAnswer = ele
              }
            }
          })
        }
        this.loading = false
      })
    },
    replaceAnswer(qustion, answer, dist) {
      return qustion.replace('_', `<span style="border-bottom: 1px solid red">${answer}</span>[${dist}]`)
    },
    linkToAnswer(info, index, r) {
      let resource = []
      let currentIndex = 0
      console.log(11111, info)
      info.filter((ele, i) => {
        resource.push(...ele.child)
        if (i === index) {
          if (i === 0) {
            currentIndex = r
          } else {
            // currentIndex = info.length - info.slice(0, info.length - i).length + r
            info.filter((val, r) => {
              if (r < index) {
                currentIndex += val.child.length
              }
            })
            currentIndex += r
          }
        }
      })
      this.setIcomDetail(resource)
      console.log(resource, currentIndex)
      this.$router.push({
        name: 'icomDetail',
        params: {
          index: currentIndex,
          icom_id: this.icomId
        }
      })
    },
    nextPage(info, index) {
      let resource = []
      info.filter((ele, i) => {
        let result = {
          title: this.replaceAnswer(ele.question, ele.right_answer, ele.distracts),
          percent: ele.correct_rate,
          users: []
        }
        resource.push(result)
      })
      resource.filter((val, i) => {
        this.users.filter((ele) => {
          if (ele.answer.items && ele.answer.items.length) {
            let a = {}
            a['name'] = ele.real_name
            a['avatar'] = ele.avatar
            a['result'] = ele.answer.items[i][1]
            val.users.push(a)
          }
        })
      })
      console.log(resource)
      this.setIcomDetail(resource)
      this.$router.push({
        name: 'icomDetail',
        params: {
          index: index,
          icom_id: this.icomId
        }
      })
    },
    // 口算训练跳转详情
    oraltest(info, index) {
      let resource = []
      info.filter((ele, i) => {
        let result = {
          title: ele.content.text,
          percent: ele.correct_rate,
          users: []
        }
        resource.push(result)
      })
      resource.filter((val, i) => {
        this.users.filter((ele) => {
          if (ele.answer && ele.answer.length) {
            let a = {}
            a['name'] = ele.real_name
            a['avatar'] = ele.avatar
            a['answer'] = ele.answer[0].qti_score[i]
            a['audio'] = ele.answer[0].answer_detail.audio[i][0]
            val.users.push(a)
          }
        })
      })
      console.log(resource)
      this.setIcomDetail(resource)
      this.$router.push({
        name: 'icomDetail',
        params: {
          index: index,
          icom_id: this.icomId
        }
      })
    },
    // 汉字听写跳转详情
    hanzitingxie(info, index) {
      let resource = []
      info.filter((ele, i) => {
        let result = {
          title: ele.content,
          percent: ele.correct_rate,
          users: []
        }
        resource.push(result)
      })
      resource.filter((val, i) => {
        this.users.filter((ele) => {
          if (ele.answer.items && ele.answer.items.length) {
            let a = {}
            a['name'] = ele.real_name
            a['avatar'] = ele.avatar
            a['result'] = ele.answer.items[i][2]
            a['path'] = ele.answer.items[i][1]
            a['userid'] = ele.userid
            val.users.push(a)
          }
        })
      })
      console.log(resource)
      this.setIcomDetail(resource)
      this.$router.push({
        name: 'icomDetail',
        params: {
          index: index,
          icom_id: this.icomId
        }
      })
    },
    // 英语听写跳转
    engLW(info, index) {
      let resource = []
      info.filter((ele, i) => {
        addResult(ele[2]['right'], 'right')
        addResult(ele[2]['wrong'], 'wrong')
        let result = {
          title: ele[0],
          percent: ele[1],
          users: []
        }
        resource.push(result)
      })
      function addResult(arr, type) {
        arr.forEach(ele => {
          ele['result'] = type
          ele['name'] = ele.real_name
        })
      }
      resource.filter((val, idx) => {
        this.users.filter(ele => {
          if (ele.answer.items && ele.answer.items.length) {
            let a = {}
            a['name'] = ele.real_name
            a['avatar'] = ele.avatar
            a['result'] = ele.answer.items[idx][2]
            a['answer'] = ele.answer.items[idx][1]
            val.users.push(a)
          }
        })
      })
      console.log(resource)
      this.setIcomDetail(resource)
      this.$router.push({
        name: 'icomDetail',
        params: {
          index: index,
          icom_id: this.icomId
        }
      })
    },
    // 单词汉堡跳转
    dchb(info, index) {
      let resource = []
      info.filter((ele, i) => {
        let result = {
          title: ele[0],
          percent: ele[1],
          users: []
        }
        resource.push(result)
      })
      resource.filter((val, i) => {
        this.users.filter((ele) => {
          if (ele.answer.items && ele.answer.items.length) {
            let a = {}
            a['name'] = ele.real_name
            a['avatar'] = ele.avatar
            a['result'] = ele.answer.items[i][2] ? ele.answer.items[i][2] : ele.answer.items[i][1]
            val.users.push(a)
          }
        })
      })
      console.log(resource)
      this.setIcomDetail(resource)
      this.$router.push({
        name: 'icomDetail',
        params: {
          index: index,
          icom_id: this.icomId
        }
      })
    },
    // 斗地鼠跳转
    dds(info, index) {
      let resource = []
      info.filter((ele, i) => {
        let result = {
          title: ele.word,
          checkIndex: ele.checkIndex.replace('"', '').replace('"', ''),
          percent: ele.correct_rate,
          users: []
        }
        resource.push(result)
      })
      resource.filter((val, idx) => {
        this.users.filter(ele => {
          if (ele.answer.items && ele.answer.items.length) {
            let a = {}
            a['name'] = ele.real_name
            a['avatar'] = ele.avatar
            a['result'] = ele.answer.items[idx] ? ele.answer.items[idx][1] : 'wrong'
            a['answer'] = decodeURI(ele.answer.items[idx] ? ele.answer.items[idx][0]['fact_entity'] : '%E6%9C%AA%E7%AD%94')
            val.users.push(a)
          }
        })
      })
      console.log(resource)
      this.setIcomDetail(resource)
      this.$router.push({
        name: 'icomDetail',
        params: {
          index: index,
          icom_id: this.icomId
        }
      })
    }
  }
};
</script>
<style lang="scss" scoped>
#group-detail{
  font-size: 16px;
  .student-personal{
    .title{
      height: 45px;
      line-height: 45px;
      padding: 0 13px;
      display: flex;
      justify-content: space-between;
      background-color: #f8f8f8;
      .check{
        color:#34c988
      }
    }
    .list-title{
      display: flex;
      height: 50px;
      line-height: 50px;
      padding: 0 13px;
      justify-content: space-around;
      span{
        flex: 1;
        text-align: center;
      }
    }
    .list-row{
      display: flex;
      height: 50px;
      line-height: 50px;
      padding: 0 13px;
      justify-content: space-around;
      .list-cell{
        flex: 1;
        text-align: center;
        &.answer{
          flex: 2;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          img{
            width: 30px;
            height: 30px;
            margin: 0 2px;
            &.right{
              border: 1px solid #2fc890;
            }
            &.wrong{
              border: 1px solid #ff4e00;
            }
          }
        }
        .icon{
          display: inline-block;
          &.right{
            width: 20px;
            height: 14px;
            background: url(../../../../assets/images/answerDetail/right.png) no-repeat 0 0;
            background-size: cover;
          }
          &.wrong{
            width: 14px;
            height: 14px;
            background: url(../../../../assets/images/answerDetail/wrong.png) no-repeat 0 0;
            background-size: cover;
          }
        }
        .icon-star{
          display: inline-block;
          width: 207px;
          height: 36.5px;
          margin-top: 7px;
          background: url(../../../../assets/images/answerDetail/star5.png) no-repeat 0 0;
          background-size: cover;
          .icon-star-light{
            display: inline-block;
            height: 36px;
            width: 207px;
            background: url(../../../../assets/images/answerDetail/star5.png) no-repeat;
            // background-clip: content-box;
            background-size: cover;
            // transform: rotate(180deg)
          }
        }
        &.answer5015{
          line-height: 25px;
          span{
            padding-right: 5px;
          }
        }
        &.weike{
          font-size: 10px;
          line-height: 25px;
        }
      }
    }
    .chart{
      .column{
        display: flex;
        justify-content: flex-start;
        height: 35px;
        line-height: 30px;
        margin: 15px 0;
        padding: 0 13px;
        .name{
          flex: 0 0 15%;
        }
        .line{
          min-width: 5px;
          margin-right: 10px;
          &.right{
            background-color: #34c988
          }
          &.wrong{
            background-color: #f56956;
          }
          &.none{
            background-color: #cccdcd
          }
        }
      }
    }
    #autio{
      display: inline-block;
      width: 36px;
      height: 36px;
      margin-top: 7px;
      background: url(../../../../assets/images/public/audio-play.png) no-repeat 0 0;
      background-size: cover;
      &.play{
        background: url(../../../../assets/images/public/audio.jpg) no-repeat 0 0;
        background-size: cover;
      }
    }
  }
  .header{
    padding: 0 13px;
    display: flex;
    justify-content: space-between;
    height: 50px;
    line-height: 50px;
  }
  .row{
    width: 100%;
    font-size: 0;
    padding: 0 13px;
    box-sizing: border-box;
    text-align: center;
    .kwg{
      display: inline-block;
      width: 40%;
      font-size: 16px;
      height: 60px;
      line-height: 60px;
      vertical-align: middle;
    }
    .len{
      display: inline-block;
      width: 20%;
      font-size: 16px;
      height: 60px;
      line-height: 60px;
      vertical-align: middle;
    }
    .correct{
      display: inline-block;
      width: 40%;
      font-size: 16px;
      height: 60px;
      line-height: 60px;
      vertical-align: middle;
      display: inline-flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      span{
        height: auto;
        line-height: 1;
      }
      .progress{
        width: 50%;
        margin-top: 10px;
      }
    }
    .children{
      font-size: 0;
      .cell{
        display: inline-block;
        font-size: 16px;
        height: 60px;
        line-height: 60px;
        vertical-align: middle;
        &.placeholder{
          width: 40%;
        }
        &.content{
          width: 20%;
        }
        &.correct{
          width: 40%;
          display: inline-flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
          span{
            height: auto;
            line-height: 1;
          }
          .progress{
            width: 50%;
            margin-top: 10px;
          }
          .fa{
            position: absolute;
            left: 90%
          }
          .icon{
            display: inline-block;
            &.right{
              width: 20px;
              height: 14px;
              background: url(../../../../assets/images/answerDetail/right.png) no-repeat 0 0;
              background-size: cover;
            }
            &.wrong{
              width: 14px;
              height: 14px;
              background: url(../../../../assets/images/answerDetail/wrong.png) no-repeat 0 0;
              background-size: cover;
            }
          }
        }
      }
    }
  }
  .list-row{
    width: 100%;
    padding: 0 13px;
    height: 60px;
    line-height: 60px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    text-align: center;
    box-sizing: border-box;
    .list-cell{
      flex: 1;
      .check{
        color: #34c988;
      }
      &.correct{
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        span{
          line-height: 1;
          margin-bottom: 10px;
        }
        .progress{
          width: 50%;
        }
      }
      .status{
        display: inline-block;
        width: 14px;
        height: 14px;
        background: url(../../../../assets/images/answerDetail/status.png) no-repeat 0 0;
        background-size: cover;
        vertical-align: baseline;
      }
    }
    &.title{
      height: 40px;
      line-height: 40px;
    }
  }
  .place-holder{
    text-align: center;
  }
}
</style>
