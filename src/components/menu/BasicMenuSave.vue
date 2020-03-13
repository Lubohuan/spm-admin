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
  <div id="BasicMenuSave">
    <a-dropdown class="menu-dropdown" :trigger="['click']" v-model="isOpen" overlayClassName="navs">
      <div class="main_menu">
        <icon-font type="spm-icon-gongneng" class="icon"/>
        <span>功能菜单</span>
        <a-icon type="right" class="right_icon"/>
      </div>
      <basic-menu-list ref="basicMenu" :menuList="menuList" @closed="closed" overlayClassName="basic-menu" slot="overlay"></basic-menu-list>
    </a-dropdown>

    <a-menu theme="light" mode="inline" :inlineCollapsed="collapsed" :openKeys="['BasicMenuSave']">
      <a-sub-menu key="BasicMenuSave">
          <template slot="title">
              <icon-font type="spm-icon-shoucangcopy"/><span>我的收藏</span>
              <span class="clear_action" @click.stop="clearSelectMenu">清空</span>
          </template>
        <draggable v-if="list.length" v-model="list" :options="{handle: '.drag-btn', filter: 'draggable_item', animation: 500}" @update="datadragEnd" class="drag-menu">
          <transition-group>
            <a-menu-item v-for="(element,index) in list" :key="element.id" class="draggable_item flex justify-between"
                         @mouseenter="menuMouseenter(index)" @mouseleave="menuMouseleave" @click="selectMenu(element)">
              <div class="flex align-center">
                <span class="active_wrap">
                  <icon-font class="select_menu" v-if="element.id == menuActive" type="spm-icon-copy14"/>
                </span>
                <span class="menu_txt" :class="{draggable_item_active:element.id === menuActive}">{{element.name}}</span>
              </div>
              <div>
                <icon-font class="delete_btn" v-show="index === menuHover" type="spm-icon-guanbi" @click.stop="deleteCollections(element)"/>
                <icon-font class="delete_btn drag-btn" v-show="index === menuHover" type="spm-icon-tuodong"/>
              </div>
            </a-menu-item>
          </transition-group>
        </draggable>
      </a-sub-menu>
    </a-menu>
  </div>
</template>

<script>
  import BasicMenuList from '@/menu/BasicMenuList'
  import {mapState} from "vuex"
  import draggable from 'vuedraggable'

  export default {
    name: 'BasicMenuSave',
    components: {
      draggable,
      'basic-menu-list': BasicMenuList
    },
    props: {},
    data() {
      return {
        isOpen: false,
        collapsed: true, // 折叠
        menuHover: null, // 鼠标移动项
        menuActive: null, // 选中项
        list: [], // 收藏列表
        menuList:[], // 所有菜单
        collects:[]
      }
    },
    computed: {
      ...mapState({
        route: state => state.route,
        collections: state => state.collections,
        resources: state => state.resources,
      })
    },
    created() {
      if(this.resources.length) {
        this.menuList = this.resources
        this.getCollections(this.menuList)
      }else{
        this.list  = []
      }
      this.collects = this.list
      this.$store.commit('SET_COLLECTIONS', this.collects)
      this.$root.eventHub.$on('collected', () => {
        this.list  = this.collections
      })
      this.$root.eventHub.$on('keepOpen', (val) => {
        this.isOpen  = val
      })

    },
    mounted() {
    },
    watch: {},
    methods: {
      // 获取收藏导航
      getCollections(menu) {
        menu.length && menu.forEach((item) => {
          let obj = item
          if (obj.isCollected && obj.type == 'menu' ) {
            if (!this.list.find(col => col.id == obj.id)) {
              this.list.push(obj)
            }
          }
          if (obj.children && obj.children.length) {
            this.getCollections(obj.children)
          }
        })
      },
      closed(e) {
        this.isOpen = e
        this.$root.eventHub.$emit('toggleCollapsed')
      },
      keepOpen() {
        console.log(111)
        this.isOpen = true
      },
      // 鼠标移入菜单选项
      menuMouseenter(i) {
        this.menuHover = i

      },
      // 鼠标移出菜单选项
      menuMouseleave() {
        this.menuHover = null
      },
      // 选中菜单
      selectMenu(item) {
        this.menuActive = item.id
        this.$root.eventHub.$emit('toggleCollapsed')
        if(item.isThird) {
          this.$router.push({name: 'App', query: {url: item.uri}})
        }else {
          this.$router.push(item.uri)
        }
      },
      // 清空收藏菜单
      clearSelectMenu() {
        this.isOpen = true
        this.list = []
        this.$store.commit('SET_COLLECTIONS', this.list)
        this.setCollections(this.menuList)

      },
      // 收藏拖拽上下移动
      datadragEnd() {
        this.$store.commit('SET_COLLECTIONS', this.list)
      },

      /**
       * 删除收藏
       * @param item
       */
      deleteCollections(item) {
        this.isOpen = true
        this.list.splice(this.list.findIndex(li => li.id == item.id), 1)
        this.$store.commit('SET_COLLECTIONS', this.list)
        this.$root.eventHub.$emit('updateStatus')
        // this.setCollections(this.menuList)
      }
    },
    destroyed() {
    }
  }
</script>

<style lang="scss">
  .navs{
    left: 240px!important;
    top: 60px!important;
  }
  #BasicMenuSave {
    .main_menu {
      display: flex;
      align-items: center;
      padding: 0 16px 0 24px;
      margin: 4px 0;
      line-height: 40px;
      height: 40px;
      font-size: 14px;
      cursor: pointer;
      .icon {
        margin-right: 10px;
      }
      .right_icon {
        position: absolute;
        right: 16px;
        font-size: 12px;
      }
    }
    .clear_action {
      margin-left: 40px;
      font-size: 14px;
      font-weight: 400;
      /*color: rgba(234, 111, 70, 1);*/
    }
    .draggable_item {
      display: flex;
      align-items: center;
      padding: 0 16px 0 24px;
      margin: 4px 0;
      line-height: 40px;
      height: 40px;
      list-style-type: disc;
      list-style-position: inside;
      font-size: 14px;
      cursor: pointer;
      transition: color .3s;
    }
    .sortable-chosen {
      @include primary_bg_color_o;
    }
    .draggable_item_active {
      @include primary_color;
    }
    .draggable_item:hover {
      @include primary_color;
    }
    .active_wrap {
      display: inline-block;
      width: 14px;
      height: 40px;
    }
    .menu_txt {
      display: inline-block;
      /*width: 165px;*/
      margin-left: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .select_menu, .delete_btn {
      @include primary_color;
      font-size: 14px;
    }
    .drag-menu{
      height: calc( 100vh - 160px);
      overflow: hidden;
    }
    .drag-menu:hover{
      overflow: auto;
    }
  }
</style>
