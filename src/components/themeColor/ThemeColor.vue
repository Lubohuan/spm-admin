/**
* @Author: 李晨光
* @Date: 2019/7/2
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/7/2
**/
<comment>
  # 组件注释
  111
</comment>
<template>
  <div id="ThemeColor">
    <a-tooltip class="setting-drawer-theme-color-colorBlock" v-for="(item, index) in colorList" :key="index">
      <template slot="title">
        {{ item.key }}
      </template>
      <a-tag :color="item.color" style="" @click="changeColor(item.color)">
        <a-icon type="check" v-if="item.color === primaryColor"></a-icon>
      </a-tag>
    </a-tooltip>
  </div>
</template>

<script>
  import {
    mapState, mapActions
  } from "vuex"
  import config from './defaultSettings'
  import {updateTheme, colorList} from './settingConfig'

  export default {
    name: 'ThemeColor',
    components: {},
    props: {},
    data() {
      return {
        colorList,
        baseConfig: Object.assign({}, config),
      }
    },
    computed: {
      ...mapState({
        primaryColor: state => state.color,
      })
    },
    created() {
    },
    mounted() {
      // 当主题色不是默认色时，才进行主题编译
      /*if (this.primaryColor !== config.primaryColor) {
        updateTheme(this.primaryColor)
      }*/
    },
    watch: {},
    methods: {
      changeColor(color) {
        this.$loading.show('loading')
        this.$store.commit('SET_LOADING_FINISH', false)
        this.baseConfig.primaryColor = color
        if (this.primaryColor !== color) {
          this.$store.commit('SET_COLOR', color)
          updateTheme(color, () => {
            setTimeout(() => {this.$loading.hide('loading')},500)
            let mapFrame = document.getElementById('iframe')
            if(mapFrame){
              let iframeWin = mapFrame.contentWindow
              iframeWin.postMessage({
                primaryColor: color
              },'*')
            }
          })

        }
      }
    },
    destroyed() {
    }
  }
</script>

<style lang="scss">
  #ThemeColor {
    height: 30px;
    display: flex;
    align-items: center;
  }
</style>
