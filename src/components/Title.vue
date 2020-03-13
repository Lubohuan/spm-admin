/**
* @Author: 李晨光
* @Date: 2019/7/5
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/7/5
**/
<comment>
  # 组件注释
  全局内容区header
  title 标题名
</comment>
<template>
  <div id="Title">
    <a-row>
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <a-card class="title-card">
          <div class="flex justify-between align-center">
            <div class="font-h1 flex align-center"><span class="back-btn" @click="$router.back()"> <icon-font  type="spm-icon-copy20"></icon-font></span><span>{{ title }}</span>
              <a-breadcrumb class="m-l-20" :routes="routes">
                <template slot="itemRender" slot-scope="{route, params, routes, paths}">
                  <span v-if="routes.indexOf(route) === routes.length - 1">
                    {{route.breadcrumbName}}
                  </span>
                  <router-link v-else :to="route.path">
                    {{route.breadcrumbName}}
                  </router-link>
                </template>
              </a-breadcrumb>
            </div>
            <div>
              <slot name="handle"></slot>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  export default {
    name: 'Title',
    components: {},
    props: {

      /*title:{
        type: String,
        default: '我是标题'
      }*/
    },
    data() {
      return {
        title: '我是标题',
        routes: []  // 面包屑路由
      }
    },
    computed: {},
    created() {
      this.title = this.$route.meta.name
      this.routes = [{
        path: '/main/home',
        breadcrumbName: '首页'
      }, {
        path: '',
        breadcrumbName: this.$route.meta.name
      }]
    },
    mounted() {
    },
    watch: {},
    methods: {},
    destroyed() {
    }
  }
</script>

<style lang="scss">
  #Title {
    .title {
      /*font-size:;*/
    }
    .back-btn{
      @include primary_color();
      font-size: 24px;
      margin-right: 5px;
      cursor: pointer;
      line-height: 24px;
    }
    .ant-breadcrumb a{
      @include primary_color()
    }
    .title-card .ant-card-body {
      padding: 14px 20px;
    }
  }

</style>
