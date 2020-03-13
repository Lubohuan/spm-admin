/**
* @Author: 李晨光
* @Date: 2019/7/2
* @Version: 1.0
* @Last Modified by: zmm
* @Last Modified time: 2019/8/16
**/
<comment>
  # 组件注释
  项目基础布局
  ——————————————
  | |———————————|
  | | |
  | | |
  | | |
  ——————————————
</comment>
<template>
  <div id="BasicLayout">
    <a-layout class="layout-custom-trigger">
      <!--上栏菜单-->
      <basic-toolbar @side-icon-click="toggleCollapsed" ></basic-toolbar>
      <a-layout>
        <!--左侧导航-->
        <basic-drawer :routes="list" v-model="collapsed" class="left-drawer"></basic-drawer>
        <!--中心内容-->
        <a-layout-content class="a-layout-content" id="a-layout-content">
          <router-view/>
          <!--<BasicMenuList />-->
        </a-layout-content>
        <div v-if="!collapsed" @click="$root.eventHub.$emit('toggleCollapsed')" style="position: absolute; left: 0;top: 0;width: 100%;height: 100%;z-index: 998;background: rgba(0,0,0,.5)">

        </div>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
  import BasicDrawer from "@/layouts/BasicDrawer";
  import BasicToolbar from "@/layouts/BasicToolbar";
  import BasicMenuList from '@/menu/BasicMenuList'

  export default {
    name: "BasicLayout",
    components: {
      "basic-drawer": BasicDrawer,
      "basic-toolbar": BasicToolbar,
      "BasicMenuList": BasicMenuList,
    },
    props: {},
    data() {
      return {
        collapsed: true,
        list: [
          {
            title: "首页",
            icon: 'spm-icon-home',
            path: "/main/home"
          },
          {
            title: "集中测试",
            icon: 'mail',
            path: "/main/test",
            children: [
              {
                title: "路博欢",
                icon: '',
                path: "/main/test/lubohuan"
              },
              {
                title: "李晨光",
                icon: '',
                path: "/main/test/lichenguang",
                children: [
                  {
                    title: "table模板",
                    icon: '',
                    path: "/main/test/lichenguang/tableTemplate"
                  },
                  {
                    title: "基础组件",
                    icon: '',
                    path: "/main/test/lichenguang/baseComponents"
                  }
                ]
              },
              {
                title: "张蒙",
                icon: '',
                path: "/main/test/zhangmeng"
              },
              {
                title: "兰文亮",
                icon: '',
                path: "/main/test/lanwenliang"
              },
              {
                title: "胡玲",
                icon: '',
                path: "/main/test/huling"
              },
              {
                title: "何景春",
                icon: '',
                path: "/main/test/hejingchun"
              },
              {
                title: "刘攀",
                icon: '',
                path: "/main/test/liupan"
              },
              {
                title: "刘艺伟",
                icon: '',
                path: "/main/test/liuyiwei"
              }
            ]
          },
          {
            title: "项管家",
            icon: 'deployment-unit',
            path: "/main/projectHousekeeper",
            children: [
              {
                title: "任务管理",
                icon: '',
                path: "/main/projectHousekeeper/taskManagement"
              },
              {
                title: "通讯录",
                icon: '',
                path: "/main/projectHousekeeper/telBook"
              }
            ]
          }
        ],
        menus: [
          {
            id: '1',
            name: '',
            isCollect: false,
          }
        ]
      };
    },
    computed: {},
    created() {

    },
    mounted() {
    },
    watch: {},
    methods: {
      toggleCollapsed(val) {
        //导航展开收起
        this.collapsed = val;
        setTimeout(() => {
          this.$root.eventHub.$emit('keepOpen', !val)
        },200)

      }
    },
    destroyed() {
    }
  };
</script>

<style lang="scss">
  #BasicLayout {
    width: 100%;
    height: 100%;
    padding-top:60px;
    .a-layout-content {
      position: relative;
      height: calc(100vh - 60px);
    }
    .layout-custom-trigger {
      width: 100%;
      height: 100%;
    }
    .left-drawer{
      /*position: absolute;*/
      /*left: 0;*/
      /*z-index: 1;*/
      /*height: calc(100vh - 60px);*/
    }
  }

  .ant-layout {
    height: 100%;
    position: relative;
  }
</style>
