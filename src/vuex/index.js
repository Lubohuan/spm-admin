/**
 * Created by pc on 2018/6/19.
 */
import vue from 'vue'
import vuex from 'vuex'
import state from './state.js'
import * as getters from './getters.js'
import mutations from './mutations.js'
import actions from './actions.js'
import createLogger from 'vuex/dist/logger' // 修改日志
import createPersistedState from 'vuex-persistedstate'

vue.use(vuex)

const debug = process.env.NODE_ENV !== 'production' // 开发环境中为true，否则为false

export default new vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {},
  plugins: debug ? [createLogger(),createPersistedState()] : [createPersistedState()] // 开发环境下显示vuex的状态修改
  // plugins: debug ? [createLogger()] : [] // 开发环境下显示vuex的状态修改
  // plugins:[createPersistedState()]
})
