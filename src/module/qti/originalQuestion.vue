<template>
  <div id="original-question" class="page">
    <header-bar @back="$router.back(-1)">
      <div slot="title-name">
        {{$route.query.title && $route.query.title}}
      </div>
    </header-bar>
    <div class="content">
      <render-qti v-if="$route.query.question_info && ($route.query.type != 1 || ($route.query.type == 1 && (JSON.parse($route.query.question_info).qti_question_type_id != 33 && JSON.parse($route.query.question_info).qti_question_type_id != 39)))" :info="$route.query.question_info && JSON.parse($route.query.question_info)" :user_id="$route.query.user_id && $route.query.user_id"></render-qti>
      <render-qti-new v-if="$route.query.question_info && (JSON.parse($route.query.question_info).qti_question_type_id == 33 || JSON.parse($route.query.question_info).qti_question_type_id == 39) && $route.query.type == 1" :info="$route.query.question_info && JSON.parse($route.query.question_info)" :user_id="$route.query.user_id && $route.query.user_id"></render-qti-new>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import headerBar from '@/components/headerBar.vue'
import RenderQti from '@/components/renderQti.vue'
import RenderQtiNew from '@/components/renderQtiNew.vue'
export default {
  name: 'originalQuestion',
  data() {
    return {
    }
  },
  components: {
    headerBar,
    RenderQti,
    RenderQtiNew
  }
}
</script>
<style lang="scss" scoped>
#original-question{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.content{
  width: 100%;
  height: calc(100% - 45px);
  overflow-y: scroll;
}
</style>
