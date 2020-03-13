/**
* @Author: 李晨光
* @Date: 2019/9/6
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/9/6
**/
<comment>
  # 组件注释
  应用注册
</comment>
<template>
  <div id="AppRegistry">
    <Title/>
    <div class="m-20">
      <a-row :gutter="20">
        <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
          <app-classify v-model="appClassify"></app-classify>
        </a-col>
        <a-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
          <app-manage :appClassify="appClassify"></app-manage>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
  import Title from '@/Title'
  import Pagination from '@/Pagination'
  import AppClassify from '@/integration/appIntegrate/AppClassify'
  import AppManage from '@/integration/appIntegrate/AppManage'
  import debounce from 'lodash.debounce'
  export default {
    name: 'AppRegistry',
    components: {
      Title,
      Pagination,
      'app-classify': AppClassify,
      'app-manage': AppManage,
    },
    props: {},
    data() {
      return {
        appClassify: {
          id: null
        },
      }
    },
    computed: {},
    created() {
    },
    mounted() {

    },
    activated() {
      this.appClassify= Util.deepCopy(this.appClassify)
    },
    watch: {},
    methods: {
      appClassifyselected(e) {
        this.appClassify = e
        this.$root.eventHub.$emit('appClassifyselected')
      }
    },
    destroyed() {
    }
  }
</script>

<style lang="scss">
</style>
