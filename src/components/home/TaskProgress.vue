/**
* @Author: 李晨光
* @Date: 2019/7/4
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/7/4
**/
<comment>
  # 组件注释
</comment>
<template>
  <div id="TaskProgress" :style="{height: taskHeight + 'px',width: width + 'px'}">
    <div :style="{height: taskHeight + 'px',width: width + 'px'}" class="task flex align-end">
      <div :style="{height: progressHeight + 'px',  width: width + 'px'}" class="progress"
           :class="{
            'danger-bg-color': (progressHeight/taskHeight) <= (1/4) &&  (progressHeight/taskHeight) > 0,
            'warning-bg-color': (progressHeight/taskHeight) <= (1/2) &&  (progressHeight/taskHeight) > (1/4),
            'default-bg-color': (progressHeight/taskHeight) <= (3/4) &&  (progressHeight/taskHeight) > (1/2),
            'success-bg-color': (progressHeight/taskHeight) <= (1) &&  (progressHeight/taskHeight) > (3/4)}">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TaskProgress',
    components: {},
    props: {
      width: {
        type: Number,
        default: 10
      },
      taskHeight: {
        type: Number,
        default: 20
      },
      progressHeight: {
        type: Number,
        default: 10
      }
    },
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
  #TaskProgress {
    min-height: 30px;
    .task {
      background: rgba(229, 234, 241, 1);
      .progress {
        height: 0;
        /*background: rgba(0, 0, 0, 1);*/
      }
    }
  }
</style>
