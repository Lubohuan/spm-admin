/**
* @Author: 李晨光
* @Date: 2019/7/3
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/7/3
**/
<comment>
    # 组件注释
</comment>
<template>
    <div id="Overview">
      <a-row :gutter="20">
        <a-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6" class="m-b-20">
          <a-card title="Card title" hoverable v-myloading="loading">
            <a-skeleton active :loading="loading" :paragraph="{rows: 1}"/>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6" class="m-b-20">
          <a-card title="Card title" hoverable>
            <a-skeleton active :loading="loading" :paragraph="{rows: 1}"/>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6" class="m-b-20">
          <a-card title="Card title" hoverable v-myloading="loading">
            <a-skeleton active :loading="loading" :paragraph="{rows: 1}"/>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6" class="m-b-20">
          <a-card title="Card title" hoverable>
            <a-skeleton active :loading="loading" :paragraph="{rows: 1}"/>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14" class="m-b-20">
          <a-card title="Card title" hoverable>
            <a-skeleton active :loading="loading" :paragraph="{rows: 4}"/>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10" class="m-b-20">
          <a-card title="Card title" hoverable>
            <a-skeleton active :loading="loading" :paragraph="{rows: 4}"/>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="m-b-20">
          <a-card title="Card title" hoverable>
            <a-skeleton active :loading="loading" :paragraph="{rows: 5}"/>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="m-b-20">
          <a-card title="Card title" hoverable>
            <a-skeleton active :loading="loading" :paragraph="{rows: 4}"/>
          </a-card>
        </a-col>
      </a-row>
    </div>
</template>

<script>
  import TaskProgress from '@/home/TaskProgress'
    export default {
        name: 'Overview',
        components: {
          'task-progress': TaskProgress
        },
        props: {},
        data() {
            return {
              loading:true
            }
        },
        computed: {},
        created() {
          setTimeout(() => {
            // this.loading = false
          },10000)
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
</style>
