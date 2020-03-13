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
  <div id="WorkTipCard">
    <a-card>
      <div class="flex justify-between direction-column" style="height: 100%;">
        <div class="flex align-center m-t-10 m-l-10 m-r-10 justify-between">
          <span style="font-size: 32px" ><icon-font :type="msg.icon"/></span>
          <span style="font-size: 16px" class="m-r-10">{{msg.title}}</span>
          <span style="font-size: 50px">{{msg.num}}</span>
        </div>
        <div class="m-l-10 m-r-10">
          <a-avatar v-for="(item, index) in msg.lists" :key="index" :size="34" :src="item.avatar" class="m-r-10"/>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>

  export default {
    name: 'WorkTipCard',
    components: {},
    props: {
      msg: {
        type: Object,
        default: () => {
          return {
            title: '我的预警',
            num: 10,
            icon: '',
            lists: []
          }
        }
      },

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
  #WorkTipCard{
    .ant-card,.ant-card-body{
      height: 170px;
    }
  }
</style>
