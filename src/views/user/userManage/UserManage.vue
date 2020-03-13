/**
* @Author: 李晨光
* @Date: 2019/8/16
* @Version: 1.0
* @Last Modified by: 何景春
* @Last Modified time: 2019/8/29
**/
<comment>
  # 组件注释
  人员管理
</comment>
<template>
  <div id="UserManage" class="page-box">
    <div class="page-title">
      <Title></Title>
    </div>
    <div class="page-content flex">
      <!-- 左边内容 -->
      <div class="page-content-left flex-1">
        <UserOrgTree ref="UserOrgTree" @treeSelect="treeSelect" />
      </div>
      <!-- 右边内容 -->
      <div class="page-content-right flex-3">
        <UserTable :orgData="orgData" />
      </div>
    </div>
  </div>
</template>

<script>
import Title from "@/Title";
import UserOrgTree from "@/user/UserOrgTree";
import UserTable from "@/user/UserTable";
export default {
  name: "UserManage",
  components: {
    Title,
    UserOrgTree,
    UserTable
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
