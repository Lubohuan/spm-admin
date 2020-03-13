/**
* @Author: 李晨光
* @Date: 2019/8/7
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/8/7
**/
<comment>
  # 组件注释
  任务分类组件
  v-model 选中项
  classifys 参数
</comment>
<template>
  <div id="TaskClassify">
    <div v-for="(classify, index) in classifys" class="m-b-10 classify pointer" @click="select(index)" :class="{active: actived == index}">
      <div class="flex justify-between m-b-10">
        <div class="over">{{classify.title}}</div><div>{{classify.finished}}/{{classify.total}}</div>
      </div>
      <ul class="progress flex">
        <li class="level0" :style="{width: (classify.level0 / classify.total) * 100 + '%' }"></li>
        <li class="level1" :style="{width: (classify.level1 / classify.total) * 100 + '%' }"></li>
        <li class="level2" :style="{width: (classify.level2 / classify.total) * 100 + '%' }"></li>
        <li class="level3" :style="{width: (classify.level3 / classify.total) * 100 + '%' }"></li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TaskClassify',
    components: {},
    props: {
      actived: Number, //选中项
      classifys: {  // 数据
        type: Array,
        default: () => {
          return []
        }
      }
    },
    model: {
      prop: 'actived',
      event: 'selected'
    },
    data() {
      return {
      }
    },
    computed: {},
    created() {
    },
    mounted() {
    },
    watch: {},
    methods: {
      /**
       * 点击选择
       * @param index
       */
      select(index) {
        this.$emit('selected', index);
      }
    },
    destroyed() {
    }
  }
</script>

<style lang="scss">
  #TaskClassify {
    font-size: $font-size-2;
    color: $font-color-2;
    line-height: $line-height-2;
    .progress {
      li {
        height: 4px;
        background: #f99;
      }
      .level0{
        background: $default-color;
      }
      .level1{
        background: $success-color;
      }
      .level2{
        background: $warning-color;
      }
      .level3{
        background: $danger-color;
      }
    }
    .active{
      background: #f1f1f1;
    }
    .classify{
      padding: 5px 5px;
      border-radius: 2px;
    }
  }
</style>
