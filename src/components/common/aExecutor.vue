/**
* @Author: 路博欢
* @Date: 2019/8/2
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/2
**/
<comment>
    # 组件注释
    公用组件

      变量如下
      delAbled：是否可以删除
      src:人物头像
      name:人物名字
      key:唯一标识
      事件如下
      delExecutor：删除事件 调用父组件传递而来的方法
</comment>
<template>
  <div class="executor-container" :class="hasBorder?'border':''">
    <span
      v-if="delAbled"
      class="executor-remove"
      @mouseover="removeHover(true) "
      @mouseout="removeHover(false)"
      @click.stop="delExecutor"
    >
      <a-icon type="close-circle" theme="filled"/>
    </span>
    <div class="executor-content">
      <div class="executor">
        <div class="executor-handler">
          <span class="avatar">
            <img :src="src?src:imgError" alt="无" />
          </span>
          <div class="name" :title="name">{{name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "aExecutor",
  components: {},
  // props:{
  //   delAbled:{
  //     type:Boolean,
  //     default:false
  //   },
  //   src:{
  //     type:String,
  //     default:''
  //   },
  //   name:{
  //     type:String,
  //     default:''
  //   }
  // },
  props:['delAbled','src','name'],
  data() {
    return {
      hasBorder: false,
      imgDefault: require("#/assets/image/logo-pro.png"),
      imgError: require("#/assets/image/logo-pro.png")
    };
  },
  computed: {
    // delAbled,
    // src,
    // name,
    // key,
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    //删除图标hover事件
    removeHover(val) {
      this.hasBorder = val;
    },
    //删除图标删除事件
    delExecutor(){
      this.$emit('handleDel')
    },
    imgerrorfun() {
      var img = event.srcElement;
      img.src = this.imgError;
      img.onerror = null;
      //控制不要一直跳动;
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">

.executor-container.border {
  @include primary_border_color();
}
.executor-container {
  display: inline-block;
  margin:0 11px 0 -4px;
  position: relative;
  background: $bg-color-1;
  border-radius: 9999px;
  border: 1px solid transparent;
  border-color: transparent;
  cursor: pointer;
  &:hover {
    background: $bg-color-2;
    border-radius: 15px;
    @include primary_color();
  }
  .executor-remove {
    position: absolute;
    right: -6px;
    top: -6px;
    z-index: 1;
    font-size: 16px;
    cursor: pointer;
    display: none;
    @include primary_color();
  }
  &:hover .executor-remove {
    display: block;
  }
  .executor-content {
    .executor {
      padding: 4px;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-align-items: center;
      -ms-flex-align: center;
      align-items: center;
      .executor-handler {
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-align-items: center;
        -ms-flex-align: center;
        align-items: center;
        transition: color 218ms;
        overflow: hidden;
        .avatar {
          img {
            display: inline-block;
            background-color: $bg-color-1;
            width: 24px;
            height: 24px;
            border-radius: 50%;
          }
        }
        .name {
          display: inline-block;
          height: 100%;
          width: 42px;
          text-align: justify;
          text-align-last: justify;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin: 0 8px;
          margin-right:0;
        }
      }
    }
  }
}
</style>
