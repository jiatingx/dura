import Vue from "vue"
import VueRouter from "vue-router"
Vue.use(VueRouter)

// import { setupLayouts } from "virtual:generated-layouts"
// import generatedRoutes from "virtual:generated-pages"

// const routes = setupLayouts(generatedRoutes)

import routes from "~pages"

console.log("routes", routes)

const routerReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = location => {
  return routerReplace.call(this, location).catch(err => err)
}

const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = location => {
  return routerPush.call(this, location).catch(err => err)
}

const createRouter = () =>
  new VueRouter({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes,
  })

const router = createRouter()

//constantRoutes 是静态路由，不需要动态权限判断
// export const constantRoutes = [
//   {
//     path: "/",
//     redirect: "/login",
//   },
// ]

//constantRoutes 是动态路由，需要动态权限判断
// export const asyncRoutes = []

// const modules = import.meta.glob("../views/**/**.vue")
//

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
