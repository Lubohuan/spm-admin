/**
* @Author: 李晨光
* @Date: 2019/8/16
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/8/16
**/
<comment>
  # 组件注释
  基础业务配置
</comment>
<template>
  <keep-alive :include="['GeneralFileDefinition']">
    <router-view />
  </keep-alive>
</template>

<script>
export default {
  name: "Index",
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {},
  destroyed() {}
};
</script>

<style lang="scss">
</style>
