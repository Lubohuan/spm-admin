/**
 * 项目默认配置项
 * primaryColor - 默认主题色
 *
 * storageOptions: {} - Vue-ls 插件配置项 (localStorage/sessionStorage)
 *
 */

export default {
  primaryColor: '#1890ff', // primary color of ant design
  production: process.env.NODE_ENV === 'production',
  // vue-ls options
  storageOptions: {
    namespace: 'pro__', // key prefix
    name: 'ss', // name variable Vue.[ls] or this.[$ls],
    storage: 'session' // storage name session, local, memory
  }
}
