/**
* @Author: 路博欢
* @Date: 2019/8/22
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/22
**/
<comment>
  # 组件注释
 预警台账
</comment>
<template>
  <div id="WarningSettings" class="page-box">
    <div class="page-title">
      <Title></Title>
    </div>
    <div class="page-content flex">
      <!-- 左边内容 -->
      <div class="page-content-left" style="width:400px;">
        <WarningLedgerLeft v-model="currentId" ref="$warningLedgerLeft" />
      </div>
      <!-- 右边内容 -->
      <div class="page-content-right flex-1">
        <WarningLedgerRight :currentId="currentId" />
      </div>
    </div>
  </div>
</template>
<script>
import Title from "@/Title";
import WarningLedgerLeft from "@/warningCenter/warningLedger/WarningLedgerLeft";
import WarningLedgerRight from "@/warningCenter/warningLedger/WarningLedgerRight";
export default {
  name: "WarningSettings",
  components: {
    Title,
    WarningLedgerLeft,
    WarningLedgerRight
  },
  props: {},
  data() {
    return {
      currentId: "",
      needAjax: true
    };
  },
  computed: {},
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name == "WarningReminderRecord") {
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
        this.$refs.$warningLedgerLeft.pageInitLeft();
      });
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
</style>
