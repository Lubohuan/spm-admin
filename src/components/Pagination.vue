/**
* @Author: 李晨光
* @Date: 2019/7/9
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/7/9
**/
<comment>
  # 组件注释
  分页器
  pageSize  每页条数
  current   当前页数
  total     数据总条数
  onChange  页码改变的回调，参数是改变后的页码及每页条数
  showSizeChange  pageSize 变化的回调
</comment>
<template>
  <div id="Pagination" class="m-t-20 flex justify-end">
    <a-pagination
      showSizeChanger
      :pageSize="pageSize"
      @change="onChange"
      @showSizeChange="onShowSizeChange"
      :total="total"
      :showTotal="total => `共 ${total} 条`"
      :current="current">
      <template slot='buildOptionText' slot-scope='props'>
        <span>{{props.value}}条/页</span>
      </template>
    </a-pagination>
  </div>
</template>

<script>
  export default {
    name: 'Pagination',
    components: {},
    props: {
      pageSize: {
        type: Number,
        default: 10
      },
      current: {
        type: Number,
        default: 1
      },
      total: {
        type: Number,
        default: 10
      }
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
    watch:{
      pageSize(val) {
        console.log('pageSize',val);
      },
      current(val) {
        console.log('current',val);
      }
    },
    methods: {
      onChange (current, pageSize) {
        this.$emit('onChange', current, pageSize)
      },
      onShowSizeChange(current, pageSize) {
        console.log(current, pageSize);
        this.$emit('onShowSizeChange', current, pageSize)
      }
    },
    destroyed() {
    }
  }
</script>

<style lang="scss">
</style>
