<template>
  <div class="bg-class" @click="selHandler($event)">
    <img src="@/assets/images/public/checksel.png" v-if="selecteState" style="width:100%;height:100%"/>
    <img src="@/assets/images/public/checkunsel.png" v-if="!selecteState" style="width:100%;height:100%"/>
  </div>
</template>
<script>
export default {
  name: "yx-check-box",
  props: {
    selected: {
      type: Boolean,
      default: false
    },
    id: {
      type: String
    }
  },
  data() {
    return {
      selecteState: this.selected
    };
  },
  methods: {
    selHandler(event) {
      this.selecteState = !this.selecteState;
      this.$emit("select", this);
    }
  }
};
</script>
<style lang="scss" scoped>
.bg-class {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
