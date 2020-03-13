/**
* @Author: 李晨光
* @Date: 2019/9/3
* @Version: 3.0.1
* @Last Modified by: 何景春
* @Last Modified time: 2019/10/23
**/
<comment>
  # 组件注释
  参建单位人员管理
</comment>
<template>
  <div id="PersonManage">
    <div class="page-title">
      <Title></Title>
    </div>
    <div class="page-content flex">
      <!-- 左边内容 -->
      <div class="page-content-left flex-1">
        <PerManageTree @treeSelect="treeSelect" />
      </div>
      <!-- 右边内容 -->
      <div class="page-content-right flex-3">
        <PerManageTable :orgData="orgData" />
      </div>
    </div>
  </div>
</template>

<script>
import Title from "@/Title";
import PerManageTree from "@/platformOperationManage/person/PerManageTree";
import PerManageTable from "@/platformOperationManage/person/PerManageTable";
export default {
  name: "PersonManage",
  components: {
    Title,
    PerManageTree,
    PerManageTable
  },
  props: {},
  data() {
    return {
      orgData: {
        orgId: this.$store.state.curr_org.id,
        name: this.$store.state.curr_org.name,
        deptId: "" // 部门id
      }
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    // 树子组件交互
    treeSelect(orgData) {
      // console.log(orgData);
      this.orgData = orgData;
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
</style>
