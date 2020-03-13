/**
* @Author: 李晨光
* @Date: 2019/7/1
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/7/1
**/
<comment>
  # 组件注释
  项目入口
</comment>
<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <!-- isRouterAlive 保证keep-alive时，不影响全局刷新 -->
      <div id="appContainer" v-if="isRouterAlive">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive">
            <!-- 这里是会被缓存的视图组件，比如列表A页面 -->
          </router-view>
        </keep-alive>

        <router-view v-if="!$route.meta.keepAlive">
          <!-- 这里是不被缓存的视图组件，比如详情B页面-->
        </router-view>
      </div>
    </div>
  </a-locale-provider>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import config from "@/themeColor/defaultSettings";
import { updateTheme, colorList } from "@/themeColor/settingConfig";
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";

export default {
  name: "App",
  components: {},
  props: {},
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      baseConfig: Object.assign({}, config),
      isRouterAlive: true,
      locale: zhCN
    };
  },
  computed: {
    ...mapState({
      primaryColor: state => state.color,
      loading_finish: state => state.loading_finish
    })
  },
  created() {
    // window.document.documentElement.setAttribute("data-theme", "theme");

    // 语言
    // this.$i18n.locale = 'en';

    // 当主题色不是默认色时，才进行主题编译
    if (this.primaryColor !== config.primaryColor) {
      this.isRouterAlive = true;
      updateTheme(this.primaryColor, () => {
        if (document.getElementById("loading-loader")) {
          // console.log('我加载完了')
          document.body.removeChild(document.getElementById("loading-loader"));
          //this.getDictAll();
        }
      });
    }
  },
  mounted() {},
  watch: {},
  methods: {
    /*changeColor(color) {
            this.baseConfig.primaryColor = color
            if (this.primaryColor !== color) {
              this.$loading.show('loading')
              this.$store.commit('SET_LOADING_FINISH', false)
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
          },*/
    // 全局刷新
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    },

  },
  destroyed() {}
};
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
}

#app {
  width: 100%;
  height: 100%;

  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;*/
}

#appContainer {
  height: 100%;
}
</style>
