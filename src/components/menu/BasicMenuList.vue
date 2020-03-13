/**
* @Author: zmm
* @Date: 2019/8/15
* @Version: 1.0
* @Last Modified by: zmm
* @Last Modified time: 2019/8/16
**/
<comment>
  # 组件注释
</comment>
<template>
  <div id="BasicMenuList">
    <div class="wrap">
      <div class="banner">
        <div class="search_warp">
          <a-input placeholder="请输入关键词搜索" v-model="searchMenuName" ref="searchMenuName" @change="deb">
            <a-icon slot="prefix" type="search"/>
          </a-input>
        </div>
        <icon-font type="spm-icon-guanbi" class="close_btn" @click="closeBasicMenuList"/>
      </div>
      <div class="content">
        <a-row class="left">
          <a-col :span="24" v-for="(second,index) in menus" :key="index + 'second'" class="m-t-20">
            <div class="title">
              <icon-font type="spm-icon-icon-test" class="menu_icon"/>
              <span style="font-size: 16px">{{second.name}}</span>
            </div>
            <a-row>
              <a-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8" v-for="(third,index) in second.children"
                     :key="index + 'third'">
                <div class="third_menu_item"
                     :class="{'third-menu-active': selected == third.id}"
                     @mouseover="showStartIconActive(third)"
                     @mouseleave="hideStartIconActive()"
                     @click="active(third)">
                  <span class="third_menu">{{third.name}}</span>
                  <span style="font-size: 16px">
                    <a-icon type="star" v-if="third.isCollected" theme="filled" class="star_icon"
                            @click.stop="selectMenu(third)"/>
                    <a-icon type="star" v-if="third.id == hover && !third.isCollected" class="star_icon"
                          @click.stop="selectMenu(third)"/>
                  </span>
                </div>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <!--<div class="second_menu_warp" v-for="(second,index) in menus" :key="index + 'second'">
        </div>-->

       <!-- <div class="left">
          <div class="second_menu_warp" v-for="(second,index) in menus" :key="index + 'second'">
            <div class="title">
              <icon-font type="spm-icon-icon-test" class="menu_icon"/>
              <span style="font-size: 16px">{{second.name}}</span>
            </div>
            <a-row>
              <a-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8" v-for="(third,index) in second.children"
                     :key="index + 'third'">
                <div class="third_menu_item"
                     :class="{'third-menu-active': selected == third.id}"
                     @mouseover="showStartIconActive(third)"
                     @mouseleave="hideStartIconActive()"
                     @click="active(third)">
                  <span class="third_menu">{{third.name}}</span>
                  <a-icon type="star" v-if="third.isCollected" theme="filled" class="star_icon"
                          @click.stop="selectMenu(third)"/>
                  <a-icon type="star" v-if="third.id == hover && !third.isCollected" class="star_icon"
                          @click.stop="selectMenu(third)"/>
                </div>
              </a-col>
            </a-row>

          </div>
        </div>-->
        <!--<a-anchor>
          <a-anchor-link v-for="(item,index) in menuList" :key="index"
                         href="#components-anchor-demo-basic" :title="item.name" />
        </a-anchor>-->
        <div class="right">
          <!--<div class="first_menu_wrap" :class="{'first-menu-active': firstMenuActive === item.id}"
               v-for="(item,index) in menuList" :key="index" @click="selectFirstMenu(item)">
            <icon-font type="spm-icon-copy14"/>
            <span class="first_menu">{{item.name}}</span>
          </div>-->
          <a-tabs style="height: 100%" v-model="firstMenuActive" @change="selectFirstMenu" tabPosition="left" class="left-line" v-if="menuList.length">
            <a-tab-pane  v-for="(item,index) in menuList"
                        :key="item.id">
              <span slot="tab">
                <a-icon type="apple" />
                {{item.name}}
              </span>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </div>
    <!--<div class="mask" @click="closeBasicMenuList"></div>-->
  </div>
</template>

