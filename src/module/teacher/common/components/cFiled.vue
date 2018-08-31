<template>
  <div id="c-filed">
    <div class="resume" v-if="config.key === 'resume'">
      <div class="title">个人简介</div>
      <textarea cols="50" rows="10" :placeholder="placeholder" v-model.trim="textarea"/>
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
            <input :class="{'placeholder-red':placeholderRed}" ref="input" type="text" v-model.trim="data" :placeholder="placeholder" @blur="on_blur" @focus="on_focus">
          </div>
        </div>
      </div>
      <div class="edit" v-else>
        <div class="label">{{config.label}}</div>
        <div class="input">
          <input :class="{'placeholder-red':placeholderRed}" ref="input" type="text" v-model.trim="data" :placeholder="placeholder" @blur="on_blur" @focus="on_focus">
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters, mapMutations} from 'vuex'

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
      type: String,
      default: ''
    }
  },
  data () {
    return {
      data: '',
      placeholder: '',
      placeholderRed: false,
      textarea: '',
      curLength: 0,
      required: false
    }
  },
  created () {
    this.placeholder = this.config.placeholder
    let self = this
    let key = this.config.key
    if (!this.filed) {
      if (key === 'score') {
        this.editMsg.forEach((v, i) => {
          if (self.config.label === v.subject) {
            this.data = v.score
          }
        })
      } else {
        if (key === 'resume') this.textarea = this.editMsg
        this.data = this.editMsg
      }
    } else {
      if (key === 'resume') this.textarea = ''
      this.data = ''
    }
    if (key === 'name' || key === 'phone' || key === 'password') this.required = true
  },
  computed: {
    ...mapGetters({
      editMsg: 'managerStudent/editMsg'
    })
  },
  methods: {
    on_focus () {
      this.placeholder = this.config.placeholder
      this.placeholderRed = false
    },
    on_blur () {
      let newValue = this.data
      const pattern = this.config.pattern
      if (pattern !== '') {
        if (!pattern.test(newValue)) {
          this.placeholder = this.config.validsms
          this.placeholderRed = true
        } else {
          if (this.filed) {
            let obj
            obj[this.config.key] = newValue
            this.setTeacher(obj)
          } else {
            this.setEdit(newValue)
          }
        }
      } else {
      }
    },
    ...mapMutations({
      setEdit: 'managerStudent/SET_EDITMSG',
      setTeacher: 'managerStudent/SET_TEACHERMSG'
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
    border-bottom: 1px solid $color-line;
    padding-bottom: 20px;
    .title{
      height: 100px;
      line-height: 100px;
      font-size: $header-list;
    }
    textarea{
      display: block;
      margin:0 auto;
      letter-spacing: 4px;
      line-height: 38px;
      border: 1px solid $color-line;
    }
    .prompt{
      margin-top: 10px;
      text-align: right;
    }
  }
  .add{
    .border{
      display: flex;
      justify-content: space-between;
      letter-spacing:2px;
      height: 100px;
      line-height: 100px;
      font-size: $header-list;
      border-bottom: 1px solid $color-line;
      input{
        text-indent: 15px;
        font-size: $header-list-s;
      }
    }
  }
  .edit{
    padding: 0 26px;
    margin-bottom: 43px;
    letter-spacing:2px;
    .label{
      height: 95px;
      line-height: 95px;
    }
    .input{
      height: 90px;
      line-height: 90px;
      input{
        width: 100%;
        border: 1px solid $color-line;
        border-radius:10px;
        font-size: $header-list-s;
        text-indent: 15px;
      }
    }
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
