<template>
  <div class="more">
    <van-popup type="my-popup" position="bottom"  v-model="showPopup" class="popup" @click-overlay="togglePopup">
      <div class="popupWrapper">
        <div class="popupItem content" @click="content" v-if="info.hour_section_type_id==20">查看作业内容</div>
        <div class="popupItem again" @click="again" v-if="info.hour_section_type_id==20">再次布置</div>
        <div class="popupItem collection" @click="collection">
          <template v-if="favorite==0">收藏作业</template>
          <template v-else-if="favorite==1">取消收藏</template>
        </div>
        <div class="popupItem delete" @click="toggleDeletePopup">删除作业</div>
        <div class="popupItem cancel" @click="togglePopup">取消</div>
      </div>
    </van-popup>
    <van-popup type="collection-popup" v-model="showCollectionPopup" :close-on-click-overlay="false" class="popup">
      <div class="wrapper" v-if="favorite==1">
        <i></i>
        <span>已收藏</span>
      </div>
      <div class="wrapper" v-else-if="favorite==0">
        <span>取消收藏</span>
      </div>
    </van-popup>
     <van-popup type="delete-popup" v-model="showDetelePopup" class="popup" :close-on-click-overlay="false">
      <div class="delete-wrapper">
        <p>作业删除后，将清除作业相关数据<br/>请谨慎操作</p>
        <div class="btn-group">
          <span @click="togglePopup">取消</span>
          <span @click="deleteHomework">确认</span>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import homeworkDetil from "../../axios/detail.js";
import { Toast } from 'vant';
import stroage from '@/store/stroage.js'
export default {
  name: "more",
  props: ['info', 'favorite', 'list'],
  data() {
    return {
      showPopup: true, // 更多操作列表弹窗
      showCollectionPopup: false, // 收藏成功后弹窗
      showDetelePopup: false // 确认删除弹窗
    };
  },
  methods: {
    togglePopup() {
      this.$emit("toggle");
    },
    toggleDeletePopup() {
      this.showPopup = false;
      this.showDetelePopup = !this.showDetelePopup
    },
    content() {
      let params = {'info': this.info, 'list': this.list}
      stroage['session'].set('contentinfo', params)
      this.$router.push({
        path: '/homeworkContent'
      })
      this.togglePopup();
    },
    again() {
      var resourceId = [];
      for (let i = 0; i < this.list.length; i++) {
        let item = {
          'title': this.list[i].resource_name,
          'rids': [this.list[i].resource_id],
          'select_all': false,
          'exam_resource_id': 0
        }
        resourceId.push(item)
      }
      this.$router.push({
        name: 'homeworkPublishSetting',
        params: resourceId
      })
      this.togglePopup();
    },
    collection() {
      let params = {
        'publish_id': this.info.course_hour_publish_id,
        'type': parseInt(this.favorite) === 0 ? 1 : 0
      }
      homeworkDetil.favorite(params).then(r => {
        this.showCollectionPopup = true;
        this.showPopup = false;
        setTimeout(() => { this.togglePopup() }, 1000)
        this.$emit('collect', r.type)
      })
    },
    deleteHomework() {
      let params = {
        publish_id: this.info.course_hour_publish_id
      }
      homeworkDetil.remove(params).then(r => {
        Toast('删除成功！')
        setTimeout(() => {
          window.bus.$emit('deleteHomework', this.info.course_hour_publish_id)
          this.$emit('back')
        }, 500)
      })
    }
  }
};
</script>
<style scoped lang="scss">
/* 操作列表样式 */
.more .popup{
  background: transparent;
}
.popupWrapper {
  margin: 0 13px 13px;
  font-size: 17px;
  color:#1e1e1e;
}
.popupItem {
  background: #fff;
  line-height: 48px;
  height: 48px;
  box-sizing: border-box;
  text-align: center;
  border-bottom: 1px solid #e8ebee;
}
.popupItem:first-child {
  border-top-left-radius: 13px;
  border-top-right-radius: 13px;
}
.popupItem.delete {
  border-bottom-left-radius: 13px;
  border-bottom-right-radius: 13px;
}
.popupItem.cancel {
  margin-top: 15px;
  border-radius: 13px;
}
/* 收藏成功样式 */
.wrapper {
  width: 160px;
  height: 70px;
  line-height: 70px;
  text-align: center;
  background: #fff;
  border-radius: 13px;
}

.wrapper > i {
  display: inline-block;
  width: 24px;
  height: 24px;
  background-image: url('../../../../assets/images/homeworkDetail/collect.png');
  background-repeat:no-repeat;
  background-position: center center;
  background-size: 100% 100%;
  margin-top: 3px;
  vertical-align: text-bottom;
  margin-right: 5px;
}
/* 确认删除弹窗 */
.delete-wrapper{
  width:calc(100vw - 26px);
  margin:0 13px;
  background: #fff;
  padding:20px;
  border-radius: 13px;
  box-sizing: border-box;
}
.delete-wrapper>p{
  line-height: 25px;
  text-align: center;
  margin-bottom: 20px;
}
.delete-wrapper>.btn-group{
  display: flex;
}
.delete-wrapper>.btn-group span{
  flex:1 auto auto;
  width:150px;
  height: 50px;
  line-height: 50px;
  border-radius: 13px;
  font-size: 17px;
  text-align: center;
  background: #08b783;
  color:#fff;
}
.delete-wrapper>.btn-group span:first-child{
  margin-right: 15px;
  background: #fff;
  border:1px solid #08b783;
  color:#08b783;
}
</style>
