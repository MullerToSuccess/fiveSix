<template>
  <div id="c-filed">
    <div class="resume" v-if="config.key === 'profile'">
      <div class="title">个人简介</div>
      <div class="textarea">
        <textarea class="blur-text" cols="40" rows="10" style="outline:none;resize:none" :placeholder="placeholder" v-model.trim="textarea" @focus="on_focus" @blur="textarea_blur"/>
      </div>
      <div class="prompt">已经输入{{curLength}}个字(请不要超过<span style="color: red">500</span>字）</div>
    </div>
    <div v-else>
      <div class="add" v-if="filed">
        <div class="border">
          <div class="label">
            <i v-show="required" style="color: red">*</i>
            {{config.label}}
          </div>
          <div class="input">
            <input class="blur-text" ref="inputAdd" type="text" v-model.trim="data" :placeholder="placeholder" @blur="on_blur" @focus="on_focus">
          </div>
        </div>
      </div>
      <div class="edit" v-else>
        <div class="label">{{config.label}}</div>
        <div class="input">
          <input ref="input" type="text" v-model.trim="data" :placeholder="placeholder" @blur="on_blur" @focus="on_focus">
        </div>
      </div>
      <div class="validsms" v-show="validsms">{{config.validsms}}</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters, mapMutations} from 'vuex'
import {Toast} from 'vant'

export default {
  name: 'cFiled',
  props: {
    filed: {
      type: Boolean,
      default: false
    },
    config: {
      type: Object
    },
    value: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      data: '',
      placeholder: '',
      validsms: false,
      textarea: '',
      curLength: 0,
      required: false
    }
  },
  created () {
    this.placeholder = this.config.placeholder
    const key = this.config.key
    if (!this.filed) {
      if (key === 'profile') this.textarea = this.editMsg
      this.data = this.editMsg
      this._initPattern()
    } else {
      if (key === 'score') {
        for (let keyVal in this.score) {
          if (this.config.subject === keyVal) {
            this.data = this.score[keyVal]
          }
        }
      } else {
        this.data = ''
      }
      if (key === 'profile') this.textarea = ''
      if (key === 'name' || key === 'mobile' || key === 'password') {
        this.required = true
        this._initPattern()
      }
    }
  },
  computed: {
    ...mapGetters({
      editMsg: 'managerCommon/editMsg',
      score: 'managerStudent/score'
    })
  },
  methods: {
    on_focus () {
      if (this.filed) this.emit('onfocus')
    },
    on_blur () {
      let newValue = this.data
      const pattern = this.config.pattern
      const key = this.config.key
      if (this.filed) {
        this.emit('onblur')
        if (key === 'name' || key === 'mobile' || key === 'password') {
          if (!pattern.test(newValue)) {
            // this.$refs.inputAdd.focus()
            this.validsms = true
            this.setIsAdd({[key]: false})
          } else {
            this.validsms = false
            this.setAddTeacher({[key]: newValue})
            this.setIsAdd({[key]: true})
          }
        } else if (key === 'score') {
          if (!pattern.test(newValue)) {
            // this.$refs.inputAdd.focus()
            this.validsms = true
            this.$store.commit('managerCommon/SET_ISSAVE', false)
          } else {
            const subject = this.config.subject
            let json = {
              subject,
              data: parseInt(this.data)
            }
            this.setScore(json)
            this.validsms = false
            this.$store.commit('managerCommon/SET_ISSAVE', true)
          }
        } else {
          if (newValue !== '') {
            if (pattern !== '') {
              if (!pattern.test(newValue)) {
                // this.$refs.inputAdd.focus()
                this.validsms = true
              } else {
                this.validsms = false
                this.setAddTeacher({[key]: newValue})
              }
            } else {
              this.setAddTeacher({[key]: newValue})
            }
          }
        }
      } else {
        if (pattern !== '') {
          if (!pattern.test(newValue)) {
            this.validsms = true
            this.$store.commit('managerCommon/SET_ISSAVE', false)
          } else {
            this._patternSuccess(newValue)
          }
        } else {
          this.setEdit(newValue)
          this.$store.commit('managerCommon/SET_ISSAVE', true)
        }
      }
    },
    textarea_blur () {
      if (this.filed) this.emit('onblur')
      this.setProfile(this.textarea)
      this.setAddTeacher({profile: this.textarea})
    },
    emit (event) {
      if (this.$store.state.account.isAndroid) {
        const key = this.config.key
        let off
        if (event === 'onfocus') {
          switch (key) {
            case 'profile':
              off = -35
              break
            case 'email':
              off = -55
              break
            case 'address':
              off = -60
              break
          }
        } else if (event === 'onblur') {
          off = 0
        }
        this.$emit(event, off)
      }
    },
    _initPattern () {
      let newValue = this.data
      const pattern = this.config.pattern
      if (pattern !== '') {
        if (!pattern.test(newValue)) {
          this.validsms = true
          this.$store.commit('managerCommon/SET_ISSAVE', false)
        } else {
          this.validsms = false
          this.$store.commit('managerCommon/SET_ISSAVE', true)
        }
      } else {
        this.$store.commit('managerCommon/SET_ISSAVE', true)
      }
    },
    _patternSuccess (newValue) {
      const route = this.$route.name
      this.validsms = false
      this.$store.commit('managerCommon/SET_ISSAVE', true)
      if (this.filed) {
        if (route === 'sEditMsg') {

        } else {
          let obj
          obj[this.config.key] = newValue
          this.setTeacher(obj)
        }
      } else {
        this.setEdit(newValue)
      }
    },
    ...mapMutations({
      setEdit: 'managerCommon/SET_EDITMSG',
      setTeacher: 'managerStudent/SET_TEACHERMSG',
      setScore: 'managerStudent/SET_SCORE',
      setAddTeacher: 'managerTeacher/SET_ADDTEACHER',
      setIsAdd: 'managerTeacher/SET_ISADD',
      setProfile: 'managerTeacher/SET_PROFILE'
    })
  },
  watch: {
    value (newVal) {
      this.data = newVal
      this.setEdit(newVal)
    },
    textarea (newVal) {
      let maxlength = 500
      if (newVal.length > maxlength) {
        this.textarea = newVal.substring(0, maxlength)
      }
      this.curLength = newVal.length
    }
  }
}
</script>

