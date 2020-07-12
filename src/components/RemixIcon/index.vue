<template>
  <div>
    <el-image
      style="width: 40px; height: 40px;top:-.4rem;border-radius:5px;margin-right:1rem;"
      :src="logo"></el-image>
      <div
        v-if="isExternal"
        :style="styleExternalIcon"
        class="svg-external-icon svg-icon"
        v-on="$listeners"
      />
  </div>
</template>

<script>
import { isExternal } from "@/utils/validate";

export default {
  name: "RemixIcon",
  data(){
    return {
      logo:require('../../assets/logo.png')
    }
  },
  props: {
    iconClass: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: "",
    },
  },
  computed: {
    isExternal() {
      return isExternal(this.iconClass);
    },
    iconName() {
      return `#remix-icon-${this.iconClass}`;
    },
    svgClass() {
      if (this.className) {
        return "svg-icon " + this.className;
      } else {
        return "svg-icon";
      }
    },
    styleExternalIcon() {
      return {
        mask: `url(${this.iconClass}) no-repeat 50% 50%`,
        "-webkit-mask": `url(${this.iconClass}) no-repeat 50% 50%`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 1.25em;
  height: 1.25em;
  overflow: hidden;
  vertical-align: -0.15em;
  fill: currentColor;

  &:hover {
    opacity: 0.8;
  }
}

.svg-external-icon {
  display: inline-block;
  background-color: currentColor;
  mask-size: cover !important;
}
</style>
