/**
* @Author: 路博欢
* @Date: 2019/8/1
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/1
**/
<comment>
    # 项管家入口
</comment>
<template>
    <div id="ProjectHousekeeper">
      <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'ProjectHousekeeper',
        components: {},
        props: {},
        data() {
            return {}
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
  #ProjectHousekeeper{
    height: 100%;
    overflow: hidden;
  }
</style>
