<template>
<div>
  <div v-if="info.icom_app_name != 'vote' && !info.version"
    :id="'qti_' + (info.source_pk_id || info.resource_id) + _uid"
    caller="mobile"
    class="qti"
    :icom_id="info.icom_id"
    :dcom_id="dcom"
    :user_id="user_id"
    :setting="encodeURI(JSON.stringify(oldSetting))"
    app_name="qti"
    package_name="QTI"
    type="jsicom"
    appclass="qti"
    :dcom_entity="dcomentity"
  ></div>
  <div v-if="info.icom_app_name != 'vote' && info.version">
    <Qti :setting="newSetting"></Qti>
  </div>
  <div v-if="info.icom_app_name == 'vote'"
    :id="'qti_' + (info.source_pk_id || info.resource_id) + _uid"
    caller="mobile"
    class="vote"
    :icom_id="info.icom_id"
    :dcom_id="dcom_id"
    :user_id="user_id"
    :setting="encodeURI(JSON.stringify(voteSetting))"
    app_name="vote"
    package_name="vote"
    type="jsicom"
    appclass="vote"
  >
  </div>
</div>
</template>
<script>
import api from '@/axios/qti'
export default {
  name: 'RenderQti',
  props: {
    // 取学习记录需要传对应的学生id 显示正确答案user_id = 0
    user_id: {
      default: '0'
    },
    info: {
      type: Object
    },
    num: {
      type: Number,
      default: -1
    },
    hideResult: {
      type: String,
      default: '0'
    },
    qtiData: {
      default: ''
    }
  },
  data() {
    return {
      dcom_id: this.info.dcom_id
    }
  },
  computed: {
    newSetting() {
      return {
        caller: 'PREVIEWOR',
        course_resource_id: this.info.course_resource_id,
        dcom_entity_id: this.info.dcom_entity_id,
        domain: window.bus.$store.getters['runEnv/old'],
        in_class: 0,
        num: this.num,
        publish_id: this.info.course_hour_publish_id,
        qid: this.info.source_pk_id,
        show_answer: 0,
        user_id: this.user_id,
        view_id: '',
        dcom_entity: this.qtiData,
        resource_type: this.info.resource_type,
        hide_result: this.hideResult
      }
    },
    oldSetting() {
      return {
        'smt': 'no_self_smt',
        'publish_id': this.info.course_hour_publish_id,
        'course_resource_id': this.info.course_resource_id,
        'caller': 'ICLASS',
        'score': this.info.should_score ? this.info.should_score : '',
        'dcom_entity_id': this.info.dcom_entity_id,
        'titleflag': 0,
        'num': this.num
      }
    },
    voteSetting() {
      return {
        "smt": "no_self_smt",
        "caller": "ICLASS",
        "publish_id": this.info.course_hour_publish_id,
        'course_resource_id': this.info.course_resource_id,
        'question_id': this.info.source_pk_id
      }
    },
    dcomentity() {
      return escape(JSON.stringify(this.qtiData))
    },
    dcom() {
      if (this.info.icom_app_name === 'sheet') {
        return this.info.resource_type + ':' + this.info.source_pk_id
      } else if (~['vote'].indexOf(this.info.icom_app_name)) {
        return this.info.dcom_id
      } else {
        return this.info.source_pk_id
      }
    }
  },
  mounted () {
    this.getDcom(() => {
      this.$nextTick(() => {
        if (this.info.source_pk_id) {
          $i('qti_' + this.info.source_pk_id + this._uid, '', () => {
          })
        } else {
          $i('qti_' + this.info.resource_id + this._uid, '', () => {
          })
        }
      })
    })
  },
  methods: {
    getDcom(callback) {
      // 投票题获取entity_id
      if (~['vote'].indexOf(this.info.icom_app_name)) {
        api.getDcom({
          dcom_id: this.dcom_id
        }).then(succ => {
          this.dcom_id = this.getEntity(succ)
          callback && callback()
        })
      } else {
        callback && callback()
      }
    },
    getEntity(result) {
      let match = result.entity.match(/<data>(\d+)<\/data>/)
      return match[1] || undefined
    }
  }
}
</script>
<style lang="scss" scoped>
.qtiContainer{
  padding:0 13px;
}
</style>
