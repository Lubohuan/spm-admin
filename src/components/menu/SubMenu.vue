/**
* @Author: 李晨光
* @Date: 2019/7/2
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/7/2
**/
<comment>
  # 组件注释
  配合menu，递归生成左侧导航
</comment>
<template>
    <a-sub-menu
      :key="menuInfo.key"
      v-bind="$props"
      v-on="$listeners"
    >
    <span slot="title" @click="routerLink(menuInfo.path)">
      <a-icon v-if="menuInfo.icon" :type="menuInfo.icon" /><span>{{ menuInfo.title }}</span>
    </span>
      <template v-for="item in menuInfo.children">
        <a-menu-item
          v-if="!item.children"
          :key="item.path"
          @click="routerLink(item.path)"
        >
          <span>{{ item.title }}</span>
        </a-menu-item>
        <sub-menu
          v-else
          :key="item.key"
          :menu-info="item"
        />
      </template>
    </a-sub-menu>
</template>

<script>
  import { Menu } from 'ant-design-vue';
  export default {
    isSubMenu: true,
    name: 'SubMenu',
    components: {},
    props: {
      ...Menu.SubMenu.props,
      menuInfo: {
        type: Object,
        default: ()=>({}),
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
    methods: {
      routerLink(path) {
        path && this.$router.push(path)
      }
    },
    destroyed() {
    }
  }
</script>

<style lang="scss">
</style>
