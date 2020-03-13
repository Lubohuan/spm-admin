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
  <div id="RoleManage" class="page-box">
    <div class="page-title">
      <Title></Title>
    </div>
    <div class="page-content flex">
      <!-- 左边内容 -->
      <div class="page-content-left flex-2">
         <leftContent v-model="changeData"  ref="$leftContent" />
      </div>
      <!-- 右边内容 -->
      <div class="page-content-right flex-5">
        <rightContent :currentId="changeData.currentId" :orgId="changeData.orgId" ref="$rightContent"/>
      </div>
    </div>
  </div>
</template>
<script>
import Title from "@/Title";
import leftContent from "@/role/roleAppLicense/leftContent";
import rightContent from "@/role/roleAppLicense/rightContent";
export default {
  name: "RoleManage",
  components: {
    Title,
    leftContent,
    rightContent
  },
  props: {},
  data() {
    return {
      changeData: {
        currentId:'',
        orgId: ''
      }
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
