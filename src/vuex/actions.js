
import {
  SET_NAME,
  SET_LOGINMSG,
  SET_COLOR,
  SET_ROUTE,
  SET_OPENKEYS,
  SET_CURR_ORG,
  SET_CURR_TENANT,
  SET_LOADING_FINISH,
  SET_COLLECTIONS,
  SET_RESOURCES,
  SET_DICTS
} from './mutationTypes'
export default {
  ColorAsyn ({ commit }, color) {
    commit('SET_COLOR', color)
  },
  RouteAsyn ({ commit }, route) {
    commit('SET_ROUTE', route)
  },
  OpenKeysAsyn ({ commit }, open_keys) {
    commit('SET_OPENKEYS', open_keys)
  },
  CurrOrgAsyn ({ commit }, curr_org) {
    commit('SET_CURR_ORG', curr_org)
  },
  CurrTenantAsyn ({ commit }, curr_tenant) {
    commit('SET_CURR_TENANT', curr_tenant)
  },
  LoadingFinishAsyn ({ commit }, loading_finish) {
    commit('SET_LOADING_FINISH', loading_finish)
  },
  collectionsAsyn ({ commit },  collections) {
    commit('SET_COLLECTIONS',  collections)
  },
  citysAsyn ({ commit },  citys) {
    commit('SET_CITYS',  citys)
  },
  resourcesAsyn ({ commit },  resources) {
    commit('SET_RESOURCES',  resources)
  },
  dictsAsyn ({ commit },  dicts) {
    commit('SET_DICTS',  dicts)
  }

}