<script>
  import {mapState} from "vuex"
  import debounce from 'lodash.debounce'
  export default {
    name: 'BasicMenuList',
    components: {},
    props: {
      menuList: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data() {
      return {
        showBasicMenuList: true,
        searchMenuName: '',
        showStarIcon: false,
        firstMenuActive: '1',  // 一级标题选中项
        selected: '', // 三级标题选中项
        hover: '',// 鼠标滑动选中项
        menus: [],// 二三级菜单
        initMenus: [],
        collects: []
      }
    },
    computed: {
      ...mapState({
        collections: state => state.collections,
      })
    },
    created() {
      if(this.menuList.length) {
        this.firstMenuActive = this.menuList[0].id
        this.initMenus = this.menuList.find(e => e.id == this.firstMenuActive).children
        this.menus = Util.deepCopy(this.initMenus)
        this.setCollections(this.menus)
      }
      this.$root.eventHub.$on('updateStatus', () => {
        this.setCollections(this.menus)
      })
      // this.menus = []
      // this.menuList.forEach(item => {
      //   this.menus.push(...item.children)
      // })
    },
    mounted() {
    },
    watch: {},
    methods: {
      // 关闭菜单
      closeBasicMenuList() {
        this.$emit('closed', false)
      },
      /**
       * 点击选择menu
       * @param item
       */
      active(item) {
        this.selected = item.id
        this.$root.eventHub.$emit('toggleCollapsed')
        this.$emit('closed', false)
        if(item.isThird) {
          this.$router.push({name: 'App', query: {url: item.uri}})
        }else {
          this.$router.push(item.uri)
        }
      },
      // 显示 隐藏⭐
      showStartIconActive(item) {
        this.hover = item.id
      },
      hideStartIconActive() {
        this.hover = ''
      },
      // 选中或取消菜单  收藏
      selectMenu(item) {
        item.isCollected = !item.isCollected
        let arr = this.collections
        if(item.isCollected) {
          arr.push(item)
        }else{
          arr.splice(arr.findIndex(col => col.id == item.id), 1)
        }
        this.$store.commit('SET_COLLECTIONS', arr)
        this.$root.eventHub.$emit('collected')
      },
      // 选择一级菜单
      selectFirstMenu(item) {
        this.firstMenuActive = item
        this.initMenus = this.menuList.find(e => e.id == this.firstMenuActive).children
        this.menus = Util.deepCopy(this.initMenus)
        this.setCollections(this.menus)
      },
      setCollections(menu) {
        menu.length && menu.forEach((item) => {
          let obj = item
          if (obj.type == 'menu' ) {
            if (this.collections.find(col => col.id == obj.id)) {
              obj.isCollected = true
            }else{
              obj.isCollected = false
            }
          }
          if (obj.children && obj.children.length) {
            this.setCollections(obj.children)
          }
        })
      },
      // 搜索
      /**
       * 监听input 执行debounce 延时1S后执行搜索方法
       */
      deb: debounce(function () {
          // 搜索方法
          this.search()
        }, 300  // 延迟时间
      ),
      /**
       * 搜索
       */
      search() {
        if(this.searchMenuName) {
          this.menus = Util.treeSearch(this.searchMenuName, 'name', this.initMenus)
        }else{
          this.menus = Util.deepCopy(this.initMenus)
        }
      }
    },
    destroyed() {
    }
  }
</script>

<style lang="scss">
  #BasicMenuList {
    max-width: 1200px;
    width: 100%;
    height: calc(100vh - 60px);
    background: transparent;
    .mask {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: transparent;
      z-index: 101;
    }
    .wrap {
      max-width: 920px;
      height: calc( 100vh - 60px);
      box-sizing: border-box;
      padding-left: 30px;
      background: #fff;
      box-shadow: 1px 0px 20px 0px rgba(0, 0, 0, 0.2);
      .banner {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding-right: 32px;
        box-sizing: border-box;
        .search_warp {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          width: 840px;
          height: 65px;
          box-sizing: border-box;
          border-bottom: 1px solid #fff;
          @include primary_border_color();

          .ant-input {
            border: none;
          }
        }
        .close_btn {
          font-size: 24px;
          cursor: pointer;
        }
      }
      .content {
        display: flex;
        margin-top: 36px;
        width: 100%;
        height: calc(100% - 137px);
        .title {
          line-height: 22px;
          margin-bottom: 6px;
          .menu_icon {
            margin-right: 10px;
          }
        }
        .second_menu_warp {
          width: 100%;
          margin-bottom: 26px;
          .third_menu_wrap {
            display: flex;
            flex-wrap: wrap;

          }

        }
        .third_menu_item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-sizing: border-box;
          padding: 0 30px 0 28px;
          width: 100%;
          height: 36px;
          cursor: pointer;
          .third_menu {
            display: inline-block;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .star_icon {
            @include primary_color();
          }
        }
        .third_menu_item:hover {
          @include primary_color();
          @include primary_bg_color_o();
        }
        .third-menu-active {
          @include primary_color();
        }
        .left {
         /* display: flex;
          flex-direction: column;
          width: 810px;
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;*/
          width: 100%;
          padding-right: 260px;
          overflow-y: auto;
        }
        .right {
          position: absolute;
          right: 14px;
          width: 240px;
          height: calc(100% - 190px);
          margin: 28px 0 0 30px;
          /*border-left: 1px solid rgba(221, 221, 221, 1);*/
          box-sizing: border-box;
          overflow: hidden;
          .first_menu_wrap {
            display: flex;
            align-items: center;
            box-sizing: border-box;
            padding-left: 24px;
            width: 100%;
            height: 40px;
            border-left: 2px solid transparent;
            cursor: pointer;
            .first_menu {
              display: inline-block;
              width: 170px;
              margin-left: 15px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .first-menu-active {
            @include primary_color();
            @include primary_border_color();
            box-sizing: border-box;
            i {
              @include primary_color();
            }
          }
        }
      }
    }
    .left-line.ant-tabs-vertical.ant-tabs-left > .ant-tabs-bar {
      border-left: 1px solid #e8e8e8!important;
      border-right: 0;
    }
    .left-line .ant-tabs-left-bar .ant-tabs-ink-bar{
      left: 0!important;
    }
    .left-line .ant-tabs-left-bar .ant-tabs-nav-container{
      margin-left: -1px;
    }
    .left-line .ant-tabs-left-bar .ant-tabs-tab {
      text-align: left!important;
    }
  }

</style>
