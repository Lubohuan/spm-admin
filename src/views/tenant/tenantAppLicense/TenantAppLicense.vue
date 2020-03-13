/**
* @Author: 路博欢
* @Date: 2019/8/22
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/22
**/
<comment>
  # 组件注释
  租户应用授权
</comment>
<template>
  <div id="TenantAppLicense" class="page-box">
    <div class="page-title">
      <Title></Title>
    </div>
    <div class="page-content flex">
      <!-- 左边内容 -->
      <div class="page-content-left flex-1">
        <leftContent v-model="currentId" ref="$leftContent" />
      </div>
      <!-- 右边内容 -->
      <div class="page-content-right flex-3">
        <rightContent :currentId="currentId" ref="$rightContent"/>
      </div>
    </div>
  </div>
</template>
<script>
import Title from "@/Title";
import leftContent from "@/tenant/tenantAppLicense/leftContent";
import rightContent from "@/tenant/tenantAppLicense/rightContent";
export default {
  name: "TenantAppLicense",
  components: {
    Title,
    leftContent,
    rightContent
  },
  props: {},
  data() {
    return {
     currentId:'',
    };
  },
  computed: {},
  created() {},
  mounted() {

  },
  watch: {},
  methods: {
    //加载右边的表格
    handleRow(id){
      this.$refs['$rightContent'].updateTable(id)
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
</style>
