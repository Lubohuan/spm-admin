/**
 * Created by pc on 2018/6/19.
 */
import Vue from 'vue'

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
  SET_CITYS,
  SET_RESOURCES,
  SET_DICTS
} from './mutationTypes'
export default {
  [SET_NAME] (state, name) {
    state.name = name
  },
  [SET_LOGINMSG] (state, login_msg) {
    state.login_msg = login_msg
  },
  [SET_COLOR]: (state, color) => {
    state.color = color
  },
  [SET_ROUTE]: (state, route) => {
    state.route = route
  },
  [SET_OPENKEYS]: (state, open_keys) => {
    state.open_keys = open_keys
  },
  [SET_CURR_ORG]: (state, curr_org) => {
    state.curr_org = curr_org
  },
  [SET_CURR_TENANT]: (state, curr_tenant) => {
    state.curr_tenant = curr_tenant
  },
  [SET_LOADING_FINISH]: (state, loading_finish) => {
    state.loading_finish = loading_finish
  },
  [SET_COLLECTIONS]: (state, collections) => {
    state.collections = collections
  },
  [SET_CITYS]: (state, citys) => {
    state.citys = citys
  },
  [SET_RESOURCES]: (state, resources) => {
    state.resources = resources
  },
  [SET_DICTS]: (state, dicts) => {
    state.dicts = dicts
  },

}
