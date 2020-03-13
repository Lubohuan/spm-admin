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
  <div id="TenantAppLicense" class="page-box">
    <div class="page-title">
      <Title></Title>
    </div>
    <div class="page-content flex" v-if="curr_org.projectType&&curr_org.projectType=='401'">
      <!-- 左边内容 -->
      <div class="page-content-left" style="width:400px;">
        <leftContent v-model="currentId" ref="$leftContent" />
      </div>
      <!-- 右边内容 -->
      <div class="page-content-right flex-1">
        <rightContent :currentId="currentId" ref="$rightContent" />
      </div>
    </div>
    <div class="page-content" v-else>
      <div class="pannel flex justify-center align-center">
        <a-empty>
          <p slot="description" class="text-center">请切换到项目级进行查看</p>
          <!-- <a-button type="primary">Create Now</a-button> -->
        </a-empty>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import Title from "@/Title";
import leftContent from "@/projectWBS/projectWBS/leftContent";
import rightContent from "@/projectWBS/projectWBS/rightContent";
export default {
  name: "TenantAppLicense",
  components: {
    Title,
    leftContent,
    rightContent
  },
  computed: {
    ...mapState(["curr_org"])
  },
  props: {},
  data() {
    return {
      currentId: ""
    };
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {},
  destroyed() {}
};
</script>

<style lang="scss">
</style>
