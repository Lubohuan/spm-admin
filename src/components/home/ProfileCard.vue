/**
* @Author: 李晨光
* @Date: 2019/9/10
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/9/10
**/
<comment>
  # 组件注释
</comment>
<template>
  <div id="ProfileCard">
    <a-card >
      <div class="flex justify-between m-box" style="height: 100%">
        <div class="flex justify-center align-center direction-column">
          <a-avatar :size="50" :src="avatar" class="m-b-10"/>
          {{name}}
        </div>
        <div class="m-content">
          <div class="m-b-20">
            <span class="m-value">{{org}}</span>
          </div>
          <div class="m-item">
            <span class="m-label">部门：</span>
            <span class="m-value">{{dept}}</span>
          </div>
          <div class="m-item">
            <span class="m-label">岗位：</span>
            <span class="m-value">{{post}}</span>
          </div>
          <div class="m-item">
            <span class="m-label">电话：</span>
            <span class="m-value">{{tel}}</span>
          </div>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>

  export default {
    name: 'ProfileCard',
    components: {},
    props: {},
    data() {
      return {
        avatar: '../../../static/man_2.jpg',
        name: '李大仁',
        org: '陕西华筑科技有限公司',
        dept: '安全管理部',
        post: '安全员',
        tel: '17000000000'
      }
    },
    computed: {},
    created() {
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
  #ProfileCard{
    .ant-card,.ant-card-body{
      height: 170px;
    }
  }
</style>