<style scoped lang="scss">
 @import "@/style/variable.scss";
  .resume{
    padding: 0 13px 10px 13px;
    .title{
      height: calc(100px/2);
      line-height: calc(100px/2);
      font-size: $header-list;
    }
    .textarea{
      display: flex;
      justify-content: center;
      height: 200px;
      width: 320px;
      margin:0 auto;
      textarea{
        letter-spacing: calc(4px/2);
        line-height: calc(38px/2);
        border: 1px solid $color-line;
      }
    }
    .prompt{
      margin-top: calc(10px/2);
      text-align: right;
    }
  }
  .add{
    .border{
      display: flex;
      justify-content: space-between;
      letter-spacing:calc(2px/2);
      height: calc(100px/2);
      line-height: calc(100px/2);
      font-size: $header-list;
      border-bottom: 1px solid $color-line;
      input{
        text-indent: calc(15px/2);
        font-size: $header-list-s;
      }
    }
  }
  .edit{
    padding: 0 calc(26px/2);
    letter-spacing:calc(2px/2);
    .label{
      height: calc(95px/2);
      line-height: calc(95px/2);
    }
    .input{
      height: calc(90px/2);
      line-height: calc(90px/2);
      input{
        width: 100%;
        border: 1px solid $color-line;
        border-radius:calc(10px/2);
        font-size: $header-list-s;
        text-indent: calc(15px/2);
      }
    }
  }
  .validsms{
    padding: 10px 50px 0 0 ;
    text-align: right;
    color: red;
    font-size: calc(26px/2);
  }
  .placeholder-red::-webkit-input-placeholder{
    color:red;
  }
  .placeholder-red::-moz-placeholder{
    color:red;
  }
  .placeholder-red:-moz-placeholder{
    color:red;
  }
  .placeholder-red:-ms-input-placeholder{
    color:red;
  }
</style>
