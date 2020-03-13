/**
* @Author: 李晨光
* @Date: 2019/7/1
* @Version: 1.0
* @Last Modified by: zmm
* @Last Modified time: 2019/8/16
**/
<comment>
    # 组件注释
</comment>
<template>
    <div id="BasicDrawer">
      <a-layout-sider
        class="sider"
        :trigger="null"
        width="240px"
        :collapsedWidth="0"
        collapsible
        theme="light"
        v-model="collapsed"
      >
        <div class="menu" v-show="!collapsed">
          <!--<a-menu
            :defaultSelectedKeys="[$route.path]"
            :openKeys.sync="openKeys"
            mode="inline"
            :inlineCollapsed="collapsed"
          >
            <template v-for="item in routes">
              <a-menu-item v-if="!item.children" :key="item.path" @click="routerLink(item.path)">
                <icon-font v-if="item.icon" :type="item.icon?item.icon:''" />
                <span>{{item.title}}</span>
              </a-menu-item>
              <sub-menu v-else :menu-info="item" :key="item.path"/>
            </template>
          </a-menu>-->
          <!-- 收藏菜单组件 -->
          <BasicMenuSave ref="BasicMenuSave" @closed="closed"></BasicMenuSave>
        </div>
      </a-layout-sider>
    </div>
</template>

<script>
  import { mapState } from "vuex"
  import VuePerfectScrollbar from "vue-perfect-scrollbar"
  import SubMenu from '@/menu/SubMenu'
  import BasicMenuSave from '@/menu/BasicMenuSave'
    export default {
      name: 'BasicDrawer',
      components: {
        'sub-menu': SubMenu,
        "BasicMenuSave": BasicMenuSave
      },
      props: {
        collapsed: {
          type: Boolean,
          default: false,
        },
        routes: {
          type: Array,
          default: () => {
            return []
          }
        },
        defaultSelectedKeys:{
           type: Array,
            default: () => {
            return []
          }
        }
      },
      model: {
        prop: 'collapsed',
        event: 'closed'
      },
      data() {
        return {
          logoPro:require('#/assets/image/logo-pro.png'),
          logoSub:require('#/assets/image/logo-sub.png'),
          openKeys: [],
        }
      },
      computed: {
        ...mapState({
          route: state => state.route,
          open_keys: state => state.open_keys,
        })
      },
      created() {
        this.openKeys = this.open_keys
      },
      mounted() {
      },
      watch: {
        // 监听route 保证历史记录
        $route(val){
          // console.log(val)
          this.$store.commit('SET_ROUTE',val.path)
        },
        // 监听openKeys 保证历史记录
        openKeys (val) {
          // console.log('openKeys', val)
          this.$store.commit('SET_OPENKEYS',val)
        }
      },
      methods: {
        routerLink(path) {
          path && this.$router.push(path)
        },
        closed() {
          this.collapsed = false
        }
      },
      destroyed() {
      }
    }
</script>

<style lang="scss">
  #BasicDrawer{
    height: 100%;
    .menu{
      height: 100%;
      overflow: hidden;
    }
    .menu:hover{
      overflow: hidden;
    }
    .ant-menu-inline .ant-menu-item:after {
      right: calc(100% - 3px);
    }
    .ant-menu-inline .ant-menu-item, .ant-menu-inline .ant-menu-submenu-title {
      /* width: calc(100% + 1px); */
      width: 100%;
    }
    .sider{
      height: 100%;
      box-shadow: none;
      position: absolute;
      z-index: 999;
    }
    .menu{
      border-right: 1px solid $border-color-1;
    }
    .ant-menu-root.ant-menu-vertical, .ant-menu-root.ant-menu-vertical-left, .ant-menu-root.ant-menu-vertical-right, .ant-menu-root.ant-menu-inline{
      border: 0;
    }

  }
</style>
