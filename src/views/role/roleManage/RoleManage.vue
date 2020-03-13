/*
 * @Autor: 路欢
 * @Version: 1.0
 * @Date: 2019-08-19 10:08:07
 * @LastEditors: OBKoro1
 * @LastEditTime: 2019-08-26 10:04:42
 * @Description: 角色分类管理组件
 */

<comment>
  # 组件注释
  角色分类管理  
  v-waves 给 按钮 新增 点击时  水波纹效果
</comment>

<template>
  <div id="RoleManage" class="page-box">
    <div class="page-title">
      <Title></Title>
    </div>
    <div class="page-content flex">
      <!-- 左边内容 -->
      <div class="page-content-left flex-3">
         <PostDictL @rowActiveHandle="rowActiveHandle"></PostDictL>
      </div>
      <!-- 右边内容 -->
      <div class="page-content-right flex-5">
         <PostDictR :record="record"></PostDictR>
      </div>
    </div>
  </div>
</template>

<script>
import Title from "@/Title";
import PostDictL from "@/role/roleManage/PostDictL";
import PostDictR from "@/role/roleManage/PostDictR";
export default {
  name: "RoleManage",
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
#PostDict {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .content {
    flex: 1;
    display: flex;
    flex-direction: row;
    > div {
      height: 100%;
      background-color: #fff;
      // padding: 20px;
    }
    .content-L {
      width: 40%;
    }
    .content-R {
      flex: 1;
    }
  }
}
</style>
