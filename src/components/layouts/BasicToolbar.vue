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
  <div id="AppToolbar">
    <a-layout-header class="header ant-header-side-opened flex ">
      <div class="logo flex justify-between align-center">
        <!-- <img :src="logoPro" style="width: 60px;" alt="" v-if="collapsed">
        <img :src="logoPro" style="width: 60px;" alt="" v-if="!collapsed">
        <img :src="logoSub" style="width: 80px;" alt="" v-if="!collapsed"> -->
        <icon-font
          class="trigger"
          :type="collapsed ? 'spm-icon-indent' : 'spm-icon-outdent'"
          @click="toggleCollapsed"
        />
        <div class="flex justify-center align-center" style="width: 100%">
          <img :src="logoPro" style="width: 60px;" alt="">
          <img :src="logoSub" style="width: 80px;" alt="">
        </div>
      </div>
      <div class="header-right">
        <div>
          <a-popover trigger="click" placement="bottomLeft" v-show="isPlatform =='no'">
            <div style="color: #fff;" class="pointer">
              当前组织：<span>{{ curr_org.name }}</span>
              <icon-font type="spm-icon-flag"></icon-font>
            </div>
            <div slot="content">
              <a-card style="min-height: 500px;min-width: 500px;max-height:800px;overflow-y: auto;">
                <org-tree></org-tree>
              </a-card>
            </div>
          </a-popover>
        </div>
        <div style="color: #fff;" class="flex justify-end align-center">
          <!--用户中心-->
          <!--<nav-menu
            @click-Action="clickNav"
            :defaultValue="defaultValue"
            :navs="navs">
          </nav-menu>-->
          <div style="width: 80%;height: 100%;" v-if="false" class="flex justify-end">
            <a-menu
              style="width: 100%;height: 100%"
              class="flex justify-end"
              v-model="current"
              mode="horizontal"
              theme="dark"
            >
              <a-menu-item key="mail" v-waves >
                <a-icon type="mail" />Navigation One
              </a-menu-item>
              <a-menu-item key="app" v-waves>
                <a-icon type="appstore" />Navigation Two
              </a-menu-item>
              <a-menu-item key="alipay" v-waves>
                <a href="https://ant.design" target="_blank" rel="noopener noreferrer">Navigation Four - Link</a>
              </a-menu-item>
            </a-menu>
          </div>
          <user-menu></user-menu>
          <a-icon
            class="pointer"
            :type="fullscreen ? 'fullscreen-exit' :'fullscreen' " style="font-size: 16px"
            @click="handleFullScreen"/>
        </div>
      </div>
    </a-layout-header>
  </div>
</template>

<script>
  import ThemeColor from '@/themeColor/ThemeColor'
  import UserMenu from '@/menu/UserMenu'
  import NavMenu from '@/menu/NavMenu'
  import OrgTree from '@/menu/OrgTree'
  import { mapState } from "vuex"
  import Cookie from 'js-cookie'
  export default {
    name: 'AppToolbar',
    components: {
      'user-menu': UserMenu,
      'nav-menu': NavMenu,
      'org-tree': OrgTree
    },
    props: {},
    data() {
      return {
        collapsed: true,//左导航是否折叠
        fullscreen: false,//是否全屏
        defaultValue: 'anquan',
        screenWidth: document.body.clientWidth,
        logoPro:require('#/assets/image/logo-pro.png'),
        logoSub:require('#/assets/image/logo-sub.png'),
        navs: [
          {name: '设备安全管理', icon: 'spm-icondashboard', value: 'shebei'},
          {name: '设备安全管理', icon: 'spm-icondashboard', value: 'anquan'},
          {name: '设备安全管理', icon: 'spm-icondashboard', value: 'anquan2'},
          {name: '设备安全管理', icon: 'spm-icondashboard', value: 'anquan3'},
          {name: '设备安全管理', icon: 'spm-icondashboard', value: 'anquan4'},
          {name: '设备安全管理', icon: 'spm-icondashboard', value: 'anquan5'}
        ],
        current:['mail'],
        isPlatform: ''
      }
    },
    computed: {
      ...mapState({
        curr_org: state => state.curr_org,
      })
    },
    created() {
      this.$root.eventHub.$on('toggleCollapsed', () => {
        this.collapsed = true
        this.$emit("side-icon-click", true)
      })
      this.isPlatform = Cookie.get('isPlatform')
    },
    mounted() {
      window.onresize = () => {
        return (() => {
          this.screenWidth = document.body.clientWidth
          // if (this.screenWidth < 1200) {
          //   this.collapsed = true
          // } else {
          //   this.collapsed = false
          // }
          // this.$emit("side-icon-click", false)
          this.$root.eventHub.$emit('resizeIframe')
        })()
      }
    },
    watch: {
      screenWidth (val) {
        if (!this.timer) {
          this.screenWidth = val
          this.timer = true
          setTimeout( () => {
            this.timer = false
          }, 400)
        }
      }
    },
    methods: {
      //左导航折叠收起
      toggleCollapsed() {
        this.collapsed = !this.collapsed
        this.$emit("side-icon-click", this.collapsed)
      },
      //全屏操作
      handleFullScreen() {
        this.fullscreen = !this.fullscreen
        Util.toggleFullScreen()
      },
      clickNav(val) {
        console.log(val)
      }
    },
    destroyed() {
      window.onresize = null;
    }
  }
</script>

<style lang="scss">
  #AppToolbar {
    .logo {
      width: 240px;
      height: 60px;
      padding: 20px;
      box-sizing: border-box;
      @include primary_bg_color();
      img{
        margin: 20px 0;
      }
    }
    .header {
      position: fixed;
      top: 0;
      right: 0;
      z-index: 9;
      width: 100%;
      padding: 0;
      height: 60px;
      line-height: 60px;
    }
    .header-right{
      background: url('../../assets/image/header-bg.png') no-repeat;
      width: calc(100% - 240px);
      background-size: 100% 100%;
      padding: 0 20px;
      height: 60px;
      line-height: 60px;
      display: flex;
      justify-content: space-between;
    }
    .ant-header-side-opened{
      width: 100%;
    }
    .ant-header-side-closed {
      width: 100%;
    }
    .trigger {
      margin-right: 20px;
      font-size: 22px;
      line-height: 24px;
      cursor: pointer;
      color: #f3f3f3;
      transition: color .3s;
    }
    .trigger:hover {
      color: #fff;
    }
    .ant-menu-dark, .ant-menu-dark .ant-menu-sub {
      color: $font-color-4;
      font-size: $font-size-2;
      font-weight: $font-weight-1;
      background: transparent;
    }
    .ant-menu.ant-menu-dark.ant-menu-horizontal .ant-menu-item-selected, .ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected {
      background-color: rgba(0,0,0,.5);
    }

    .ant-menu-dark.ant-menu-horizontal > .ant-menu-item, .ant-menu-dark.ant-menu-horizontal > .ant-menu-submenu {
      background-color: rgba(0,0,0,0);
      border-bottom: 0;
      height: 100%;
      line-height: 60px;
    }
    .ant-menu-dark.ant-menu-horizontal > .ant-menu-item:hover, .ant-menu-dark.ant-menu-horizontal > .ant-menu-submenu:hover {
      background-color: rgba(0,0,0,.2);
    }
    .ant-menu-dark.ant-menu-horizontal > .ant-menu-item::after, .ant-menu-dark.ant-menu-horizontal > .ant-menu-submenu::after{
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      height: 40px;
      border-right: 1px solid rgba(0,0,0,.3);
    }
    .click{
      background-color: rgba(0,0,0,.5) ;
      color: #fff;
    }
  }

</style>
