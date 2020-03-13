// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex/index.js'
import vfilter from '#/assets/js/vfilter'
import Util from '#/assets/js/util'
import Common from '#/assets/js/common'
import debounce from 'lodash.debounce'
Vue.prototype.debounce = debounce
// 引入ant-design-vue
import Antd from 'ant-design-vue'
import './assets/css/antd.css'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

/*国际化*/
import i18n from './i18n/i18n';

Vue.use(Antd)
Vue.prototype.moment = moment
// 自定义 font 图标
import { Icon } from 'ant-design-vue'
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1271362_3kbrvajro7k.js',
  //scriptUrl: '//at.alicdn.com/t/font_1271362_ugz0hir2ltp.js',
})
Vue.component('icon-font', IconFont)

// 公用方法
Vue.use(Util)
Vue.use(Common)
// 项目用引入并使用 vuetify
// import Vuetify from 'vuetify'
// import 'vuetify/dist/vuetify.min.css'
// Vue.use(Vuetify, {
//   theme: {
//     primary: '#E1673A',
//     secondary: '#b0bec5',
//     accent: '#8c9eff',
//     error: '#b71c1c'
//   }
// })

// 重置样式
import '#/assets/css/reset.css'
// 基础样式
// import '#/assets/css/base.scss'

// 引入请求方式
import { get, post, postParams, uploadFile, uploadFileBusiness, uploadImg, getAll, exportFile } from '#/assets/js/http'

// 在vue原型链上注册 axios
// get请求
Vue.prototype.$get = get
// post请求
Vue.prototype.$post = post
// post请求
Vue.prototype.$postParams = postParams
// uploadFile请求
Vue.prototype.$uploadFile = uploadFile
Vue.prototype.$uploadFileBusiness = uploadFileBusiness
Vue.prototype.$uploadImg = uploadImg
//导出
Vue.prototype.$exportFile = exportFile
// 多并发请求
Vue.prototype.$getAll = getAll

import Croppa from 'vue-croppa'
Vue.use(Croppa)

// 过滤器
for (let key in vfilter.vfilter) {
  console.log(key)
  Vue.filter(key, vfilter.vfilter[key])
}
// 引入loading指令
import { MyLoading } from '#/directive/loading/loading.directive'
//引入组件
import Loading from '@/loading/index'
//然后通过 USE方法全局注册
Vue.use(Loading);

// 引入点击水波纹指令
import vueWaves from './directive/waves/waves.directive'
Vue.use(vueWaves)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: document.getElementById("app"),//更为优化，避免vue内部机制查找  （vue内部机制中寻找元素时，稍稍占一点内存）
  router,
  store,
  i18n,
  data: {
    eventHub: new Vue() // 事件中心
  },
  components: { App },
  template: '<App/>'
})
