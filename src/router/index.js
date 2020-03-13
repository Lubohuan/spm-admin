import Vue from "vue"
import Router from "vue-router"
import { publicRoute, protectedRoute } from "./config"
import NProgress from "nprogress"
import "nprogress/nprogress.css"
const routes = publicRoute.concat(protectedRoute)
import Cookie from 'js-cookie'
Vue.use(Router)
const router = new Router({
  mode: "hash",
  linkActiveClass: "active",
  routes: routes
})
// router gards
router.beforeEach((to, from, next) => {
  //auth route is authenticated
  const jwt = Cookie.get('jwt');
  console.log(to.path)
  if(to.path == '/login' || to.path == '/forgotPwd' || to.path == '/loginByAdmin') {
    NProgress.start()
    next()
  }else{
    if(jwt) {
      NProgress.start()
      next()
    }else{
      next('/login')
    }
  }
  // NProgress.start()
  //     next()
})

router.afterEach((to, from) => {
  NProgress.done()
})

export default router
