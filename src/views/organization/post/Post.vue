/*
 * @Autor: 何景春
 * @Version: 1.0
 * @Date: 2019-08-19 10:08:07
 * @LastEditors: OBKoro1
 * @LastEditTime: 2019-08-29 09:19:52
 * @Description: 岗位管理
 */

<comment>
  # 组件注释
  岗位管理
</comment>

<template>
  <div id="Post" class="page-box">
    <div class="page-title">
      <Title></Title>
    </div>
    <div class="page-content flex">
      <!-- 左边内容 -->
      <div class="page-content-left flex-1">
        <PostL @treeClickHandle="treeClickHandle"></PostL>
      </div>
      <!-- 右边内容 -->
      <div class="page-content-right flex-3">
        <PostR :deptId="deptId"></PostR>
      </div>
    </div>
  </div>
</template>

<script>
import Title from "@/Title";
import PostL from "@/organization/post/PostLeft";
import PostR from "@/organization/post/PostRight";
export default {
  name: "Post",
  components: {
    Title,
    PostL,
    PostR
  },
  props: {},
  data() {
    return {
      deptId: ""
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    // 树选中 回调
    treeClickHandle(deptId) {
      // console.log(deptId);
      this.deptId = deptId;
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
</style>
