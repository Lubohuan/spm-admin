/**
* @Author: 路博欢
* @Date: 2019/8/1
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/1
**/
<comment>
  # 组件说明
  项管家-通讯录
</comment>
<template>
  <div id="TelBook">
    通讯录
    <a-button @click="$router.push({name:'App', query: {
            url:'http://39.105.163.75:80/#/main/integration/appIntegrate/appRegistry/maintain?primaryColor=#f99',
            msg: {
              test: 'hhh'
            }}})"></a-button>
    <Charts style="height:600px" :option="options"></Charts>
  </div>
</template>

<script>
  import { Charts } from 'hz-components'
  export default {
    name: 'TelBook',
    components: {
      Charts
    },
    props: {},
    data() {
      return {
        options: {
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            x: 'left',
            data: ['计划', '实际']
          },
          grid: {
            left: '0%',
            right: '0%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: [1,2,3,4,5],
            axisLabel: {
              interval: 'auto',
            },
            axisTick: {
              alignWithLabel: true
            },
            name: '月份'
          },
          yAxis: {
            type: 'value',
            name: '总计（ 万元）'
          },
          series: [{
            name:'计划',
            data: [1900,393,53425,5436,52],
            type: 'line',
            color: 'rgba(49,164,172,1)'
          }, {
            name:'实际',
            data: [2900,1393,5425,5236,1123],
            type: 'line',
            color: '#3F71AE'
          }]
        },
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
</style>
