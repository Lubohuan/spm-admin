/**
* @Author: 路博欢
* @Date: 2019/8/5
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/5
**/
<comment>
    # 组件注释
    公用组件

      变量如下
      menuKey：选中的下拉选项的值
      menuList：下拉列表

      事件如下
      menuClick： 下拉选项点击事件
</comment>
<template>
  <a-dropdown class="aMySelect" :trigger="['click']" placement="bottomLeft">
    <span class="btn" :class="menuList[value].class" style="margin-top:2.5px;">{{menuList[value].name}}</span>
    <a-menu slot="overlay" style="width:220px;padding:10px 0;" @click="menuClick">
      <a-menu-item v-for="(item,index) in menuList" :key="index">
        <div class="menu-item-detail">
          <span class="btn" :class="item.class">{{item.name}}</span>
          <a-icon class="icon-selected" v-if="value==item.id" type="check" />
        </div>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>
<script>
export default {
  name: "aMySelect",
  components: {},
  props:{
    menuKey:{//当前所选下拉选项
      type:Number,
      default:0
    },
    menuList:{//下拉列表
      type:Array,
      default:[]
    },
  },
  data() {
    return {
        value:this.menuKey
    };
  },
  computed: {
  },
  created() {},
  mounted() {},
  watch: {
      value(newVal,oldVal){
          this.value = Number(newVal)
      }
  },
  methods: {
    /*点击下拉选项*/
    menuClick(val) {
      this.value =Number(val.key);
      this.$emit('handleMenuValue',this.value)
    },
  },
  destroyed() {}
};
</script>
<style lang="scss">
.menu-item-detail {
  display: flex;
  justify-content: space-between;
  height: 100%;
  align-items: center;
}
.btn{
  display: inline-block;
  padding: 4px 12px;
  margin-bottom: 0;
  font-size: 14px;
  line-height: 20px;
  color: #383838;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  // border: 1px solid #d9d9d9;
  border-radius: 3px;
  background-color: #fff;
  white-space: nowrap;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.btn.btn0{
  color: $font-color-1;
  background: rgba(156,156,156,.1);
}
.btn.btn1{
  color:rgba(255,168,17,1);
  background:rgba(255,168,17,.1);
}
.btn.btn2{
  color:rgba(241,47,43,1);
  background:rgba(241,47,43,.1);
}
.btn.btn3{
  background: rgba(156,156,156,.1);
}
</style>
