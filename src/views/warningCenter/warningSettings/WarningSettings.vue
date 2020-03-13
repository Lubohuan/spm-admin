/**
* @Author: 路博欢
* @Date: 2019/8/22
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/22
**/
<comment>
  # 组件注释
  项目WBS
</comment>
<template>
  <div id="WarningSettings" class="page-box">
    <div class="page-title">
      <Title></Title>
    </div>
    <div class="page-content flex">
      <!-- 左边内容 -->
      <div class="page-content-left" style="width:500px;">
        <WarningSettingsLeft v-model="currentId" ref="$warningSettingsLeft" />
      </div>
      <!-- 右边内容 -->
      <div class="page-content-right flex-1">
        <WarningSettingsRight :currentId="currentId" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import Title from "@/Title";
import WarningSettingsLeft from "@/warningCenter/warningSettings/SettingsLeft";
import WarningSettingsRight from "@/warningCenter/warningSettings/SettingsRight";
export default {
  name: "WarningSettings",
  components: {
    Title,
    WarningSettingsLeft,
    WarningSettingsRight
  },
  props: {},
  data() {
    return {
      currentId: "",
      needAjax: true
    };
  },
  computed: {
    ...mapState(["curr_org"])
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name == "WarningLogs") {
        vm.needAjax = false;
      } else {
        vm.needAjax = true;
      }
      vm.needAjax ? vm.pageInit() : "";
    });
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    pageInit() {
      this.$nextTick(() => {
        this.$refs.$warningSettingsLeft.pageInitLeft();
      });
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
</style>
