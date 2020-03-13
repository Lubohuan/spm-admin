/*
 * @Autor: 何景春
 * @Version: 1.0
 * @Date: 2019-08-19 10:08:07
 * @LastEditors: OBKoro1
 * @LastEditTime: 2019-08-26 10:04:42
 * @Description: 岗位字典管理组件
 */

<comment>
  # 组件注释
  岗位词典管理  
  v-waves 给 按钮 新增 点击时  水波纹效果
</comment>

<template>
  <div id="Post" class="page-box">
    <div class="page-title">
      <Title></Title>
    </div>
    <div class="page-content flex">
      <!-- 左边内容 -->
      <div class="page-content-left flex-1">
       <PostDictL @rowActiveHandle="rowActiveHandle"></PostDictL>
      </div>
      <!-- 右边内容 -->
      <div class="page-content-right flex-3">
        <PostDictR :record="record"></PostDictR>
      </div>
    </div>
  </div>
</template>

<script>
import Title from "@/Title";
import PostDictL from "@/organization/postDict/PostDictL";
import PostDictR from "@/organization/postDict/PostDictR";
export default {
  name: "PostDict",
  components: {
    Title,
    PostDictL,
    PostDictR
  },
  props: {},
  data() {
    return {
      record: {
        id: ""
      }
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    // 行选中 编辑 删除 新增岗位字典 可点击
    rowActiveHandle(record) {
      this.record = record;
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
</style>
