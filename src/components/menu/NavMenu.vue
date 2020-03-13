/**
* @Author: 李晨光
* @Date: 2019/7/3
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/7/3
**/
<comment>
  # 组件注释
  顶部导航组件
</comment>
<template>
  <div id="NavMenu" class="flex">
    <div
      v-waves
      v-for="(nav, index) in navs"
      :key="index"
      :class="{active:nav.value == selected}"
      class="nav"
      @click="clickAction(index,navs)">
      <icon-font class="nav-icon" :type="nav.icon"/>
      <span class="nav-title">{{nav.name}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'NavMenu',
    components: {},
    props: {
      navs:{
        type: Array,
        default: () => {
          return []
        }
      },
      defaultValue: ''
    },
    data() {
      return {
        selected: '',
        countries:[]
      }
    },
    computed: {},
    created() {
      this.selected = this.defaultValue
    },
    mounted() {
    },
    watch: {},
    methods: {
      // 确认回调
      clickAction(val,items) {
        this.navs.forEach(item=>{
          if(item.value == items[val].value){
            this.selected = item.value;
            this.$emit('click-Action', this.selected)
          }
        })
      }
    },
    destroyed() {
    }
  }
</script>

<style lang="scss">
  #NavMenu{
    .nav{
      padding: 0 18px;
      position: relative;
      cursor: pointer;
      .nav-icon{
        font-size: 14px;
        margin-right: 14px;
      }
      .nav-title{
        color: $font-color-4;
        font-size: $font-size-2;
        font-weight: $font-weight-1;
      }
    }
    .nav:hover{
      background:rgba(0,0,0,.1);
    }
    .nav::after{
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      height: 40px;
      border-right: 1px solid rgba(0,0,0,.3);
    }
    .active{
      background:rgba(0,0,0,.3);
    }
  }
</style>
